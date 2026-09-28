import type { Deposit } from './types';

export const ORDER_TIMEOUT_MS = 30 * 60 * 1000;
/** Extra window the user gets after submitting the payment proof. */
export const SUBMIT_EXTENSION_MS = 120 * 60 * 1000;

/** True once the user has submitted a voucher / UTR for this order. */
export function isOrderSubmitted(order: Pick<Deposit, 'receiptBase64' | 'utr'>): boolean {
  return Boolean(order.receiptBase64 || (order.utr && order.utr.trim()));
}

export function orderDeadline(order: Deposit): number {
  const expiresAt = Date.parse(order.expiresAt);
  if (Number.isFinite(expiresAt)) return expiresAt;
  return Date.parse(order.createdAt) + ORDER_TIMEOUT_MS;
}

export function isOrderExpired(order: Deposit, now = Date.now()): boolean {
  // A submitted order is locked with the admin: it never auto-fails, only the
  // admin can approve or reject it.
  if (isOrderSubmitted(order)) return false;
  return order.status === 'Pending' && now >= orderDeadline(order);
}

export function isOrderPending(order: Deposit, now = Date.now()): boolean {
  return order.status === 'Pending' && !isOrderExpired(order, now);
}

/** Short 6-digit display code for cards and lists. */
export function shortCode(order: Pick<Deposit, "id">): string {
  return order.id.replace(/-/g, "").slice(-6).toUpperCase();
}

/** Full, stable order code used on the actual payment detail page. */
export function orderCode(order: Pick<Deposit, 'id' | 'createdAt'>): string {
  const stamp = new Date(order.createdAt).toISOString().replace(/\D/g, '').slice(0, 14);
  const tail = order.id.replace(/-/g, '').slice(-8).toUpperCase().padEnd(8, '0');
  return `R${stamp}${tail}`;
}