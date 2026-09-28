import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { setText, wireBack, wireTabs } from '@/lib/v2dom';
import OrdersRef from './OrdersRef';
import type { Deposit } from '@/lib/types';
import { isOrderPending } from '@/lib/orderStatus';
import { useSellOrders } from '@/lib/sellOrders';

/** Payment history / orders screen — balance and totals read live from the account. */
export default function OrdersV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentUser, deposits, refreshData } = useStore();
  const [now, setNow] = useState(() => Date.now());
  const { orders: sellOrders } = useSellOrders(currentUser?.id);
  // Wallet changes from sell orders arrive through the live profile sync; refresh promptly too.
  const sellKey = sellOrders.map((o) => o.id + o.status).join('|');
  useEffect(() => { if (sellKey) void refreshData(); }, [sellKey, refreshData]);
  // Newest order first.
  const mine = useMemo(
    () =>
      deposits
        .filter((d) => d.userId === currentUser?.id)
        .slice()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [deposits, currentUser?.id],
  );
  const inrOrders = useMemo(
    () => mine.filter((deposit) => !deposit.transactionType.toLowerCase().includes('usdt')),
    [mine],
  );
  const usdtOrders = useMemo(
    () => mine.filter((deposit) => deposit.transactionType.toLowerCase().includes('usdt')),
    [mine],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reward = mine
      .filter((d) => d.status === 'Success')
      .reduce((s, d) => s + (d.reward || 0), 0);
    const pending = mine
      .filter((d) => isOrderPending(d, now))
      .reduce((s, d) => s + d.amount, 0);
    const balance = (currentUser?.wallet ?? 0).toFixed(2);
    // Every balance label in this design, whichever markup variant it uses.
    setText(root, '.balance-value', `∫ ${balance}`);
    setText(root, '.balance-amount', balance);
    setText(root, '#balanceAmount', balance);
    const details = root.querySelectorAll('.balance-details dd');
    if (details[0]) details[0].textContent = `∫ ${reward.toFixed(2)}`;
    if (details[1]) details[1].textContent = `∫ ${pending.toFixed(2)}`;
    const cleanups = [
      wireBack(root, () => {
        if (window.history.length > 1) window.history.back();
        else navigate('/');
      }),
      wireTabs(root),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [navigate, currentUser, mine, now]);

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      void refreshData();
    };
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    window.addEventListener('focus', tick);
    window.addEventListener('pageshow', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      window.removeEventListener('pageshow', tick);
    };
  }, [refreshData]);

  const openPending = (order: Deposit) => {
    try { sessionStorage.setItem('hkwallet_selected_order', order.id); } catch { /* ignore */ }
    navigate(order.transactionType.toLowerCase().includes('usdt') ? '/usdt-deposit' : '/order');
  };

  return (
    <div ref={rootRef}>
      <OrdersRef inrOrders={inrOrders} usdtOrders={usdtOrders} sellOrders={sellOrders} onOpenPending={openPending} />
    </div>
  );
}
