-- ============================================================================
-- HK WALLET — REFERRAL + COMMISSION ENGINE (NON-DESTRUCTIVE)
-- Safe to run multiple times. No DROP TABLE, no DROP COLUMN, no data loss.
-- Run in Supabase → SQL Editor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. REFERRAL COLUMNS (short codes)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by  text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 4;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_uidx
  ON public.profiles (referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_referred_by_idx ON public.profiles (referred_by);

-- Backfill a short code for every existing user that has none.
UPDATE public.profiles
   SET referral_code = 'USR' || lpad(((floor(random() * 90000) + 10000))::int::text, 5, '0')
 WHERE referral_code IS NULL;

-- ---------------------------------------------------------------------------
-- 2. AGENT WALLET COLUMNS
-- ---------------------------------------------------------------------------
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS wallet_balance   numeric NOT NULL DEFAULT 0;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS total_commission numeric NOT NULL DEFAULT 0;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS total_settled    numeric NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX IF NOT EXISTS agents_agent_id_uidx ON public.agents (agent_id);

-- ---------------------------------------------------------------------------
-- 3. COMMISSION LEDGER
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_commission_ledger (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        uuid NOT NULL,
  agent_code      text,
  user_id         uuid,
  user_name       text,
  user_phone      text,
  deposit_id      uuid NOT NULL,
  deposit_amount  numeric NOT NULL DEFAULT 0,
  rate_percentage numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'Unsettled',
  settled_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- One payout per deposit, ever. Makes re-approval idempotent.
CREATE UNIQUE INDEX IF NOT EXISTS agent_commission_ledger_deposit_uidx
  ON public.agent_commission_ledger (deposit_id);
CREATE INDEX IF NOT EXISTS agent_commission_ledger_agent_idx
  ON public.agent_commission_ledger (agent_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.agent_settlements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id   uuid NOT NULL,
  amount     numeric NOT NULL,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.agent_commission_ledger TO anon, authenticated;
GRANT ALL ON public.agent_commission_ledger TO service_role;
GRANT SELECT, INSERT ON public.agent_settlements TO anon, authenticated;
GRANT ALL ON public.agent_settlements TO service_role;

-- ---------------------------------------------------------------------------
-- 4. INSTANT COMMISSION ON ADMIN APPROVAL
--    Fires whenever a deposit becomes 'Success', from any admin screen.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.credit_agent_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile   public.profiles%ROWTYPE;
  v_agent     public.agents%ROWTYPE;
  v_code      text;
  v_rate      numeric;
  v_amount    numeric;
  v_commission numeric;
BEGIN
  IF NEW.status IS DISTINCT FROM 'Success' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'Success' THEN
    RETURN NEW; -- already approved before
  END IF;

  SELECT * INTO v_profile FROM public.profiles WHERE id = NEW.user_id;
  IF NOT FOUND THEN RETURN NEW; END IF;

  v_code := upper(coalesce(nullif(trim(v_profile.referred_by), ''), ''));
  IF v_code = '' THEN RETURN NEW; END IF;

  SELECT * INTO v_agent FROM public.agents WHERE upper(agent_id) = v_code;
  IF NOT FOUND THEN RETURN NEW; END IF;  -- referred by a normal user, not an agent

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
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_agent_commission ON public.transaction_records;
CREATE TRIGGER trg_credit_agent_commission
AFTER INSERT OR UPDATE OF status ON public.transaction_records
FOR EACH ROW EXECUTE FUNCTION public.credit_agent_commission();

-- ---------------------------------------------------------------------------
-- 5. BACKFILL — pay commission for deposits already approved
-- ---------------------------------------------------------------------------
INSERT INTO public.agent_commission_ledger (
  agent_id, agent_code, user_id, user_name, user_phone,
  deposit_id, deposit_amount, rate_percentage, commission_amount
)
SELECT a.id, a.agent_id, p.id, p.name, p.phone,
       t.id, t.amount, a.commission_percentage,
       round((coalesce(t.amount,0) * coalesce(a.commission_percentage,0)) / 100.0, 2)
  FROM public.transaction_records t
  JOIN public.profiles p ON p.id = t.user_id
  JOIN public.agents   a ON upper(a.agent_id) = upper(p.referred_by)
 WHERE t.status = 'Success'
ON CONFLICT (deposit_id) WHERE deposit_id IS NOT NULL DO NOTHING;

UPDATE public.agents a
   SET total_commission = x.total,
       wallet_balance   = greatest(x.total - coalesce(a.total_settled, 0), 0)
  FROM (
    SELECT agent_id, sum(commission_amount) AS total
      FROM public.agent_commission_ledger
     GROUP BY agent_id
  ) x
 WHERE x.agent_id = a.id;

-- ---------------------------------------------------------------------------
-- 6. PARTIAL SETTLEMENTS (additive, safe to re-run)
--    Settlements are stored as ledger rows with entry_type = 'Settlement'
--    and a negative commission_amount. Lifetime earned is never reduced.
-- ---------------------------------------------------------------------------
ALTER TABLE public.agent_commission_ledger
  ADD COLUMN IF NOT EXISTS entry_type text NOT NULL DEFAULT 'Commission';
ALTER TABLE public.agent_commission_ledger
  ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE public.agent_commission_ledger
  ALTER COLUMN deposit_id DROP NOT NULL;

-- Only commission rows are unique-per-deposit; settlement rows have no deposit.
DROP INDEX IF EXISTS agent_commission_ledger_deposit_uidx;
CREATE UNIQUE INDEX IF NOT EXISTS agent_commission_ledger_deposit_uidx
  ON public.agent_commission_ledger (deposit_id)
  WHERE deposit_id IS NOT NULL;

-- Partial settlement: deducts only the entered amount from wallet_balance.
CREATE OR REPLACE FUNCTION public.settle_agent_commission(
  p_agent_id uuid,
  p_amount   numeric,
  p_note     text DEFAULT NULL
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance numeric;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Settlement amount must be greater than zero';
  END IF;

  SELECT coalesce(wallet_balance, 0) INTO v_balance
    FROM public.agents WHERE id = p_agent_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Agent not found'; END IF;
  IF p_amount > v_balance THEN
    RAISE EXCEPTION 'Amount is more than the unsettled balance';
  END IF;

  UPDATE public.agents
     SET wallet_balance = round(coalesce(wallet_balance,0) - p_amount, 2),
         total_settled  = round(coalesce(total_settled,0) + p_amount, 2)
   WHERE id = p_agent_id;

  INSERT INTO public.agent_settlements (agent_id, amount, note)
  VALUES (p_agent_id, p_amount, p_note);

  INSERT INTO public.agent_commission_ledger (
    agent_id, agent_code, commission_amount, entry_type, status, settled_at, note
  )
  SELECT a.id, a.agent_id, -p_amount, 'Settlement', 'Settled', now(), p_note
    FROM public.agents a WHERE a.id = p_agent_id;

  RETURN round(v_balance - p_amount, 2);
END;
$$;

GRANT EXECUTE ON FUNCTION public.settle_agent_commission(uuid, numeric, text)
  TO anon, authenticated, service_role;
