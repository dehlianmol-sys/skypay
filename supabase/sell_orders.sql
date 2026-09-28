-- Sell Orders: admin-created payouts that hold / deduct / release user wallet.
-- Safe to run more than once.

create sequence if not exists public.sell_order_code_seq start 100001;

create table if not exists public.sell_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default ('SELL-' || nextval('public.sell_order_code_seq')::text),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  upi_id text not null,
  status text not null default 'pending' check (status in ('pending','success','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sell_orders_user_idx on public.sell_orders(user_id, created_at desc);

grant usage, select on sequence public.sell_order_code_seq to anon, authenticated;
grant select, insert, update, delete on public.sell_orders to anon, authenticated;
grant all on public.sell_orders to service_role;

alter table public.sell_orders enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'sell_orders' and policyname = 'sell_orders_all') then
    create policy sell_orders_all on public.sell_orders for all to anon, authenticated using (true) with check (true);
  end if;
end $$;

-- Wallet sync: balance is deducted ONLY when status is 'success'.
-- Pending keeps the full balance in the user's wallet (no hold, no minus).
-- failed (or deleted) returns any deducted amount. Atomic, runs in database.
create or replace function public.sell_orders_wallet_sync()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_old_deducted numeric := 0;
  v_new_deducted numeric := 0;
  v_user uuid;
  v_wallet numeric;
begin
  if tg_op in ('UPDATE','DELETE') and old.status = 'success' then v_old_deducted := old.amount; end if;
  if tg_op in ('INSERT','UPDATE') and new.status = 'success' then v_new_deducted := new.amount; end if;

  if tg_op = 'UPDATE' and old.user_id <> new.user_id then
    update public.profiles p set wallet = p.wallet + v_old_deducted where p.id = old.user_id;
    v_old_deducted := 0;
  end if;

  if tg_op = 'DELETE' then v_user := old.user_id; else v_user := new.user_id; end if;

  if v_new_deducted - v_old_deducted <> 0 then
    select p.wallet into v_wallet from public.profiles p where p.id = v_user for update;
    if v_new_deducted > v_old_deducted and coalesce(v_wallet, 0) < v_new_deducted - v_old_deducted then
      raise exception 'Insufficient user balance for this sell order';
    end if;
    update public.profiles p set wallet = round(p.wallet - (v_new_deducted - v_old_deducted), 2) where p.id = v_user;
  end if;

  if tg_op = 'UPDATE' then new.updated_at := now(); end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

drop trigger if exists sell_orders_wallet_sync on public.sell_orders;
create trigger sell_orders_wallet_sync
  before insert or update or delete on public.sell_orders
  for each row execute function public.sell_orders_wallet_sync();

-- Realtime so users see status changes instantly.
do $$ begin
  alter publication supabase_realtime add table public.sell_orders;
exception when duplicate_object then null; when undefined_object then null; end $$;
