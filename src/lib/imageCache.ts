/**
 * Cache-first image storage for every database-driven image.
 *
 * - First render of a URL: fetch once over the network, keep a copy in the
 *   browser Cache Storage, then render it.
 * - Every later render: served straight from the local cache, no network call.
 * - When the URL behind a logical key changes (the admin uploaded a new asset)
 *   the old cached copy is deleted immediately.
 */
const CACHE_NAME = 'hk-image-cache-v1';
const INDEX_KEY = 'hk_image_cache_index_v1';

/** url -> object URL for the blob already in memory this session. */
const memory = new Map<string, string>();
/** url -> in-flight resolution, so the same image is never fetched twice. */
const inflight = new Map<string, Promise<string>>();

/** Returns an image already resolved during this app session without async work. */
export function getMemoryCachedImage(url: string): string | undefined {
  return memory.get(url);
}

function readIndex(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function writeIndex(index: Record<string, string>) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch {
    /* storage full or unavailable — caching still works this session */
  }
}

function supported(): boolean {
  return typeof window !== 'undefined' && typeof caches !== 'undefined';
}

function passthrough(url: string): boolean {
  return !url || url.startsWith('data:') || url.startsWith('blob:');
}

/** urls already re-checked with the server this session. */
const revalidated = new Set<string>();

/**
 * Background freshness check: keeps the stored copy up to date without ever
 * making the user wait. The new copy is used from the next app start.
 */
async function revalidate(cache: Cache, url: string): Promise<void> {
  if (revalidated.has(url)) return;
  revalidated.add(url);
  try {
    const network = await fetch(url, { cache: 'no-cache', mode: 'cors' });
    if (network.ok) await cache.put(url, network.clone()).catch(() => {});
  } catch {
    /* offline or blocked — the cached copy stays in use */
  }
}

/**
 * Returns a local object URL for `url`, fetching and storing it only once.
 * `key` is the stable identity of the asset (e.g. the storage path); when the
 * URL for that key changes, the previous cached copy is removed.
 */
export async function resolveCachedImage(url: string, key?: string): Promise<string> {
  if (passthrough(url) || !supported()) return url;
  const existing = memory.get(url);
  if (existing) return existing;
  const running = inflight.get(url);
  if (running) return running;

  const task = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cacheKey = key || url;
      const index = readIndex();
      const previous = index[cacheKey];
      if (previous && previous !== url) {
        await cache.delete(previous).catch(() => {});
        const staleObjectUrl = memory.get(previous);
        if (staleObjectUrl) {
          URL.revokeObjectURL(staleObjectUrl);
          memory.delete(previous);
        }
      }
      if (previous !== url) {
        index[cacheKey] = url;
        writeIndex(index);
      }

      let response = await cache.match(url);
      if (response) {
        // Served from the device instantly; quietly ask the server in the
        // background whether a newer copy exists and store it for next time.
        void revalidate(cache, url);
      }
      if (!response) {
        const network = await fetch(url, { cache: 'no-store', mode: 'cors' });
        if (!network.ok) return url;
        await cache.put(url, network.clone()).catch(() => {});
        response = network;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      memory.set(url, objectUrl);
      return objectUrl;
    } catch {
      return url;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, task);
  return task;
}
