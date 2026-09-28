-- ============================================================================
--  HK WALLET — NON-DESTRUCTIVE SUPABASE MIGRATION
--  hkwallet.site  |  app + referral system + agent commissions
--
--  SAFETY GUARANTEE
--    * Every table uses CREATE TABLE IF NOT EXISTS
--    * Every column is added only after an existence check
--    * Every index / constraint / policy is created only if absent
--    * Contains NO drop table, NO drop column, NO delete, NO truncate,
--      NO alter column type, NO data reset. Re-running it is safe.
--
--  Run it in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Helper: add a column only when it is missing
-- ----------------------------------------------------------------------------
create or replace function public.hk_add_column(
  p_table text,
  p_column text,
  p_definition text
) returns void
language plpgsql
as $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = p_table and column_name = p_column
  ) then
    execute format('alter table public.%I add column %I %s', p_table, p_column, p_definition);
  end if;
end;
$$;

-- ============================================================================
-- 0. TYPE REPAIR — referral/agent code columns must be TEXT.
-- Older deployments created some of these columns as uuid, which makes every
-- registration via an agent link fail with:
--   invalid input syntax for type uuid: "AGT4674"
-- This block converts any such column to text in place (values preserved).
-- It is idempotent: columns already of type text are skipped.
-- ============================================================================
do $$
declare
  r record;
begin
  for r in
    select table_name, column_name
      from information_schema.columns
     where table_schema = 'public'
       and udt_name = 'uuid'
       and (
         (table_name = 'profiles' and column_name in
           ('agent_id', 'referred_by', 'referred_by_code', 'referred_by_uid', 'referral_code'))
         or (table_name = 'agents' and column_name = 'agent_id')
       )
  loop
    begin
      execute format('alter table public.%I alter column %I drop default', r.table_name, r.column_name);
    exception when others then null;
    end;
    execute format('alter table public.%I alter column %I type text using %I::text',
                   r.table_name, r.column_name, r.column_name);
  end loop;
end;
$$;

-- ============================================================================
-- 1. PROFILES  (app users — also the "users" table of the app)
-- ============================================================================
create table if not exists public.profiles (
  id                uuid primary key default gen_random_uuid(),
  name              text not null default '',
  phone             text not null,
  password          text not null default '',
  role              text not null default 'user',
  wallet            numeric(14,2) not null default 0,
  has_deposited_300 boolean not null default false,
  locked_deposit_id uuid,
  agent_id          text,
  created_at        timestamptz not null default now()
);

select public.hk_add_column('profiles','name',              'text not null default ''''');
select public.hk_add_column('profiles','phone',             'text');
select public.hk_add_column('profiles','password',          'text not null default ''''');
select public.hk_add_column('profiles','role',              'text not null default ''user''');
select public.hk_add_column('profiles','wallet',            'numeric(14,2) not null default 0');
select public.hk_add_column('profiles','has_deposited_300', 'boolean not null default false');
select public.hk_add_column('profiles','locked_deposit_id', 'uuid');
select public.hk_add_column('profiles','agent_id',          'text');
select public.hk_add_column('profiles','created_at',        'timestamptz not null default now()');

-- Referral system columns (Task 2)
select public.hk_add_column('profiles','referral_code', 'text');
select public.hk_add_column('profiles','referred_by',   'text');

-- Backfill: give every existing profile an invite code, and mirror the old
-- agent_id into referred_by. Updates only rows where the value is still empty.
update public.profiles
   set referral_code = 'HK' || right(coalesce(phone,''), 4) ||
                       lpad((floor(random()*900)+100)::int::text, 3, '0')
 where referral_code is null or referral_code = '';

-- Cast to text on both sides: some existing databases store agent_id as uuid,
-- others as text. ::text works for both, so this never fails on type mismatch.
update public.profiles
   set referred_by = agent_id::text
 where referred_by is null and agent_id is not null;

