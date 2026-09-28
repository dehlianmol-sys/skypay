/**
 * Warm the image cache once, right at app start, so screens never show
 * half-loaded artwork later on.
 */
import { TEMPLATES } from '@/components/v2/TxCard';
import { TX_IMAGE_URLS } from '@/components/v2/HomeTransactions';
import { TUTORIAL_COVERS } from '@/lib/tutorials';
import { APP_LOGO } from '@/lib/brand';
import { resolveCachedImage } from '@/lib/imageCache';

const done = new Set<string>();

function warmOne(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    // Give up on a slow asset instead of holding the loading screen hostage.
    const timer = window.setTimeout(finish, 4000);
    void resolveCachedImage(url)
      .then((local) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => { window.clearTimeout(timer); finish(); };
        image.onerror = () => { window.clearTimeout(timer); finish(); };
        image.src = local;
      })
      .catch(() => { window.clearTimeout(timer); finish(); });
  });
}

/** Downloads (and locally caches) the given images; resolves when all settle. */
export function preloadImages(urls: Array<string | undefined | null>): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const fresh = urls.filter((u): u is string => Boolean(u) && !done.has(u as string));
  fresh.forEach((u) => done.add(u));
  return Promise.all(fresh.map(warmOne)).then(() => undefined);
}

/** Every static image the wallet screens rely on. */
export function preloadAppImages(): Promise<void> {
  const cardArt = Object.values(TEMPLATES).flatMap((byStatus) =>
    Object.values(byStatus).map((template) => template.url),
  );
  return preloadImages([
    APP_LOGO,
    ...cardArt,
    ...TX_IMAGE_URLS,
    ...TUTORIAL_COVERS,
    '/ui/customer-support.png',
    '/ui/loading-wave.png',
  ]);
}

/** Only what the home screen shows first; the rest warms up in the background. */
export function preloadCriticalImages(): Promise<void> {
  const cardArt = Object.values(TEMPLATES).flatMap((byStatus) =>
    Object.values(byStatus).map((template) => template.url),
  );
  const critical = preloadImages([APP_LOGO, ...cardArt, ...TX_IMAGE_URLS, '/ui/loading-wave.png']);
  critical.then(() => { void preloadAppImages(); }).catch(() => undefined);
  return critical;
}

let shellWarmup: Promise<void> | null = null;

/** Warms the two most-used screen modules and static artwork once per app load. */
export function preloadAppShell(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (shellWarmup) return shellWarmup;
  shellWarmup = Promise.all([
    preloadCriticalImages(),
    import('@/pages/v2/HomeV2'),
    import('@/pages/v2/PaymentClaimsV2'),
  ]).then(() => undefined);
  return shellWarmup;
}
