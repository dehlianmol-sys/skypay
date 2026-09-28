import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void } }
}

// Cloudflare Turnstile site key (public). Set VITE_TURNSTILE_SITE_KEY to override.
const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || '0x4AAAAAAFFObiFbr5kQyqx_';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT}"]`) as HTMLScriptElement | null;
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', () => reject());
    if (!existing) { s.src = SCRIPT; s.async = true; document.head.appendChild(s); }
  });
}

export default function SecurityVerify({ open, onVerified, onClose }: { open: boolean; onVerified: (token: string) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef(onVerified); cb.current = onVerified;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    let id: string | undefined; let alive = true;
    setReady(false);
    loadScript().then(() => {
      if (!alive || !box.current || !window.turnstile) return;
      id = window.turnstile.render(box.current, { sitekey: SITE_KEY, theme: 'light', callback: (t: string) => setTimeout(() => cb.current(t), 400) });
      if (alive) setReady(true);
    }).catch(() => {});
    return () => { alive = false; if (id && window.turnstile) window.turnstile.remove(id); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="cp-verify-layer" role="dialog" aria-modal="true" aria-labelledby="cp-verify-title">
      <div className="cp-verify">
        <button type="button" className="cp-verify-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <h2 id="cp-verify-title">Security Verification</h2>
        <p>Please complete verification to continue.</p>
        <div ref={box} className="cp-verify-widget" />
        {!ready && <p className="cp-verify-note">Verification widget loading...</p>}
      </div>
    </div>
  );
}
