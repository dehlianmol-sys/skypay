-- HK Wallet: admin payment methods become bank transfer (IMPS) accounts.
-- Safe to run more than once.

alter table public.payment_configurations
  add column if not exists payee_name text,
  add column if not exists account_number text,
  add column if not exists ifsc text,
  add column if not exists transfer_type text default 'IMPS';

-- Existing UPI-only rows keep working: upi_id and qr stay optional.
alter table public.payment_configurations
  alter column upi_id drop not null;
