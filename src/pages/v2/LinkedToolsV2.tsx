import { useMemo, useState } from 'react';
import type { LinkedUPI } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';
import { toolById } from '@/lib/walletTools';
import { css } from './css/LinkedToolsRef';

export default function LinkedToolsV2({ onAdd }: { onAdd: () => void }) {
  const { currentUser, toggleSelling } = useStore();
  const toast = useToast();
  const [selected, setSelected] = useState<LinkedUPI | null>(null);
  const [saving, setSaving] = useState(false);
  const linked = useMemo(() => Array.from(
    new Map(
      [...(currentUser?.upis ?? [])]
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
        .map((upi) => [upi.upiId.trim().toLowerCase(), upi]),
    ).values(),
  ), [currentUser?.upis]);

  const confirmToggle = async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await toggleSelling(selected.id);
      setSelected(null);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not update this wallet', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="linked-tools-scope">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className="linked-tools-header">
        <h1 className="linked-tools-title">Tool</h1>
      </header>
      <main className="tool-list-container">
        {linked.map((item) => {
          const definition = toolById(item.partnerId);
          const minimum = definition?.min ?? 10;
          const maximum = definition?.max ?? 100000;
          return (
            <article className="tool-card" key={item.id}>
              <svg className="card-art" viewBox="0 0 622 244" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id={`gold-${item.id}`} x1="0" y1="1" x2=".85" y2="0"><stop offset="0" stopColor="#f1cb48" /><stop offset="1" stopColor="#f8d575" /></linearGradient>
                  <linearGradient id={`blue-${item.id}`} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#518eeb" /><stop offset="1" stopColor="#6d9ef0" /></linearGradient>
                </defs>
                <path d="M-25 29 C82 29 125 103 111 244 H-25Z" fill="#85e2b5" opacity=".2" />
                <path d="M75-20 C164 31 165 116 132 185 C120 212 108 234 86 260 H-30 V-20Z" fill="#53ce98" opacity=".055" />
                <path d="M474-35 C449 30 466 88 504 126 C538 160 587 176 650 174 L661-35Z" fill={`url(#gold-${item.id})`} />
                <path d="M651 37 C594 44 553 72 527 108 C503 141 490 192 510 253 L654 257Z" fill={`url(#blue-${item.id})`} />
              </svg>
              <div className="card-content">
                <div className="card-header">
                  <div className="card-info"><h2 className="card-name">{item.partnerName}</h2><p className="upi-id">{item.upiId}</p></div>
                  <button className={`enabled-badge${item.isSelling ? '' : ' disabled'}`} type="button" onClick={() => setSelected(item)}>{item.isSelling ? 'Enabled' : 'Disabled'}</button>
                </div>
                <p className="limited-range">LimitedRange:{minimum.toFixed(2)}~{maximum.toFixed(2)}</p>
              </div>
            </article>
          );
        })}
        <button className="linked-tools-add" type="button" onClick={onAdd}>Add</button>
      </main>
      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-toggle-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setSelected(null)}>×</button>
            <h2 className="modal-title" id="wallet-toggle-title">{selected.isSelling ? 'Disable' : 'Enable'} {selected.partnerName}</h2>
            <p className="modal-message">Are you sure you want to {selected.isSelling ? 'disable' : 'enable'} {selected.partnerName}?</p>
            <div className="modal-actions">
              <button className="modal-action modal-no" type="button" onClick={() => setSelected(null)}>No</button>
              <button className="modal-action modal-yes" type="button" disabled={saving} onClick={() => void confirmToggle()}>{saving ? 'Saving...' : 'Yes'}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}