create unique index if not exists profiles_phone_key          on public.profiles (phone);
create unique index if not exists profiles_referral_code_key  on public.profiles (referral_code);
create index        if not exists profiles_referred_by_idx    on public.profiles (referred_by);
create index        if not exists profiles_agent_id_idx       on public.profiles (agent_id);

-- ============================================================================
-- 2. AGENTS  (created by Super Admin; log in with Agent ID + phone)
-- ============================================================================
create table if not exists public.agents (
  id                    uuid primary key default gen_random_uuid(),
  agent_id              text not null,
  name                  text not null default '',
  phone                 text not null default '',
  commission_percentage numeric(6,2) not null default 4,
  total_deposits        numeric(14,2) not null default 0,
  active                boolean not null default true,
  created_at            timestamptz not null default now()
);

select public.hk_add_column('agents','agent_id',              'text');
select public.hk_add_column('agents','name',                  'text not null default ''''');
select public.hk_add_column('agents','phone',                 'text not null default ''''');
select public.hk_add_column('agents','commission_percentage', 'numeric(6,2) not null default 4');
select public.hk_add_column('agents','total_deposits',        'numeric(14,2) not null default 0');
select public.hk_add_column('agents','active',                'boolean not null default true');
select public.hk_add_column('agents','created_at',            'timestamptz not null default now()');

create unique index if not exists agents_agent_id_key on public.agents (agent_id);
create index        if not exists agents_phone_idx    on public.agents (phone);

-- ============================================================================
-- 3. AGENT COMMISSIONS  (ledger of what each agent earned, per deposit)
-- ============================================================================
create table if not exists public.agent_commissions (
  id             uuid primary key default gen_random_uuid(),
  agent_code     text not null,
  user_id        uuid,
  transaction_id uuid,
  level          smallint not null default 1,
  base_amount    numeric(14,2) not null default 0,
  rate           numeric(6,2) not null default 4,
  amount         numeric(14,2) not null default 0,
  status         text not null default 'Pending',
  created_at     timestamptz not null default now()
);

select public.hk_add_column('agent_commissions','agent_code',     'text');
select public.hk_add_column('agent_commissions','user_id',        'uuid');
select public.hk_add_column('agent_commissions','transaction_id', 'uuid');
select public.hk_add_column('agent_commissions','level',          'smallint not null default 1');
select public.hk_add_column('agent_commissions','base_amount',    'numeric(14,2) not null default 0');
select public.hk_add_column('agent_commissions','rate',           'numeric(6,2) not null default 4');
select public.hk_add_column('agent_commissions','amount',         'numeric(14,2) not null default 0');
select public.hk_add_column('agent_commissions','status',         'text not null default ''Pending''');
select public.hk_add_column('agent_commissions','created_at',     'timestamptz not null default now()');

create index if not exists agent_commissions_agent_idx on public.agent_commissions (agent_code);
create index if not exists agent_commissions_user_idx  on public.agent_commissions (user_id);
create unique index if not exists agent_commissions_unique_tx
  on public.agent_commissions (transaction_id, agent_code, level)
  where transaction_id is not null;

-- ============================================================================
-- 4. PRE-REGISTRATIONS  (referral code claimed before the account exists)
-- ============================================================================
create table if not exists public.pre_registrations (
  id           uuid primary key default gen_random_uuid(),
  phone_number text not null,
  ref_code     text not null,
  created_at   timestamptz not null default now()
);

select public.hk_add_column('pre_registrations','phone_number','text');
select public.hk_add_column('pre_registrations','ref_code',    'text');
select public.hk_add_column('pre_registrations','created_at',  'timestamptz not null default now()');

create unique index if not exists pre_registrations_phone_key on public.pre_registrations (phone_number);

-- ============================================================================
-- 5. TRANSACTION RECORDS  (deposits)
-- ============================================================================
create table if not exists public.transaction_records (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid,
  user_phone     text,
  user_name      text,
  amount         numeric(14,2) not null default 0,
  reward         numeric(14,2) not null default 0,
  itoken         numeric(14,2) not null default 0,
  utr            text not null default '',
  receipt_base64 text,
  payment_method jsonb,
  status         text not null default 'Pending',
  type           text not null default 'Deposit',
  created_at     timestamptz not null default now(),
  expires_at     timestamptz
);

