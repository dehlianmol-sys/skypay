import type { CSSProperties } from 'react';
import { REMOTE_IMAGES } from "@/lib/remoteImages";

export type TxType = 'purchase' | 'receive';
export type TxStatus = 'pending' | 'succeed' | 'failed';

interface Template {
  url: string;
  size: [number, number];
  crop: [number, number, number, number];
  amount: [number, number];
  reward?: [number, number];
  order: [number, number];
  time: [number, number];
  date: [number, number];
  copy: [number, number, number, number];
}

/** Geometry measured from the supplied card artwork (exact template values). */
export const TEMPLATES: Record<TxType, Record<TxStatus, Template>> = {
  purchase: {
    pending: {
      url: REMOTE_IMAGES["https://i.ibb.co/TDqSzLnJ/file-00000000496881fa95f582a7400996b5.png"],
      size: [640, 640],
      crop: [15, 223, 609, 179],
      amount: [100, 266],
      reward: [140, 325],
      order: [188, 372],
      time: [608, 325],
      date: [608, 382],
      copy: [285, 345, 45, 45],
    },
    succeed: {
      url: REMOTE_IMAGES["https://i.ibb.co/QLt1N5f/file-000000006e6081f598a11427faf76463.png"],
      size: [640, 640],
      crop: [15, 223, 609, 177],
      amount: [100, 266],
      reward: [140, 323],
      order: [188, 372],
      time: [608, 323],
      date: [608, 380],
      copy: [285, 351, 43, 43],
    },
    failed: {
      url: REMOTE_IMAGES["https://i.ibb.co/Sw2Lx2kL/file-000000009c808230a8192803a56359d3.png"],
      size: [640, 360],
      crop: [19, 104, 603, 153],
      amount: [101, 138],
      reward: [142, 194],
      order: [191, 233],
      time: [605, 194],
      date: [605, 243],
      copy: [289, 211, 41, 41],
    },
  },
  receive: {
    pending: {
      url: REMOTE_IMAGES["https://i.ibb.co/HfVB1SWG/file-00000000eb748230b0b7cfdf9c5d9ed3.png"],
      size: [640, 640],
      crop: [20, 238, 599, 160],
      amount: [100, 284],
      order: [191, 363],
      time: [603, 334],
      date: [603, 378],
      copy: [276, 344, 40, 40],
    },
    succeed: {
      url: REMOTE_IMAGES["https://i.ibb.co/HTJYDSrw/file-0000000081848211a39add96617a6ecc.png"],
      size: [640, 640],
      crop: [18, 235, 606, 160],
      amount: [100, 279],
      order: [191, 359],
      time: [607, 331],
      date: [607, 375],
      copy: [276, 338, 46, 46],
    },
    failed: {
      url: REMOTE_IMAGES["https://i.ibb.co/9kz3J31x/file-0000000087f481f5af407d261b557cdd.png"],
      size: [640, 640],
      crop: [22, 238, 597, 159],
      amount: [100, 283],
      order: [192, 361],
      time: [603, 333],
      date: [603, 377],
      copy: [275, 342, 39, 40],
    },
  },
};

const pad = (value: number) => String(value).padStart(2, '0');

function stamp(createdAt: number) {
  const date = new Date(createdAt);
  return {
    time: [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':'),
    date: [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-'),
  };
}

/** Currency is intentionally not shown beside the amount (matches the art). */
function amountText(amount: number) {
  const value = Math.abs(amount);
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function fieldStyle(point: [number, number], crop: [number, number, number, number]): CSSProperties {
  const [left, top, width, height] = crop;
  return {
    left: `${((point[0] - left) / width) * 100}%`,
    top: `${((point[1] - top) / height) * 100}%`,
  };
}

export interface TxCardProps {
  type: TxType;
  status: TxStatus;
  amount: number;
  reward?: number;
  orderCode: string;
  createdAt: number;
  /** Only used when a purchase card is pending — the whole card becomes the hitbox. */
  onPay?: () => void;
  onCopy?: (orderCode: string) => void;
}

const STATUS_STYLE: Record<TxStatus, { label: string; cls: string; icon: string }> = {
  failed: { label: 'Failed', cls: 'bg-[#FF4D4F]', icon: 'x' },
  succeed: { label: 'Succeed', cls: 'bg-[#00875A]', icon: 'check' },
  pending: { label: 'Pending', cls: 'bg-[#F5A623]', icon: 'clock' },
};

/** Clean white transaction card. */
export default function TxCard({
  type,
  status,
  amount,
  reward = 0,
  orderCode,
  createdAt,
  onPay,
  onCopy,
}: TxCardProps) {
  const marks = stamp(createdAt);
  const badge = STATUS_STYLE[status];
  const payable = type === 'purchase' && status === 'pending' && !!onPay;

  return (
    <article
      className={`relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ${payable ? 'cursor-pointer' : ''}`}
      data-status={status}
      data-order-code={orderCode}
      onClick={payable ? onPay : undefined}
      aria-label={`${type === 'purchase' ? 'Purchase' : 'Receive'}, ${amountText(amount)}, ${badge.label}, order ${orderCode}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex items-center gap-1 text-2xl font-bold text-[#00875A] tabular-nums">+ ∫ {amountText(amount)}</span>
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white ${badge.cls}`}>
          <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-white/30">
            <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {badge.icon === 'x' && <path d="M3 3l6 6M9 3L3 9" />}
              {badge.icon === 'check' && <path d="M2.5 6.5l2.5 2.5 4.5-5" />}
              {badge.icon === 'clock' && <path d="M6 3v3l2 1" />}
            </svg>
          </span>
          {badge.label}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0 space-y-1.5">
          {type === 'purchase' && (
            <p className="text-sm font-semibold text-gray-700">Reward: <span className="text-[#2864B4]">+ ∫ {reward.toFixed(2).replace(/\.00$/, '')}</span></p>
          )}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <span>Order Code:</span>
            <button
              type="button"
              title="Copy order code"
              aria-label={`Copy order code ${orderCode}`}
              className="flex items-center gap-1 rounded bg-[#E8F3ED] px-2 py-0.5 font-mono text-xs text-gray-700"
              onClick={(event) => {
                event.stopPropagation();
                void navigator.clipboard?.writeText(orderCode).catch(() => undefined);
                onCopy?.(orderCode);
              }}
            >
              {orderCode}
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-[#00875A]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="2" width="9" height="12" rx="1.5" /><path d="M6.5 6h4M6.5 9h4" /></svg>
            </button>
          </div>
        </div>
        <div className="shrink-0 text-right text-xs font-semibold text-gray-500 tabular-nums">
          <p>{marks.time}</p>
          <p className="mt-1">{marks.date}</p>
        </div>
      </div>
    </article>
  );
}
