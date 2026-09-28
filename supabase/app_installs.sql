-- ---------------------------------------------------------------------------
-- Per-user APK download / install tracking.
-- One row per user per wallet app (freecharge, phonepe, mobikwik, paytm...).
-- The Add Tool "Submit" button stays locked until installed_at is set.
-- Run this file once in the Supabase SQL editor.
-- ---------------------------------------------------------------------------
create table if not exists public.app_installs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  tool_id text not null,
  downloaded_at timestamptz,
  installed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, tool_id)
);

grant select, insert, update on public.app_installs to authenticated;
grant select, insert, update on public.app_installs to anon;
grant all on public.app_installs to service_role;

alter table public.app_installs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_installs'
      and policyname = 'app_installs_all'
  ) then
    create policy app_installs_all on public.app_installs
      for all using (true) with check (true);
  end if;
end $$;
