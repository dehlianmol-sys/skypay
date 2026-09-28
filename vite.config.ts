// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function normalizeSupabaseUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  return normalized || undefined;
}

function firstConfigured(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => Boolean(value?.trim()))?.trim();
}

/**
 * A local `.env` file is the source of truth for the Supabase connection.
 *
 * Some hosting environments pre-inject their own VITE_SUPABASE_* values into the
 * process environment, which would otherwise win over the project's own `.env`.
 * This makes the checked-in `.env` authoritative during local/dev builds while
 * changing nothing on Vercel/Netlify/GitHub deployments (no `.env` file there —
 * the platform's environment variables are used as-is).
 *
 * No credentials are hardcoded here; values are only ever read from `.env`.
 */
try {
  const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of raw.split("\n")) {
    const match = /^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const key = match[1];
    const rawValue = match[2];
    if (!key || rawValue === undefined) continue;
    const value = rawValue.trim().replace(/^["']|["']$/g, "");
    if (value) process.env[key] = value;
  }
} catch {
  /* no local .env (e.g. Vercel build) — platform environment variables are used */
}

// Vercel projects commonly use server-style names without the VITE_ prefix.
// Map every supported public Supabase name before Vite injects browser variables.
const publicSupabaseUrl = normalizeSupabaseUrl(firstConfigured(
  process.env["VITE_SUPABASE_URL"],
  process.env["SUPABASE_URL"],
));
const publicSupabaseKey = firstConfigured(
  process.env["VITE_SUPABASE_ANON_KEY"],
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  process.env["SUPABASE_ANON_KEY"],
  process.env["SUPABASE_PUBLISHABLE_KEY"],
);

if (publicSupabaseUrl) process.env["VITE_SUPABASE_URL"] = publicSupabaseUrl;
if (publicSupabaseKey) {
  process.env["VITE_SUPABASE_ANON_KEY"] = publicSupabaseKey;
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] = publicSupabaseKey;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
