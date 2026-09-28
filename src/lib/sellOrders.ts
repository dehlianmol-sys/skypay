import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

export type SellStatus = 'pending' | 'success' | 'failed';

export interface SellOrder {
  id: string;
  orderCode: string;
  userId: string;
  amount: number;
  upiId: string;
  status: SellStatus;
  createdAt: string;
  updatedAt: string;
}

interface Row {
  id: string; order_code: string; user_id: string; amount: number | string;
  upi_id: string; status: SellStatus; created_at: string; updated_at: string;
}

const map = (r: Row): SellOrder => ({
  id: r.id, orderCode: r.order_code, userId: r.user_id, amount: Number(r.amount),
  upiId: r.upi_id, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
});

/** Live sell orders. Pass a userId for one user, or null for all (admin). */
export function useSellOrders(userId: string | null | undefined, all = false) {
  const [orders, setOrders] = useState<SellOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!all && !userId) { setOrders([]); setLoading(false); return; }
    let q = supabase.from('sell_orders').select('*').order('created_at', { ascending: false }).limit(all ? 1000 : 200);
    if (!all && userId) q = q.eq('user_id', userId);
    const { data, error } = await q;
    if (!error) setOrders(((data ?? []) as Row[]).map(map));
    setLoading(false);
  }, [userId, all]);

  useEffect(() => {
    void reload();
    const channel = supabase
      .channel(`sell-orders-${all ? 'all' : userId ?? 'none'}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'sell_orders',
        ...(all || !userId ? {} : { filter: `user_id=eq.${userId}` }),
      }, () => void reload())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [reload, all, userId]);

  return { orders, loading, reload };
}

const genCode = () => `SELL-${Math.floor(100000 + Math.random() * 900000)}`;

export async function createSellOrder(input: {
  userId: string; amount: number; upiId: string; status: SellStatus; createdAt: string;
}) {
  // Retry on the rare order_code unique-collision so a clean SELL-XXXXXX code is guaranteed.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from('sell_orders').insert({
      order_code: genCode(),
      user_id: input.userId, amount: input.amount, upi_id: input.upiId,
      status: input.status, created_at: input.createdAt,
    });
    if (!error) return;
    if (!/order_code|duplicate|unique/i.test(error.message)) throw new Error(error.message);
  }
  throw new Error('Could not generate a unique order code, please try again');
}

export async function updateSellOrder(id: string, patch: {
  status?: SellStatus; amount?: number; upiId?: string; createdAt?: string;
}) {
  const row: Record<string, unknown> = {};
  if (patch.status) row.status = patch.status;
  if (patch.amount !== undefined) row.amount = patch.amount;
  if (patch.upiId) row.upi_id = patch.upiId;
  if (patch.createdAt) row.created_at = patch.createdAt;
  const { error } = await supabase.from('sell_orders').update(row).eq('id', id);
  if (error) throw new Error(error.message);
}
