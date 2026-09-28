/**
 * Referral code capture & persistence.
 *
 * Every invite link (agent or user) carries a SHORT alphanumeric code:
 *   https://install.skypaytop.cyou/nYrIso
 *   (old links like /download?ref=AGT4926 keep working)
 *
 * The code is captured the moment ANY page is opened with ?ref= (or the legacy
 * /<code>/register path) and stored on the device, so it survives the SMS/OTP
 * steps, refreshes and navigation. Zero referral drops.
 */
export const REF_CODE_KEY = 'hkwallet_ref_code';

const CODE_RE = /^[A-Za-z0-9]{4,20}$/;

export function normalizeRefCode(raw: string | null | undefined): string {
  const code = (raw ?? '').trim();
  return CODE_RE.test(code) ? code : '';
}

export function storeRefCode(raw: string | null | undefined): string {
  const code = normalizeRefCode(raw);
  if (!code || typeof window === 'undefined') return '';
  try {
    localStorage.setItem(REF_CODE_KEY, code);
  } catch {
    /* ignore */
  }
  return code;
}

export function readRefCode(): string {
  if (typeof window === 'undefined') return '';
  try {
    return normalizeRefCode(localStorage.getItem(REF_CODE_KEY));
  } catch {
    return '';
  }
}

export function clearRefCode(): void {
  try {
    localStorage.removeItem(REF_CODE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Reads ?ref= / ?ref_code= / ?code= from the current URL, or a
 * /<CODE>/register style path, and persists it. Safe to call on every render.
 */
export function captureRefFromUrl(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  // Also accept hash style links: /#/?invite=nYrIso
  const hashQuery = window.location.hash.split('?')[1];
  if (hashQuery) new URLSearchParams(hashQuery).forEach((v, k) => { if (!params.has(k)) params.set(k, v); });
  const fromQuery =
    params.get('ref') ?? params.get('ref_code') ?? params.get('code') ?? params.get('invite');
  if (fromQuery) return storeRefCode(fromQuery);

  const onInstall = window.location.hostname.startsWith('install.');
  const match = window.location.pathname.match(
    onInstall ? /^\/([A-Za-z0-9]{4,20})(?:\/register)?\/?$/ : /^\/([A-Za-z0-9]{4,20})\/register\/?$/,
  );
  if (match?.[1]) return storeRefCode(match[1]);
  return readRefCode();
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
/** Neutral 6-character invite code (e.g. nYrIso) — same style for users and agents. */
export function generateInviteCode(length = 6): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => CODE_CHARS[n % CODE_CHARS.length]).join('');
}
export function generateUserCode(): string {
  return generateInviteCode();
}
