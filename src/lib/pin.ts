/**
 * Six-digit wallet PIN, stored in profiles.wallet_pin.
 * Run supabase/wallet_pin.sql once so the column exists.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

export async function fetchWalletPin(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('wallet_pin')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  const pin = (data as { wallet_pin?: string | null } | null)?.wallet_pin;
  return pin ? String(pin) : null;
}

export async function saveWalletPin(
  userId: string,
  pin: string,
): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({ wallet_pin: pin })
    .eq('id', userId)
    .select('id');
  if (error) {
    return {
      ok: false,
      message: /wallet_pin/i.test(error.message)
        ? 'PIN storage is not set up yet. Run supabase/wallet_pin.sql in your database.'
        : error.message,
    };
  }
  return { ok: true, message: 'PIN set successfully.' };
}

/** Live PIN state for the signed-in user. */
export function useWalletPin(userId: string | undefined) {
  const [pin, setPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setPin(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setPin(await fetchWalletPin(userId));
    setLoading(false);
  }, [userId]);

  useEffect(() => { void reload(); }, [reload]);

  return { pin, hasPin: Boolean(pin), loading, reload };
}
