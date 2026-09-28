import { supabase } from './supabase';

const BUCKET = 'uploads';
export const LOGO_BUCKET = 'logos';
/** APK files live in a public `apks` bucket: hkwallet.apk, paytm.apk, phonepe.apk, mobikwik.apk, freecharge.apk */
export const APK_BUCKET = 'apks';

/** Public URL for a logo file stored at the root of the `logos` bucket. */
export function getLogoUrl(fileName: string): string {
  try {
    return supabase.storage.from(LOGO_BUCKET).getPublicUrl(fileName).data.publicUrl;
  } catch {
    // Never let a missing connection break module load / page render.
    return '';
  }
}

/** Public URL for an APK file stored at the root of the `apks` bucket. */
export function getApkUrl(fileName: string): string {
  try {
    return supabase.storage.from(APK_BUCKET).getPublicUrl(fileName).data.publicUrl;
  } catch {
    return '';
  }
}


export function getPublicUrl(path: string, cacheVersion?: number): string {
  if (!path) return '';
  const url = path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')
    ? path
    : supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  if (!cacheVersion || url.startsWith('data:') || url.startsWith('blob:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${cacheVersion}`;
}

/**
 * Convert PNG/JPG to WebP at full original resolution before upload.
 * Dimensions are never reduced; only the container format changes.
 */
async function toWebp(file: File): Promise<File> {
  if (typeof document === 'undefined') return file;
  const type = (file.type || '').toLowerCase();
  if (!/^image\/(png|jpe?g)$/.test(type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 1),
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], name, { type: 'image/webp' });
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const upload = await toWebp(file);
  const ext = upload.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, upload, {
    cacheControl: '3600',
    contentType: upload.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return fileName;
}

export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

/** Delete an uploaded image from the storage bucket (ignores external URLs). */
export async function removeStoredImage(path: string): Promise<void> {
  if (!path) return;
  if (/^(https?:|data:|blob:)/.test(path)) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Storage cleanup must never block the database delete.
  }
}
