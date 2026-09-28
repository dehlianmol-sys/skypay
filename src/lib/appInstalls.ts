/**
 * Per-user APK download / install state (table: public.app_installs).
 *
 * A user can only Submit the Add Tool setup for an app after that app's APK
 * has been downloaded AND the install has been confirmed — per app, so
 * Freecharge being installed does not unlock Mobikwik.
 */
import { supabase } from './supabase';

export interface AppInstall {
  toolId: string;
  downloadedAt: string | null;
  installedAt: string | null;
}

export async function getAppInstall(userId: string, toolId: string): Promise<AppInstall | null> {
  const { data, error } = await supabase
    .from('app_installs')
    .select('tool_id, downloaded_at, installed_at')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    toolId: data.tool_id as string,
    downloadedAt: (data.downloaded_at as string | null) ?? null,
    installedAt: (data.installed_at as string | null) ?? null,
  };
}

async function upsert(userId: string, toolId: string, patch: Record<string, string>) {
  const { error } = await supabase
    .from('app_installs')
    .upsert({ user_id: userId, tool_id: toolId, ...patch }, { onConflict: 'user_id,tool_id' });
  if (error) throw new Error(error.message);
}

export function markDownloaded(userId: string, toolId: string) {
  return upsert(userId, toolId, { downloaded_at: new Date().toISOString() });
}

export function markInstalled(userId: string, toolId: string) {
  return upsert(userId, toolId, {
    downloaded_at: new Date().toISOString(),
    installed_at: new Date().toISOString(),
  });
}
