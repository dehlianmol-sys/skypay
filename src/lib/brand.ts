/**
 * Single source of truth for brand assets and download links.
 *
 * The logo comes from the SAME source the admin panel uses:
 * the `logos` storage bucket, file `Vivrapaylogo.png`.
 * Replace that file in storage and it updates everywhere (admin + user side).
 */
import { getLogoUrl } from './storage';

export const APP_NAME = 'Skypay';
export const APP_TAGLINE = 'Earn Money Online';

/** Existing Skypay mark used only while the database logo is unavailable. */
export const APP_LOGO_FALLBACK = '/favicon.png';

/**
 * The real logo always comes from the database storage bucket the admin panel
 * uploads to, so user side and admin side can never drift apart.
 */
const databaseLogoUrl = getLogoUrl('Vivrapaylogo.png');
export const DATABASE_APP_LOGO = databaseLogoUrl || '';
export const APP_LOGO = DATABASE_APP_LOGO || APP_LOGO_FALLBACK;

/**
 * The signed main APK ships with the site itself:
 * `public/downloads/app.apk`. Yahi original placing hai — isse mat badlo.
 */
export const APK_URL = '/downloads/app.apk';
export const APK_FILENAME = 'app.apk';

/** Main app (login + dashboard) lives on the app subdomain. */
export const SITE_ORIGIN = 'https://app.skypaytop.cyou';
/** APK download / invite landing lives on the install subdomain. */
export const INSTALL_ORIGIN = 'https://install.skypaytop.cyou';
export const APP_LOGIN_URL = `${SITE_ORIGIN}/login`;
/** True when the current page is opened on the install subdomain. */
export const isInstallHost = () =>
  typeof window !== 'undefined' && window.location.hostname.startsWith('install.');
/** Canonical invite link, e.g. https://install.skypaytop.cyou/nYrIso */
export const referralLink = (code: string) =>
  `${INSTALL_ORIGIN}/${encodeURIComponent(code.trim())}`;

/** Referral rebate levels shown across the app. */
export const REBATE_LEVELS = [
  { name: 'Level 1', rate: '1.5%' },
  { name: 'Level 2', rate: '0.5%' },
  { name: 'Level 3', rate: '0.3%' },
];

/** Default referral commission for a normal user, in percent. */
export const DEFAULT_COMMISSION_PERCENT = 4;