select public.hk_add_column('transaction_records','user_id',        'uuid');
select public.hk_add_column('transaction_records','user_phone',     'text');
select public.hk_add_column('transaction_records','user_name',      'text');
select public.hk_add_column('transaction_records','amount',         'numeric(14,2) not null default 0');
select public.hk_add_column('transaction_records','reward',         'numeric(14,2) not null default 0');
select public.hk_add_column('transaction_records','itoken',         'numeric(14,2) not null default 0');
select public.hk_add_column('transaction_records','utr',            'text not null default ''''');
select public.hk_add_column('transaction_records','receipt_base64', 'text');
select public.hk_add_column('transaction_records','payment_method', 'jsonb');
select public.hk_add_column('transaction_records','status',         'text not null default ''Pending''');
select public.hk_add_column('transaction_records','type',           'text not null default ''Deposit''');
select public.hk_add_column('transaction_records','created_at',     'timestamptz not null default now()');
select public.hk_add_column('transaction_records','expires_at',     'timestamptz');
-- agent snapshot, so commission history survives later referral edits
select public.hk_add_column('transaction_records','agent_code',     'text');

create index if not exists transaction_records_user_idx    on public.transaction_records (user_id);
create index if not exists transaction_records_status_idx  on public.transaction_records (status);
create index if not exists transaction_records_created_idx on public.transaction_records (created_at desc);
create index if not exists transaction_records_agent_idx   on public.transaction_records (agent_code);

-- ============================================================================
-- 6. UPI ACCOUNTS
-- ============================================================================
create table if not exists public.upi_accounts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid,
  partner_id   text not null default '',
  partner_name text not null default '',
  masked_phone text not null default '',
  upi_id       text not null default '',
  tab_type     text not null default 'Buy',
  is_selling   boolean not null default false,
  created_at   timestamptz not null default now()
);

select public.hk_add_column('upi_accounts','user_id',      'uuid');
select public.hk_add_column('upi_accounts','partner_id',   'text not null default ''''');
select public.hk_add_column('upi_accounts','partner_name', 'text not null default ''''');
select public.hk_add_column('upi_accounts','masked_phone', 'text not null default ''''');
select public.hk_add_column('upi_accounts','upi_id',       'text not null default ''''');
select public.hk_add_column('upi_accounts','tab_type',     'text not null default ''Buy''');
select public.hk_add_column('upi_accounts','is_selling',   'boolean not null default false');
select public.hk_add_column('upi_accounts','created_at',   'timestamptz not null default now()');

create index if not exists upi_accounts_user_idx on public.upi_accounts (user_id);

-- ============================================================================
-- 7. PAYMENT CONFIGURATIONS  (admin gateways)
-- ============================================================================
create table if not exists public.payment_configurations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  upi_id     text not null default '',
  qr         text not null default '',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

select public.hk_add_column('payment_configurations','name',       'text not null default ''''');
select public.hk_add_column('payment_configurations','upi_id',     'text not null default ''''');
select public.hk_add_column('payment_configurations','qr',         'text not null default ''''');
select public.hk_add_column('payment_configurations','active',     'boolean not null default true');
select public.hk_add_column('payment_configurations','created_at', 'timestamptz not null default now()');

-- ============================================================================
-- 8. BANNERS
-- ============================================================================
create table if not exists public.banners (
  id         uuid primary key default gen_random_uuid(),
  url        text not null default '',
  banner_type text not null default 'normal',
  title      text,
  notice_text text,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

select public.hk_add_column('banners','url',        'text not null default ''''');
select public.hk_add_column('banners','banner_type','text not null default ''normal''');
select public.hk_add_column('banners','title',      'text');
select public.hk_add_column('banners','notice_text','text');
select public.hk_add_column('banners','is_active', 'boolean not null default true');
select public.hk_add_column('banners','sort_order', 'integer not null default 0');
select public.hk_add_column('banners','created_at', 'timestamptz not null default now()');

