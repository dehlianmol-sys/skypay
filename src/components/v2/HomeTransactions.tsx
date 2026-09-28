import { useEffect, useMemo, useState } from 'react';
import { REMOTE_IMAGES } from "@/lib/remoteImages";
import type { CSSProperties } from 'react';
import type { Deposit } from '@/lib/types';
import { isOrderExpired } from '@/lib/orderStatus';

export type TxCurrency = 'INR' | 'USDT';
export type TxRowStatus = 'Processing' | 'Completed' | 'Close';

interface Blueprint {
  image: string;
  sourceWidth: number;
  sourceHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The six supplied blueprints: one per currency and status (exact crop values). */
const PROCESSING_ART: Blueprint = {
  image: REMOTE_IMAGES["https://i.ibb.co/1tx898r5/file-00000000f2e482119bddeae40675f651.png"],
  sourceWidth: 2004,
  sourceHeight: 785,
  x: 115,
  y: 260,
  width: 270,
  height: 270,
};
const COMPLETED_ART: Blueprint = {
  image: REMOTE_IMAGES["https://i.ibb.co/cc1Cx8p1/file-000000000f7c8208bf7b57ee068740d7.png"],
  sourceWidth: 1774,
  sourceHeight: 887,
  x: 90,
  y: 320,
  width: 240,
  height: 240,
};
const CLOSE_ART: Blueprint = {
  image: REMOTE_IMAGES["https://i.ibb.co/PsvVCvd4/file-00000000a1548211bfaa38688fe95d75.png"],
  sourceWidth: 1254,
  sourceHeight: 1254,
  x: 30,
  y: 520,
  width: 200,
  height: 200,
};

export const TX_BLUEPRINTS: Record<TxCurrency, Record<TxRowStatus, Blueprint>> = {
  INR: { Processing: PROCESSING_ART, Completed: COMPLETED_ART, Close: CLOSE_ART },
  USDT: { Processing: PROCESSING_ART, Completed: COMPLETED_ART, Close: CLOSE_ART },
};

/** Every image this list can ever show — used by the startup preloader. */
export const TX_IMAGE_URLS = [PROCESSING_ART.image, COMPLETED_ART.image, CLOSE_ART.image];

const css = `
.hk-tx-list { margin-top: 4px; }
.hk-tx-row { min-width: 0; padding: 16px 0; display: grid; grid-template-columns: 58px minmax(0,1fr) max-content; align-items: center; gap: 12px; border-bottom: 1px solid #e9edf2; width: 100%; background: transparent; text-align: left; transition: background-color 160ms ease, transform 160ms ease; }
.hk-tx-row:last-child { border-bottom: 0; }
.hk-tx-row.is-processing { cursor: pointer; }
.hk-tx-row.is-processing:active { transform: scale(.995); }
.hk-tx-icon { position: relative; width: 56px; height: 56px; overflow: hidden; border-radius: 50%; background: #ffdfe0; }
.hk-tx-icon img { position: absolute; max-width: none; display: block; }
.hk-tx-copy { min-width: 0; }
.hk-tx-title { overflow: hidden; margin: 0 0 6px; text-overflow: ellipsis; white-space: nowrap; font-size: 16px; line-height: 1.15; font-weight: 700; letter-spacing: -.025em; color: #111318; }
.hk-tx-time { margin: 0; color: #9e9e9e; font-size: 12px; line-height: 1.25; }
.hk-tx-meta { min-width: 96px; display: flex; align-items: flex-end; flex-direction: column; gap: 7px; }
.hk-tx-amount { margin: 0; white-space: nowrap; font-size: 16px; line-height: 1.15; font-weight: 700; letter-spacing: -.025em; color: #111318; }
.hk-tx-badge { display: inline-flex; align-items: center; justify-content: center; min-height: 29px; padding: 6px 10px; border-radius: 10px; font-size: 12px; line-height: 1; font-weight: 600; white-space: nowrap; }
.hk-tx-badge.processing { background: #fff4d7; color: #e5ad1b; }
.hk-tx-badge.completed { background: #def7ed; color: #209264; }
.hk-tx-badge.close { background: #ffe6e7; color: #f3575b; }
@media (max-width: 370px) {
  .hk-tx-row { grid-template-columns: 52px minmax(0,1fr) max-content; gap: 9px; }
  .hk-tx-icon { width: 50px; height: 50px; }
  .hk-tx-meta { min-width: 88px; }
  .hk-tx-amount { font-size: 15px; }
}
`;

const pad = (value: number) => String(value).padStart(2, '0');

function formatTimestamp(value: number) {
  const date = new Date(value);
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-') +
    ' ' +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':')
  );
}

export function txCurrency(deposit: Deposit): TxCurrency {
  return deposit.transactionType.toLowerCase().includes('usdt') ? 'USDT' : 'INR';
}

/** Same status rules as the order cards: 30 minutes pending, then closed. */
export function txStatus(deposit: Deposit, now: number): TxRowStatus {
  if (deposit.status === 'Success') return 'Completed';
  if (deposit.status === 'Rejected') return 'Close';
  return isOrderExpired(deposit, now) ? 'Close' : 'Processing';
}

function amountText(currency: TxCurrency, amount: number) {
  const value = Number(amount || 0).toFixed(2);
  return `\u20b9 ${value}`;
}

function iconStyle(art: Blueprint): CSSProperties {
  return {
    width: `${(art.sourceWidth / art.width) * 100}%`,
    height: `${(art.sourceHeight / art.height) * 100}%`,
    left: `${(-art.x / art.width) * 100}%`,
    top: `${(-art.y / art.height) * 100}%`,
  };
}

export default function HomeTransactions({
  deposits,
  onOpenProcessing,
}: {
  deposits: Deposit[];
  onOpenProcessing: (deposit: Deposit) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 30000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pageshow', tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('pageshow', tick);
    };
  }, []);

  const rows = useMemo(
    () =>
      deposits.map((deposit) => {
        const currency = txCurrency(deposit);
        const status = txStatus(deposit, now);
        return { deposit, currency, status, art: TX_BLUEPRINTS[currency][status] };
      }),
    [deposits, now],
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hk-tx-list" aria-live="polite">
        {rows.map(({ deposit, currency, status, art }) => {
          const processing = status === 'Processing';
          const title = `Deposit ${currency}`;
          const createdAt = Date.parse(deposit.createdAt);
          const content = (
            <>
              <div className="hk-tx-icon" aria-hidden="true">
                <img src={art.image} alt="" style={iconStyle(art)} loading="eager" />
              </div>
              <div className="hk-tx-copy">
                <h3 className="hk-tx-title">{title}</h3>
                <p className="hk-tx-time">{formatTimestamp(createdAt)}</p>
              </div>
              <div className="hk-tx-meta">
                <p className="hk-tx-amount">{amountText(currency, deposit.amount)}</p>
                <span className={`hk-tx-badge ${status.toLowerCase()}`}>{status}</span>
              </div>
            </>
          );

          return processing ? (
            <button
              key={deposit.id}
              type="button"
              className="hk-tx-row is-processing"
              aria-label={`Pay for ${title}, ${amountText(currency, deposit.amount)}`}
              onClick={() => {
                if (txStatus(deposit, Date.now()) !== 'Processing') {
                  setNow(Date.now());
                  return;
                }
                onOpenProcessing(deposit);
              }}
            >
              {content}
            </button>
          ) : (
            <article key={deposit.id} className="hk-tx-row">
              {content}
            </article>
          );
        })}
      </div>
    </>
  );
}
