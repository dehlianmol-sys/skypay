import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { copyText } from '@/lib/v2dom';
import { getPublicUrl } from '@/lib/storage';
import { eligibleTools } from '@/lib/paymentTools';
import SelectToolModal from '@/components/v2/SelectToolModal';
import { css } from './css/OrderPayRef';
import { isOrderExpired, isOrderSubmitted, orderCode } from '@/lib/orderStatus';
import AppLoading from '@/components/AppLoading';

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="8" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="4" y="7" width="12" height="14" rx="1.5" fill="white" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** Order / payment screen — supplied design wired to the live order. */
export default function OrderPayV2() {
  const navigate = useNavigate();
  const { currentUser, deposits, submitDepositProof, cancelDeposit, uploadImage } = useStore();

  const order = useMemo(() => {
    const mine = deposits.filter(
      (d) => d.userId === currentUser?.id && !d.transactionType.toLowerCase().includes('usdt'),
    );
    let selectedId: string | null = null;
    try { selectedId = sessionStorage.getItem('hkwallet_selected_order'); } catch { /* ignore */ }
    return (
      mine.find((d) => d.id === selectedId)
      ?? mine.find((d) => d.id === currentUser?.lockedDepositId)
      ?? mine.filter((d) => d.status === 'Pending').sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]
      ?? null
    );
  }, [deposits, currentUser]);

  const tools = useMemo(() => eligibleTools(currentUser?.upis), [currentUser]);
  const [toolId, setToolId] = useState<string | null>(() => {
    try { return sessionStorage.getItem('hkwallet_pay_tool'); } catch { return null; }
  });
  useEffect(() => {
    if (tools.length && !tools.some((t) => t.id === toolId)) setToolId(tools[0].id);
  }, [tools, toolId]);
  const tool = tools.find((t) => t.id === toolId) ?? null;

  const [readOpen, setReadOpen] = useState(true);
  const [readSeconds, setReadSeconds] = useState(3);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toolOpen, setToolOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState('');
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [submittedTick, setSubmittedTick] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitted = order ? isOrderSubmitted(order) : false;
  const expired = order ? isOrderExpired(order) : false;

  // Expiry countdown (30 minute order rule stays unchanged).
  useEffect(() => {
    if (!order) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(order.expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order]);

  // 3 second read-details confirmation.
  useEffect(() => {
    if (!readOpen) return;
    setReadSeconds(3);
    const id = setInterval(() => {
      setReadSeconds((s) => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [readOpen]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;

  if (!order) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="app-shell">
          <header className="topbar">
            <button className="back-button" type="button" aria-label="Back" onClick={() => navigate('/payment')}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4M10 6 4 12l6 6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <h1>Order</h1>
            <span className="topbar-spacer" aria-hidden="true" />
          </header>
          <main className="page-content">
            <section className="amount-panel"><h2 className="amount"><span>No active order</span></h2></section>
            <div className="go-pay-wrap"><button className="go-pay" type="button" onClick={() => navigate('/payment')}>Claim a payment</button></div>
          </main>
        </div>
      </>
    );
  }

  const method = order.paymentMethod;
  const account = method?.accountNumber ?? method?.upiId ?? '';
  const payeeName = method?.payeeName ?? method?.name ?? '';
  const ifsc = method?.ifsc ?? '';
  const transferType = method?.transferType ?? 'IMPS';
  const no = orderCode(order);

  const copy = async (value: string) => {
    showToast(await copyText(value) ? 'Copied' : 'Copy failed');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setLoadingText('Loading');
    try {
      const path = await uploadImage(file, 'receipts');
      const res = await submitDepositProof(order.id, '', path);
      if (!res.ok) {
        setLoadingText(null);
        showToast(res.message);
        return;
      }
      setSubmittedTick(true);
      setLoadingText('Submitted');
      setTimeout(() => { setSubmittedTick(false); setLoadingText(null); }, 1200);
    } catch (err) {
      setLoadingText(null);
      showToast(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const goPay = () => {
    setNoticeOpen(false);
    showToast('Use the IMPS details shown above in your selected payment app.');
  };

  const confirmCancel = async () => {
    setCancelOpen(false);
    setLoadingText('Loading');
    try {
      await cancelDeposit(order.id);
      navigate('/payment');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not cancel');
    } finally {
      setLoadingText(null);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="app-shell">
        <header className="topbar">
          <button className="back-button" type="button" aria-label="Back" onClick={() => navigate('/payment')}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4M10 6 4 12l6 6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <h1>Order</h1>
          <span className="topbar-spacer" aria-hidden="true" />
        </header>

        <main className="page-content">
          <section className="amount-panel" aria-label="Wallet payment order">
            <div className="amount-row">
              <h2 className="amount"><span className="currency">INR</span> <span>{order.amount.toFixed(2)}</span></h2>
              <div className="expiry-badge">Expire: <strong>{clock}</strong></div>
            </div>

            <article className="details-card" aria-label="Payment details">
              <div className="detail-row">
                <span className="detail-label">PayeeAccount:</span>
                <div className="detail-value copy-line account-value">
                  <span>{account}</span>
                  <button className="copy-button" type="button" aria-label="Copy payee account" onClick={() => copy(account)}><CopyIcon /></button>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">PayeeName:</span>
                <div className="detail-value copy-line">
                  <span>{payeeName}</span>
                  <button className="copy-button" type="button" aria-label="Copy payee name" onClick={() => copy(payeeName)}><CopyIcon /></button>
                </div>
              </div>
              <div className="detail-row ifsc-row">
                <span className="detail-label">IFSC:</span>
                <div className="value-stack">
                  <div className="detail-value copy-line">
                    <span>{ifsc}</span>
                    <button className="copy-button" type="button" aria-label="Copy IFSC" onClick={() => copy(ifsc)}><CopyIcon /></button>
                  </div>
                  <div className="warning-note">Note : IF IFSC Mismatched , Do Not Pay</div>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <div className="detail-value copy-line">
                  <span>{transferType}</span>
                  <button className="copy-button" type="button" aria-label="Copy payment type" onClick={() => copy(transferType)}><CopyIcon /></button>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payout Wallet:</span>
                <div className="detail-value copy-line wallet-value">
                  <span className="wallet-mark" aria-hidden="true">{tool ? <img src={tool.logoUrl} alt="" /> : '-'}</span>
                  <span>{tool?.name ?? 'Not linked'}</span>
                  <button className="change-button" type="button" onClick={() => setToolOpen(true)}>Change</button>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payout Account:</span>
                <div className="detail-value copy-line">
                  <span>{tool?.number ?? ''}</span>
                  <button className="copy-button" type="button" aria-label="Copy payout account" onClick={() => copy(tool?.number ?? '')}><CopyIcon /></button>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <div className="detail-value copy-line status-value">
                   <span className="value-stack" style={{ alignItems: 'flex-start' }}>
                     <span className={`status-text status-${submitted ? 'submitted' : expired ? 'failed' : order.status.toLowerCase()}`}>
                       {submitted ? 'In review' : expired ? 'Failed' : order.status}
                     </span>
                   </span>
                   {!submitted && order.status === 'Pending' && !expired && (
                    <button className="status-cancel" type="button" onClick={() => setCancelOpen(true)}>Cancel</button>
                  )}
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">NO:</span>
                <div className="detail-value copy-line order-number-value">
                  <span>{no}</span>
                  <button className="copy-button" type="button" aria-label="Copy order number" onClick={() => copy(no)}><CopyIcon /></button>
                </div>
              </div>
              <button
                className="voucher-button"
                type="button"
                 disabled={expired}
                 onClick={() => submitted ? setPreviewOpen(true) : fileRef.current?.click()}
              >
                 {submitted ? 'View Voucher' : expired ? 'Order Expired' : 'Upload Voucher'} <span className="arrow">&gt;</span>
              </button>
            </article>
          </section>

          {!submitted && !expired && (
            <div className="go-pay-wrap">
              <button className="go-pay" type="button" onClick={() => setNoticeOpen(true)}>go pay</button>
            </div>
          )}

          <section className="submitted-section" aria-labelledby="submittedTitle" hidden={!submitted}>
            <div className="submitted-heading">
              <div>
                <p className="submitted-kicker">Payment received</p>
                <h2 id="submittedTitle">In review</h2>
              </div>
              <span className="status-text status-submitted">In review</span>
            </div>
          </section>
        </main>
      </div>

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

      <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="readTitle" hidden={!readOpen}>
        <section className="modal-card">
          <button className="modal-close" type="button" aria-label="Close read details" onClick={() => setReadOpen(false)}><CloseIcon /></button>
          <h2 className="modal-title" id="readTitle">Read Details</h2>
          <p className="modal-copy">Please copy all the information in the order and make the payment in your wallet. Order will expire in: <span>{clock}</span>.</p>
          <div className="modal-actions single">
            <button className="modal-button primary" type="button" disabled={readSeconds > 0} onClick={() => setReadOpen(false)}>
              {readSeconds > 0 ? `Confirm (${readSeconds} S)` : 'Confirm'}
            </button>
          </div>
        </section>
      </div>

      <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="noticeTitle" hidden={!noticeOpen}>
        <section className="modal-card">
          <button className="modal-close" type="button" aria-label="Close notice" onClick={() => setNoticeOpen(false)}><CloseIcon /></button>
          <h2 className="modal-title" id="noticeTitle">Notice</h2>
          <p className="modal-copy">Open {tool?.name ?? 'your selected wallet'} and pay with the IMPS account details shown on this page.</p>
          <div className="modal-actions">
            <button className="modal-button" type="button" onClick={() => setNoticeOpen(false)}>Cancel</button>
            <button className="modal-button primary" type="button" onClick={goPay}>Go Pay</button>
          </div>
        </section>
      </div>

      <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="cancelTitle" hidden={!cancelOpen}>
        <section className="modal-card">
          <button className="modal-close" type="button" aria-label="Close cancel dialog" onClick={() => setCancelOpen(false)}><CloseIcon /></button>
          <h2 className="modal-title" id="cancelTitle">Confirm</h2>
          <p className="modal-copy cancel-question">Cancel this order?</p>
          <input
            className="reason-input"
            maxLength={100}
            placeholder="Please enter the reason"
            aria-label="Cancellation reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="counter">{reason.length}/100</div>
          <div className="modal-actions">
            <button className="modal-button" type="button" onClick={() => setCancelOpen(false)}>Cancel</button>
            <button className="modal-button primary" type="button" onClick={confirmCancel}>Confirm</button>
          </div>
        </section>
      </div>

      <div className="modal-layer preview-layer" role="dialog" aria-modal="true" aria-labelledby="previewTitle" hidden={!previewOpen}>
        <section className="preview-card">
          <button className="modal-close" type="button" aria-label="Close submitted screenshot preview" onClick={() => setPreviewOpen(false)}><CloseIcon /></button>
           <h2 id="previewTitle">Uploaded Voucher</h2>
          <div className="preview-frame">
            {order.receiptBase64 ? <img src={getPublicUrl(order.receiptBase64)} alt="Uploaded payment voucher preview" /> : null}
          </div>
          <button className="preview-close-button" type="button" onClick={() => setPreviewOpen(false)}>Close Preview</button>
        </section>
      </div>

      {loadingText && <AppLoading label={loadingText} success={submittedTick} />}
      <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>

      <SelectToolModal
        open={toolOpen}
        tools={tools}
        selectedId={toolId}
        onSelect={setToolId}
        onCancel={() => setToolOpen(false)}
        onConfirm={() => {
          setToolOpen(false);
          try { if (toolId) sessionStorage.setItem('hkwallet_pay_tool', toolId); } catch { /* ignore */ }
        }}
      />
    </>
  );
}
