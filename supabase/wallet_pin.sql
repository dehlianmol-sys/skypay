-- HK Wallet: six-digit withdrawal / UPI security PIN.
-- Safe to run more than once.

alter table public.profiles
  add column if not exists wallet_pin text;

-- Only ever six digits.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_wallet_pin_format'
  ) then
    alter table public.profiles
      add constraint profiles_wallet_pin_format
      check (wallet_pin is null or wallet_pin ~ '^[0-9]{6}$');
  end if;
end $$;
