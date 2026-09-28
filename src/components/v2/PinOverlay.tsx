import { useEffect, useRef, useState } from 'react';
import { css } from '@/pages/v2/css/PinOverlayRef';

interface Props {
  open: boolean;
  /** Returns true when the PIN is correct. The PIN itself never leaves this check. */
  onVerify: (pin: string) => boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onForgot?: () => void;
  error?: string | null;
}

/** Six-digit wallet PIN gate shown before Add Wallet / Add New Tool opens. */
export default function PinOverlay({ open, onVerify, onSuccess, onCancel, error }: Props) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [failed, setFailed] = useState<string | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '', '', '']);
      setFailed(null);
      refs.current[0]?.focus();
    }
  }, [open]);

  if (!open) return null;

  const submit = (value: string) => {
    if (onVerify(value)) {
      onSuccess();
      return;
    }
    setFailed('Incorrect PIN. Please try again.');
    setDigits(['', '', '', '', '', '']);
    refs.current[0]?.focus();
  };

  const setDigit = (index: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setFailed(null);
    if (v && index < 5) refs.current[index + 1]?.focus();
    const joined = next.join('');
    if (next.every((x) => x !== '')) submit(joined);
  };

  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  return (
    <div className="pin-overlay-scope">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="overlay" style={{ position: 'fixed', inset: 0, zIndex: 900 }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="pin-title">
          <header className="modal-header">
            <h1 id="pin-title">Enter Your Pin</h1>
            <button className="close" type="button" aria-label="Close PIN dialog" onClick={onCancel} />
          </header>
          <p className="subtitle">Please enter your 6-digit PIN to continue.</p>
          <div className="pin-inputs" role="group" aria-label="Six-digit PIN">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                type="password"
                inputMode="numeric"
                maxLength={1}
                autoComplete="off"
                aria-label={`PIN digit ${i + 1}`}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={onKeyDown(i)}
              />
            ))}
          </div>
          {(failed || error) && (
            <p className="subtitle" role="alert" style={{ marginTop: 12, color: '#DC2626' }}>{failed || error}</p>
          )}
          <button className="cancel" type="button" onClick={onCancel}>Cancel</button>
        </section>
      </main>
    </div>
  );
}
