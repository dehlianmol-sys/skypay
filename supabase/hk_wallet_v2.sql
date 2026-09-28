-- ===========================================================================
-- HK Wallet — V2 update (banners with notice type, wallet user id, task tiers)
-- 100% NON-DESTRUCTIVE: no DROP, no DELETE, no data loss. Safe to run again.
-- Run this in Supabase -> SQL Editor.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Banners: home, daily notice, and ordered wallet-install tutorial images
-- ---------------------------------------------------------------------------
alter table public.banners add column if not exists banner_type text default 'normal';
alter table public.banners add column if not exists title text;
alter table public.banners add column if not exists notice_text text;
alter table public.banners add column if not exists is_active boolean default true;
alter table public.banners add column if not exists sort_order integer default 0;

update public.banners set banner_type = 'normal' where banner_type is null;
update public.banners set is_active = true where is_active is null;

do $$
begin
  alter table public.banners drop constraint if exists banners_banner_type_check;
  alter table public.banners
    add constraint banners_banner_type_check
    check (banner_type in ('normal', 'notice', 'tutorial'));
end $$;

-- Only one notice banner is shown at a time (the newest active one).
create index if not exists banners_type_active_idx
  on public.banners (banner_type, is_active, created_at desc);

grant select on public.banners to anon, authenticated;
grant all on public.banners to service_role;

-- ---------------------------------------------------------------------------
-- 2. Wallet user id = last 6 digits of the phone number
--    (kept in sync automatically; existing rows are backfilled)
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists user_id text;

update public.profiles
set user_id = right(regexp_replace(phone, '\D', '', 'g'), 6)
where user_id is null
  and phone is not null
  and length(regexp_replace(phone, '\D', '', 'g')) >= 6;

create index if not exists profiles_user_id_idx on public.profiles (user_id);

create or replace function public.hk_set_wallet_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.phone is not null
     and length(regexp_replace(new.phone, '\D', '', 'g')) >= 6 then
    new.user_id := right(regexp_replace(new.phone, '\D', '', 'g'), 6);
  end if;
  return new;
end $$;

drop trigger if exists hk_set_wallet_user_id_trg on public.profiles;
create trigger hk_set_wallet_user_id_trg
  before insert or update of phone on public.profiles
  for each row execute function public.hk_set_wallet_user_id();

-- ---------------------------------------------------------------------------
-- 3. Task settings: newbie reward, invite reward, daily tiers
-- ---------------------------------------------------------------------------
alter table public.app_settings add column if not exists invite_reward_amount numeric default 100;
alter table public.app_settings add column if not exists newbie_required_order_amount numeric default 3000;
alter table public.app_settings add column if not exists newbie_reward_amount numeric default 100;

create table if not exists public.daily_task_tiers (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null,
  reward numeric not null,
  created_at timestamptz not null default now()
);

grant select on public.daily_task_tiers to anon, authenticated;
grant all on public.daily_task_tiers to service_role;

alter table public.daily_task_tiers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_task_tiers'
      and policyname = 'daily_task_tiers_read'
  ) then
    create policy daily_task_tiers_read on public.daily_task_tiers
      for select using (true);
  end if;
end $$;

-- Default tiers (only inserted when the table is still empty)
insert into public.daily_task_tiers (amount, reward)
select * from (values
  (10000, 100),
  (20000, 150),
  (40000, 250),
  (50000, 300),
  (70000, 500)
) as t(amount, reward)
where not exists (select 1 from public.daily_task_tiers);

-- ---------------------------------------------------------------------------
-- 4. Daily task claims (one reward per user per day, claimable next day)
-- ---------------------------------------------------------------------------
create table if not exists public.daily_task_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_date date not null,
  volume numeric not null default 0,
  reward numeric not null default 0,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, task_date)
);

grant select, insert, update on public.daily_task_claims to authenticated;
grant select on public.daily_task_claims to anon;
grant all on public.daily_task_claims to service_role;

alter table public.daily_task_claims enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'daily_task_claims'
      and policyname = 'daily_task_claims_all'
  ) then
    create policy daily_task_claims_all on public.daily_task_claims
      for all using (true) with check (true);
  end if;
end $$;
