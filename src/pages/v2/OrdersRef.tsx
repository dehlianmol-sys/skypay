import { useEffect, useRef, useState } from 'react';
import { css } from './css/OrdersRef';
import { css as txCss } from './css/TxCardRef';
import TxCard, { type TxStatus } from '@/components/v2/TxCard';
import type { Deposit } from '@/lib/types';
import { isOrderExpired, shortCode } from '@/lib/orderStatus';
import type { SellOrder } from '@/lib/sellOrders';

/** Pending orders automatically become failed 30 minutes after creation. */
function statusOf(deposit: Deposit, now: number): TxStatus {
  if (deposit.status === 'Success') return 'succeed';
  if (deposit.status === 'Rejected') return 'failed';
  return isOrderExpired(deposit, now) ? 'failed' : 'pending';
}

export default function OrdersRef({
  inrOrders,
  usdtOrders,
  sellOrders = [],
  onOpenPending,
}: {
  inrOrders: Deposit[];
  usdtOrders: Deposit[];
  sellOrders?: SellOrder[];
  onOpenPending?: (deposit: Deposit) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pageshow', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('pageshow', tick);
    };
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const cards = (orders: Deposit[]) => (
      orders.length === 0 ? (
        <p className="empty-state">No more data</p>
      ) : (
        <div className="transaction-list">
          {orders.map((order) => {
            const status = statusOf(order, now);
            return (
              <TxCard
                key={order.id}
                type="purchase"
                status={status}
                amount={order.amount}
                reward={order.reward || 0}
                orderCode={shortCode(order)}
                createdAt={Date.parse(order.createdAt)}
                onPay={
                  status === 'pending'
                    ? () => {
                        if (statusOf(order, Date.now()) !== 'pending') {
                          setNow(Date.now());
                          showToast('This purchase has expired.');
                          return;
                        }
                        onOpenPending?.(order);
                      }
                    : undefined
                }
                onCopy={() => showToast('Order code copied')}
              />
            );
          })}
        </div>
      )
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css + txCss }} />
      <div className="wallet-page">
        <header className="page-header">
          <button className="back-button" id="back-button" type="button" aria-label="Go back">
            ←
          </button>
          <h1 className="page-title">
            Payment History
          </h1>
        </header>
        <main id="payment-history">
          <nav className="main-tabs" role="tablist" aria-label="Payment history type">
            <button className="main-tab" id="receive-tab" type="button" role="tab" aria-selected="true" aria-controls="receive-panel">
              Receive
            </button>
            <button className="main-tab" id="purchase-tab" type="button" role="tab" aria-selected="false" aria-controls="purchase-panel" tabIndex={-1}>
              Purchase
            </button>
          </nav>
          <section id="receive-panel" role="tabpanel" aria-labelledby="receive-tab">
            <div className="orders-container" id="receive-orders-container" aria-live="polite">
              {sellOrders.length === 0 ? (
                <p className="empty-state">No more data</p>
              ) : (
                <div className="transaction-list">
                  {sellOrders.map((o) => (
                    <TxCard
                      key={o.id}
                      type="receive"
                      status={o.status === 'success' ? 'succeed' : o.status}
                      amount={o.amount}
                      orderCode={shortCode(o)}
                      createdAt={Date.parse(o.createdAt)}
                      onCopy={() => showToast('Order code copied')}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
          <section id="purchase-panel" role="tabpanel" aria-labelledby="purchase-tab" hidden>
            <section className="balance-card" aria-label="Wallet balance">
              <div>
                <p className="balance-label">
                  Balance:
                </p>
                <p className="balance-value">
                  ∫ 77
                </p>
              </div>
              <dl className="balance-details">
                <div>
                  <dt>
                    Reward:
                  </dt>
                  <dd>
                    ∫ 0
                  </dd>
                </div>
                <div>
                  <dt>
                    Pending:
                  </dt>
                  <dd>
                    ∫ 0
                  </dd>
                </div>
              </dl>
            </section>
            <nav className="currency-tabs" role="tablist" aria-label="Purchase currency">
              <button className="currency-tab" id="inr-tab" type="button" role="tab" aria-selected="true" aria-controls="purchase-inr-container">
                INR
              </button>
              <button className="currency-tab" id="usdt-tab" type="button" role="tab" aria-selected="false" aria-controls="purchase-usdt-container" tabIndex={-1}>
                USDT
              </button>
            </nav>
            <div className="orders-container" id="purchase-inr-container" role="tabpanel" aria-labelledby="inr-tab" aria-live="polite">
              {cards(inrOrders)}
            </div>
            <div className="orders-container" id="purchase-usdt-container" role="tabpanel" aria-labelledby="usdt-tab" aria-live="polite" hidden>
              {cards(usdtOrders)}
            </div>
          </section>
        </main>
      </div>
      {toast && <div className="tx-toast" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}
