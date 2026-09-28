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

/** Image-based transaction card. All art, badges and labels come from the template images. */
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
  const template = TEMPLATES[type][status];
  const [imageWidth, imageHeight] = template.size;
  const [cropX, cropY, cropWidth, cropHeight] = template.crop;
  const marks = stamp(createdAt);
  const readable = status.charAt(0).toUpperCase() + status.slice(1);
  const [iconX, iconY, iconWidth, iconHeight] = template.copy;

  const cardStyle: CSSProperties = {
    aspectRatio: `${cropWidth} / ${cropHeight}`,
    backgroundImage: `url("${template.url}")`,
    backgroundSize: `${(imageWidth / cropWidth) * 100}% ${(imageHeight / cropHeight) * 100}%`,
    backgroundPosition:
      `${(cropX / (imageWidth - cropWidth)) * 100}% ` +
      `${(cropY / (imageHeight - cropHeight)) * 100}%`,
  };

  return (
    <article
      className="transaction-card"
      data-status={status}
      data-order-code={orderCode}
      style={cardStyle}
      aria-label={`${type === 'purchase' ? 'Purchase' : 'Receive'}, ${amountText(amount)}, ${readable}, order ${orderCode}`}
    >
      <span className="dynamic-field amount" style={fieldStyle(template.amount, template.crop)}>
        {amountText(amount)}
      </span>
      {type === 'purchase' && template.reward && (
        <span className="dynamic-field reward" style={fieldStyle(template.reward, template.crop)}>
          {`+ ∫ ${reward.toFixed(2)}`}
        </span>
      )}
      <span
        className="dynamic-field order-code"
        style={{
          ...fieldStyle(template.order, template.crop),
          // Keep the dynamic order text strictly before the printed copy icon.
          width: `${((iconX - template.order[0] - 5) / cropWidth) * 100}%`,
        }}
      >
        {orderCode}
      </span>
      <span className="dynamic-field timestamp" style={fieldStyle(template.time, template.crop)}>
        {marks.time}
      </span>
      <span className="dynamic-field timestamp" style={fieldStyle(template.date, template.crop)}>
        {marks.date}
      </span>

      {type === 'purchase' && status === 'pending' && onPay && (
        <button
          type="button"
          className="payment-hitbox"
          aria-label={`Continue payment for order ${orderCode}, ${amountText(amount)}`}
          onClick={onPay}
        />
      )}

      <button
        type="button"
        className="copy-hitbox"
        title="Copy order code"
        aria-label={`Copy order code ${orderCode}`}
        style={{
          left: `${((iconX - cropX) / cropWidth) * 100}%`,
          top: `${((iconY - cropY) / cropHeight) * 100}%`,
          width: `${(iconWidth / cropWidth) * 100}%`,
          height: `${(iconHeight / cropHeight) * 100}%`,
        }}
        onClick={(event) => {
          event.stopPropagation();
          void navigator.clipboard?.writeText(orderCode).catch(() => undefined);
          onCopy?.(orderCode);
        }}
      />
    </article>
  );
}
