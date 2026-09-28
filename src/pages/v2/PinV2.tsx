import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { saveWalletPin, useWalletPin } from '@/lib/pin';
import { css } from './css/PinRef';

const EMPTY = ['', '', '', '', '', ''];

function PinRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="pin-section">
      <div className="pin-label">{label}</div>
      <div className="otp-row">
        {value.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className="otp-input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !value[i] && i > 0) {
                e.preventDefault();
                const next = [...value];
                next[i - 1] = '';
                onChange(next);
                refs.current[i - 1]?.focus();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Create or reset the six-digit wallet PIN. */
export default function PinV2() {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const { pin: savedPin, loading, reload } = useWalletPin(currentUser?.id);

  const [oldPin, setOldPin] = useState(EMPTY);
  const [newPin, setNewPin] = useState(EMPTY);
  const [confirmPin, setConfirmPin] = useState(EMPTY);
  const [toast, setToast] = useState<{ text: string; kind: 'error' | 'success' } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => {
      setToast(null);
      if (toast.kind === 'success') {
        if (window.history.length > 1) window.history.back();
        else navigate('/mine');
      }
    }, 2200);
    return () => window.clearTimeout(t);
  }, [toast, navigate]);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else navigate('/mine');
  };

  const confirm = async () => {
    if (busy || !currentUser) return;
    const oldValue = oldPin.join('');
    const newValue = newPin.join('');
    const confirmValue = confirmPin.join('');

    if (savedPin) {
      if (oldValue.length !== 6) return setToast({ text: 'Enter your current 6-digit PIN.', kind: 'error' });
      if (oldValue !== savedPin) return setToast({ text: 'Old PIN is incorrect.', kind: 'error' });
    }
    if (newValue.length !== 6) return setToast({ text: 'New PIN must be 6 digits.', kind: 'error' });
    if (savedPin && newValue === savedPin) {
      return setToast({ text: 'New PIN cannot be the same as the old PIN.', kind: 'error' });
    }
    if (newValue !== confirmValue) {
      return setToast({ text: 'New PIN and Confirm PIN do not match.', kind: 'error' });
    }

    setBusy(true);
    const res = await saveWalletPin(currentUser.id, newValue);
    setBusy(false);
    if (!res.ok) return setToast({ text: res.message, kind: 'error' });
    await reload();
    setOldPin(EMPTY);
    setNewPin(EMPTY);
    setConfirmPin(EMPTY);
    setToast({ text: savedPin ? 'PIN changed successfully.' : 'PIN set successfully.', kind: 'success' });
  };

  return (
    <div className="pin-app">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="pin-header">
        <button className="back-btn" type="button" aria-label="Back" onClick={goBack}>&#8592;</button>
        <div className="header-title">Pin Code</div>
      </div>

      <div className="content">
        <div className="icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0F8A5F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>

        <div className="main-title">Enter Your Pin</div>

        {loading ? null : savedPin && <PinRow label="Old Pin (If You Set)" value={oldPin} onChange={setOldPin} />}
        <PinRow label="New Pin" value={newPin} onChange={setNewPin} />
        <PinRow label="Confirm New Pin" value={confirmPin} onChange={setConfirmPin} />

        <div className="btn-row">
          <button className="btn-cancel" type="button" onClick={goBack}>Cancel</button>
          <button className="btn-confirm" type="button" onClick={() => void confirm()} disabled={busy}>
            {busy ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </div>

      <div className={`pin-toast${toast ? ` show ${toast.kind}` : ''}`} role="status" aria-live="polite">
        {toast?.text ?? ''}
      </div>
    </div>
  );
}
