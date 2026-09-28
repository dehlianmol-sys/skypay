import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { css } from './css/MyRef';

type ActionKey = 'Wallet' | 'Integral' | 'Service' | 'Message' | 'Pin' | 'Tutorial';

const ACTIONS: Array<{ key: ActionKey; icon: string }> = [
  { key: 'Wallet', icon: 'wallet' },
  { key: 'Integral', icon: 'coins' },
  { key: 'Service', icon: 'service' },
  { key: 'Message', icon: 'message' },
  { key: 'Pin', icon: 'pin' },
  { key: 'Tutorial', icon: 'tutorial' },
];

/** My Asset screen — supplied design wired to the live account and database. */
export default function MyV2() {
  const navigate = useNavigate();
  const { currentUser, deposits, logout } = useStore();
  const [askLogout, setAskLogout] = useState(false);

  const totals = useMemo(() => {
    const mine = deposits.filter((d) => d.userId === currentUser?.id && d.status === 'Success');
    return {
      deposit: mine.reduce((s, d) => s + d.amount, 0),
      withdraw: 0,
      commission: mine.reduce((s, d) => s + (d.reward || 0), 0),
    };
  }, [deposits, currentUser]);

  const open = (key: ActionKey) => {
    if (key === 'Wallet') return navigate('/upi');
    if (key === 'Integral') return navigate('/score');
    if (key === 'Service') return navigate('/customer-service');
    if (key === 'Message') return navigate('/message');
    if (key === 'Pin') return navigate('/pin');
    navigate('/tutorial');
  };

  const money = (v: number) => `₹ ${v.toFixed(2)}`;

  return (
    <div className="my-app">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="svg-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <symbol id="my-icon-deposit" viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="18" rx="1" /><path d="M5 13h22" /></symbol>
          <symbol id="my-icon-withdraw" viewBox="0 0 32 32"><path d="M5 7h22v18H5zM19 12h-6v4h6v4h-6m3-10v12" /></symbol>
          <symbol id="my-icon-exchange" viewBox="0 0 32 32"><path d="M4 14A12 12 0 0 1 25 7l3 3m0-6v6h-6M28 18A12 12 0 0 1 7 25l-3-3m0 6v-6h6M19 11c-4-3-8 1-5 4l4 2c4 3-1 7-5 4m3-13v16" /></symbol>
          <symbol id="my-icon-wallet" viewBox="0 0 40 40"><path d="M7 6h26" /><rect x="4" y="11" width="32" height="25" rx="1" /><path d="m15 17 5 5 5-5m-5 5v8m-5-8h10m-10 5h10" /></symbol>
          <symbol id="my-icon-coins" viewBox="0 0 40 40"><ellipse cx="12" cy="9" rx="8" ry="4" /><path d="M4 9v22c0 5 16 5 16 0V9M4 15c0 5 16 5 16 0M4 21c0 5 16 5 16 0M4 27c0 5 16 5 16 0" /><ellipse cx="28" cy="21" rx="8" ry="4" /><path d="M20 21v10c0 5 16 5 16 0V21m-16 5c0 5 16 5 16 0" /></symbol>
          <symbol id="my-icon-service" viewBox="0 0 40 40"><path d="M10 26V13a10 10 0 0 1 20 0v13a10 10 0 0 1-10 10M10 13a7 7 0 0 0 0 14m20-14a7 7 0 0 1 0 14" /></symbol>
          <symbol id="my-icon-message" viewBox="0 0 40 40"><path d="M4 36V20a16 16 0 1 1 16 16H4Z" /><path d="M12 15h15M12 22h15M12 28h8" /></symbol>
          <symbol id="my-icon-pin" viewBox="0 0 40 40"><path d="m20 3 14 4v12c0 9-7 15-14 18C13 34 6 28 6 19V7l14-4Z" /><path d="m13 19 5 5 10-10" /></symbol>
          <symbol id="my-icon-tutorial" viewBox="0 0 40 40"><path d="M20 9c-3-4-10-3-17-3v30h12c2 0 4 1 5 2 1-1 3-2 5-2h12V6c-7 0-14-1-17 3Zm0 0v29" /></symbol>
        </defs>
      </svg>

      <header className="page-header"><h1>My Asset</h1></header>

      <section className="asset-summary" aria-label="Asset summary">
        <div className="asset-stat">
          <span className="summary-icon deposit"><svg className="icon" aria-hidden="true"><use href="#my-icon-deposit" /></svg></span>
          <dl><dt>Deposit</dt><dd>{money(totals.deposit)}</dd></dl>
        </div>
        <div className="asset-stat">
          <span className="summary-icon withdraw"><svg className="icon" aria-hidden="true"><use href="#my-icon-withdraw" /></svg></span>
          <dl><dt>Withdraw</dt><dd>{money(totals.withdraw)}</dd></dl>
        </div>
        <div className="asset-stat">
          <span className="summary-icon commission"><svg className="icon" aria-hidden="true"><use href="#my-icon-exchange" /></svg></span>
          <dl><dt>Commission</dt><dd>{money(totals.commission)}</dd></dl>
        </div>
      </section>

      <section className="actions" aria-label="Account actions">
        <div className="action-grid">
          {ACTIONS.map((a) => (
            <button key={a.key} className="action-button" type="button" onClick={() => open(a.key)}>
              <span className="action-icon">
                <svg className="icon" aria-hidden="true"><use href={`#my-icon-${a.icon}`} /></svg>
              </span>
              <span>{a.key}</span>
            </button>
          ))}
        </div>
        <p className="version">v1.1.9</p>
      </section>

      <button className="logout-button" type="button" onClick={() => setAskLogout(true)}>Logout</button>

      {askLogout && (
        <div className="my-logout-backdrop" onClick={() => setAskLogout(false)}>
          <div className="my-logout-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Really?</h2>
            <p>Are you sure you want to log out?</p>
            <div className="my-logout-actions">
              <button type="button" onClick={() => setAskLogout(false)}>Cancel</button>
              <button
                className="confirm"
                type="button"
                onClick={() => {
                  setAskLogout(false);
                  logout();
                  navigate('/login');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
