import { css } from '@/pages/v2/css/SelectToolRef';
import type { PaymentTool } from '@/lib/paymentTools';

interface Props {
  open: boolean;
  tools: PaymentTool[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  error?: string | null;
}

/** "Select tool" sheet from the supplied design, listing the user's own wallets. */
export default function SelectToolModal({ open, tools, selectedId, onSelect, onCancel, onConfirm, error }: Props) {
  return (
    <div className="tool-scope">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={`backdrop${open ? ' is-visible' : ''}`} role="presentation" hidden={!open}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="toolTitle">
          <button className="modal-close-btn" type="button" aria-label="Close" onClick={onCancel}>&times;</button>
          <header className="modal-header">
            <h2 className="modal-title" id="toolTitle">Select tool</h2>
          </header>
          <div className="tool-list" id="toolListContainer">
            {tools.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tool-option${item.id === selectedId ? ' is-selected' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <span className="tool-logo"><img src={item.logoUrl} alt="" /></span>
                <span className="tool-copy">
                  <span className="tool-name">{item.name}</span>
                  <span className="tool-number">{item.number}</span>
                </span>
                <span className="radio" />
              </button>
            ))}
          </div>
          <p className="footer-note">*After selecting the payment tool, please use the selected tool to make payment, otherwise the account will not be credited.</p>
          <footer className="modal-actions">
            <button className="cancel-button" type="button" onClick={onCancel}>Cancel</button>
            <button className="confirm-button" type="button" onClick={onConfirm}>Confirm</button>
          </footer>
        </section>
      </div>
      <div className={`toast${error ? ' is-visible' : ''}`} role="status" aria-live="polite">{error}</div>
    </div>
  );
}
