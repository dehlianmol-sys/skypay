-- Fix: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- Safe to run multiple times. No data is deleted.
CREATE UNIQUE INDEX IF NOT EXISTS agent_commission_ledger_deposit_uidx
  ON public.agent_commission_ledger (deposit_id) WHERE deposit_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.credit_agent_commission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
  v_agent   public.agents%ROWTYPE;
  v_code text; v_rate numeric; v_amount numeric; v_commission numeric;
BEGIN
  IF NEW.status IS DISTINCT FROM 'Success' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'Success' THEN RETURN NEW; END IF;
  SELECT * INTO v_profile FROM public.profiles WHERE id = NEW.user_id;
  IF NOT FOUND THEN RETURN NEW; END IF;
  v_code := upper(coalesce(nullif(trim(v_profile.referred_by), ''), ''));
  IF v_code = '' THEN RETURN NEW; END IF;
  SELECT * INTO v_agent FROM public.agents WHERE upper(agent_id) = v_code;
  IF NOT FOUND THEN RETURN NEW; END IF;
  v_amount := coalesce(NEW.amount, 0);
  v_rate := coalesce(v_agent.commission_percentage, 0);
  v_commission := round((v_amount * v_rate) / 100.0, 2);
  IF v_commission <= 0 THEN RETURN NEW; END IF;

  INSERT INTO public.agent_commission_ledger (
    agent_id, agent_code, user_id, user_name, user_phone,
    deposit_id, deposit_amount, rate_percentage, commission_amount
  ) VALUES (
    v_agent.id, v_agent.agent_id, v_profile.id, v_profile.name, v_profile.phone,
    NEW.id, v_amount, v_rate, v_commission
  )
  ON CONFLICT (deposit_id) WHERE deposit_id IS NOT NULL DO NOTHING;

  IF FOUND THEN
    UPDATE public.agents
       SET wallet_balance   = coalesce(wallet_balance, 0) + v_commission,
           total_commission = coalesce(total_commission, 0) + v_commission,
           total_deposits   = coalesce(total_deposits, 0) + v_amount
     WHERE id = v_agent.id;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block a deposit approval because of commission bookkeeping.
  RAISE WARNING 'credit_agent_commission skipped: %', SQLERRM;
  RETURN NEW;
END;
$$;
