import { Link, useNavigate } from '@/lib/router-compat';
import { css } from '@/pages/v2/css/NavRef';

export type NavKey = 'home' | 'payment' | 'statistics' | 'my';

const links: Array<{ key: NavKey; to: string; label: string; icon: string }> = [
  { key: 'home', to: '/', label: 'Home', icon: '#nav-home' },
  { key: 'payment', to: '/payment', label: 'Payment', icon: '#nav-payment' },
  { key: 'statistics', to: '/statistics', label: 'Statistics', icon: '#nav-statistics' },
  { key: 'my', to: '/mine', label: 'My', icon: '#nav-my' },
];

/** The single bottom navigation used across every signed-in screen. */
export default function WalletNav({ active }: { active?: NavKey }) {
  const navigate = useNavigate();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="svg-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <symbol id="nav-home" viewBox="0 0 32 32">
            <path fill="currentColor" d="M2 13.2 14.8 2.6a1.9 1.9 0 0 1 2.4 0L30 13.2v16a1.5 1.5 0 0 1-1.5 1.5h-8.4V19.1h-8.2v11.6H3.5A1.5 1.5 0 0 1 2 29.2Z" />
          </symbol>
          <symbol id="nav-payment" viewBox="0 0 32 32">
            <path fill="currentColor" fillRule="evenodd" d="M3 5h26a2 2 0 0 1 2 2v3H1V7a2 2 0 0 1 2-2ZM1 13h30v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2Zm19 9v2h7v-2Z" />
          </symbol>
          <symbol id="nav-statistics" viewBox="0 0 34 32">
            <g fill="currentColor">
              <path d="M8.5 5a4.7 4.7 0 0 0-2.2 8.8C3.8 14.4 3.1 17 2.6 20L1 28h6.7l1.8-11.3 1.8-2.8A4.7 4.7 0 0 0 8.5 5ZM25.5 5a4.7 4.7 0 0 1 2.2 8.8c2.5.6 3.2 3.2 3.7 6.2l1.6 8h-6.7l-1.8-11.3-1.8-2.8A4.7 4.7 0 0 1 25.5 5Z" />
              <circle cx="17" cy="7.7" r="6.2" />
              <path d="M10.9 17.8c.6-2.4 2.8-3.6 6.1-3.6s5.5 1.2 6.1 3.6l2 10.8c.2 1.2-.5 2-1.8 2H10.7c-1.3 0-2-.8-1.8-2Z" />
            </g>
          </symbol>
          <symbol id="nav-my" viewBox="0 0 32 32">
            <path fill="currentColor" fillRule="evenodd" d="M16 1a15 15 0 1 0 0 30 15 15 0 0 0 0-30ZM7.7 17a8.4 8.4 0 0 0 16.6 0Z" />
          </symbol>
          <symbol id="nav-wallet" viewBox="0 0 38 42">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
              <path d="M20 1v3M12.5 3l1.4 2.5M6.6 7l2.5 1.4M4.2 13h3M27.5 3l-1.4 2.5M33.4 7l-2.5 1.4M35.8 13h-3" />
              <path d="M23.1 8.9c-1.2-2-6.7-1.8-6.7 1.5 0 3.7 7.2 1.9 7.2 5.7 0 3.3-5.7 3.8-7.3 1.2M20 5.8v15" strokeWidth="2" />
            </g>
            <path fill="currentColor" d="M6 18h26a3 3 0 0 1 3 3v3H28a5 5 0 0 0 0 10h7v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V21a3 3 0 0 1 3-3Z" />
            <rect x="25" y="26" width="13" height="6" rx="3" fill="currentColor" />
            <circle cx="28.5" cy="29" r="1.1" fill="#F3C62C" />
          </symbol>
        </defs>
      </svg>
      <nav className="bottom-nav" id="wallet-navigation" aria-label="Main navigation">
        <div className="nav-items">
          {links.slice(0, 2).map((l) => (
            <Link
              key={l.key}
              className="nav-item"
              to={l.to}
              data-page={l.key}
              {...(active === l.key ? { 'aria-current': 'page' as const } : {})}
            >
              <svg aria-hidden="true" focusable="false"><use href={l.icon} /></svg>
              <span>{l.label}</span>
            </Link>
          ))}
          <button
            className="wallet-link"
            id="add-wallet"
            type="button"
            aria-label="Add Wallet"
            onClick={() => navigate('/upi')}
          >
            <span className="wallet-circle">
              <svg aria-hidden="true" focusable="false"><use href="#nav-wallet" /></svg>
            </span>
          </button>
          {links.slice(2).map((l) => (
            <Link
              key={l.key}
              className="nav-item"
              to={l.to}
              data-page={l.key}
              {...(active === l.key ? { 'aria-current': 'page' as const } : {})}
            >
              <svg aria-hidden="true" focusable="false"><use href={l.icon} /></svg>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