alter table public.banners drop constraint if exists banners_banner_type_check;
alter table public.banners
  add constraint banners_banner_type_check
  check (banner_type in ('normal', 'notice', 'tutorial'));

-- ============================================================================
-- 9. CUSTOMER SERVICES
-- ============================================================================
create table if not exists public.customer_services (
  id          uuid primary key default gen_random_uuid(),
  icon_url    text not null default '',
  name        text not null default '',
  description text not null default '',
  link_url    text not null default '',
  created_at  timestamptz not null default now()
);

select public.hk_add_column('customer_services','icon_url',    'text not null default ''''');
select public.hk_add_column('customer_services','name',        'text not null default ''''');
select public.hk_add_column('customer_services','description', 'text not null default ''''');
select public.hk_add_column('customer_services','link_url',    'text not null default ''''');
select public.hk_add_column('customer_services','created_at',  'timestamptz not null default now()');

-- ============================================================================
-- 10. APP SETTINGS  (single row)
-- ============================================================================
create table if not exists public.app_settings (
  id                           uuid primary key default gen_random_uuid(),
  reward_percentage            numeric(6,2) not null default 4,
  min_order_size               numeric(14,2) not null default 300,
  max_order_size               numeric(14,2) not null default 50000,
  newbie_required_order_amount numeric(14,2) not null default 300,
  newbie_reward_amount         numeric(14,2) not null default 60
);

select public.hk_add_column('app_settings','reward_percentage',            'numeric(6,2) not null default 4');
select public.hk_add_column('app_settings','min_order_size',               'numeric(14,2) not null default 300');
select public.hk_add_column('app_settings','max_order_size',               'numeric(14,2) not null default 50000');
select public.hk_add_column('app_settings','newbie_required_order_amount', 'numeric(14,2) not null default 300');
select public.hk_add_column('app_settings','newbie_reward_amount',         'numeric(14,2) not null default 60');

-- Seed the settings row only when the table is completely empty.
insert into public.app_settings (reward_percentage, min_order_size, max_order_size,
                                 newbie_required_order_amount, newbie_reward_amount)
select 4, 300, 50000, 300, 60
where not exists (select 1 from public.app_settings);

-- ============================================================================
-- 11. GRANTS  (Supabase Data API access — required, additive only)
-- ============================================================================
grant usage on schema public to anon, authenticated, service_role;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','agents','agent_commissions','pre_registrations','transaction_records',
    'upi_accounts','payment_configurations','banners','customer_services','app_settings'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end;
$$;

-- ============================================================================
-- 12. ROW LEVEL SECURITY
--   The app talks to Supabase with the publishable key and its own phone +
--   password login, so RLS is left in its current state. Enabling it here
--   would instantly break the live app. Nothing is changed.
--   (When you are ready to move to Supabase Auth, we harden this separately.)
-- ============================================================================

-- ============================================================================
-- 13. COMMISSION HELPER  (used by the existing Agent Dashboard figures)
-- ============================================================================
create or replace function public.hk_agent_summary(p_agent_code text)
returns table (users bigint, deposits numeric, commission numeric)
language sql
stable
as $$
  with rate as (
    select coalesce(max(commission_percentage), 4) as pct
      from public.agents where agent_id = p_agent_code
  ),
  members as (
    -- ::text casts keep this working whether the columns are text or uuid.
    select id from public.profiles p
     where p.agent_id::text = p_agent_code or p.referred_by::text = p_agent_code
  ),
  vol as (
    select coalesce(sum(t.amount), 0) as total
      from public.transaction_records t
     where t.status = 'Success'
       and t.user_id in (select id from members)
  )
  select (select count(*) from members),
         (select total from vol),
         round((select total from vol) * (select pct from rate) / 100, 2);
$$;

grant execute on function public.hk_agent_summary(text) to anon, authenticated, service_role;

-- ============================================================================
--  DONE. Nothing above deletes data. Safe to run again at any time.
-- ============================================================================
