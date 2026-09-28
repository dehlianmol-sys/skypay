import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType }

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

/**
 * App-wide message bubble. Uses exactly the same look as the payment screen
 * toast: a centred dark rounded panel that fades in over the page.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="hk-toast-layer" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="hk-toast" role="status">{t.message}</div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .hk-toast-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 24px;
          pointer-events: none;
        }
        .hk-toast {
          max-width: min(300px, calc(100vw - 48px));
          padding: 12px 20px;
          border-radius: 8px;
          color: #fff;
          background: rgba(40, 40, 40, .82);
          box-shadow: 0 12px 30px rgba(0, 0, 0, .2);
          font-size: 16px;
          font-family: Roboto, "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
          font-weight: 400;
          line-height: 1.3;
          text-align: center;
          animation: hk-toast-in .2s ease;
        }
        @keyframes hk-toast-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
      ` }} />
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
