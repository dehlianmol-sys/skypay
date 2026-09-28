import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '@/config/app-config';

/**
 * Supabase connection is environment driven, with a built-in fallback.
 *
 * Supported deployment variables (Vercel / Netlify / .env):
 *   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<anon / publishable key>
 *
 * The Vite config also maps the public server-style names SUPABASE_URL and
 * SUPABASE_ANON_KEY / SUPABASE_PUBLISHABLE_KEY into these browser variables.
 *
 * If none of them are present (missing .env after a ZIP download, fresh host),
 * the values from src/config/app-config.ts are used so the app never boots
 * into a broken state.
 */
const env = import.meta.env as Record<string, string | undefined>;

const supabaseUrl = (env['VITE_SUPABASE_URL'] || APP_CONFIG.supabaseUrl || '')
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/$/, '');
const supabaseAnonKey = (
  env['VITE_SUPABASE_ANON_KEY'] ||
  env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
  APP_CONFIG.supabaseAnonKey ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createRealClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    const missing = [
      ...(supabaseUrl ? [] : ['VITE_SUPABASE_URL']),
      ...(supabaseAnonKey ? [] : ['VITE_SUPABASE_ANON_KEY']),
    ].join(', ');
    const message = `[Skypay] Missing environment variable(s): ${missing}. Add them to your deployment environment and redeploy.`;
    console.error(message);
    throw new Error(message);
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        return fetch(input, { ...init, headers, cache: 'no-store' });
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'hkwallet-auth',
    },
  });
}

let _client: SupabaseClient | undefined;

/** Lazy so the app shell can still render (and show a clear error) when env vars are missing. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop, receiver) {
    if (!_client) _client = createRealClient();
    return Reflect.get(_client, prop, receiver);
  },
});

/** Email alias used by phone-number accounts inside Supabase Auth. */
export const AUTH_EMAIL_DOMAIN = env['VITE_AUTH_EMAIL_DOMAIN'] ?? 'hkwallet.app';

export function phoneToAuthEmail(phone: string): string {
  return `${phone.replace(/\D/g, '')}@${AUTH_EMAIL_DOMAIN}`;
}
