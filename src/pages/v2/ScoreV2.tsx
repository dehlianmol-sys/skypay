import { useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { css } from './css/ScoreRef';

interface Entry {
  id: string;
  title: string;
  amount: number;
  utr: string;
  date: string;
  month: string;
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

/** Score / balance details — reachable from the home "Detail" button and My → Integral. */
export default function ScoreV2() {
  const navigate = useNavigate();
  const { currentUser, deposits } = useStore();
  const [tab, setTab] = useState<'into' | 'out'>('into');

  const mine = useMemo(
    () => deposits.filter((d) => d.userId === currentUser?.id),
    [deposits, currentUser],
  );

  const into = useMemo<Entry[]>(
    () =>
      mine
        .filter((d) => d.status === 'Success')
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .map((d) => ({
          id: d.id,
          title: 'deposit',
          amount: d.amount + (d.reward || 0),
          utr: d.utr || 'No UTR',
          date: d.createdAt,
          month: monthKey(d.createdAt),
        })),
    [mine],
  );

  const out = useMemo<Entry[]>(
    () =>
      mine
        .filter((d) => d.status === 'Rejected')
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .map((d) => ({
          id: d.id,
          title: 'rejected order',
          amount: -d.amount,
          utr: d.utr || 'No UTR',
          date: d.createdAt,
          month: monthKey(d.createdAt),
        })),
    [mine],
  );

  const list = tab === 'into' ? into : out;
  const months = Array.from(new Set(list.map((e) => e.month)));
  const balance = (currentUser?.wallet ?? 0).toFixed(2);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else navigate('/');
  };

  return (
    <div className="score-app">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className="header">
        <nav className="navigation" aria-label="Page navigation">
          <button className="back-button" type="button" aria-label="Go back" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12H3m0 0 7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="page-title">Score</h1>
        </nav>
      </header>

      <main>
        <section className="card score-card" aria-label="Score balance">
          <div className="score-overview">
            <div>
              <p className="score-label">You have Score</p>
              <p className="score-balance">{balance}</p>
            </div>
            <div className="score-change">
              <span className="change-label">Change</span>
              <svg className="coin-bags" viewBox="0 0 64 36" fill="none" aria-hidden="true">
                <circle cx="46" cy="18" r="17.5" fill="#C3A570" />
                <path d="M46 8c-8-1-8 3-3 6-4 5-7 11-5 13 2 2 14 2 16 0 2-2-1-8-5-13 5-3 5-7-3-6Z" fill="#35352E" />
                <ellipse cx="46" cy="10" rx="5.4" ry="2.1" fill="#C3A570" />
                <path d="m43.5 16.4 2.5 2.5 2.5-2.5M46 19v7m-2.7-5.3h5.4m-5.4 2.7h5.4" stroke="#F4E9C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="18" r="17.5" fill="#F2E6C3" />
                <path d="M18 8c-8-1-8 3-3 6-4 5-7 11-5 13 2 2 14 2 16 0 2-2-1-8-5-13 5-3 5-7-3-6Z" fill="#C3A570" />
                <ellipse cx="18" cy="10" rx="5.4" ry="2.1" fill="#F2E6C3" />
                <path d="m15.5 16.4 2.5 2.5 2.5-2.5M18 19v7m-2.7-5.3h5.4m-5.4 2.7h5.4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="score-tabs" role="tablist" aria-label="Score history direction">
            <button
              className="score-tab"
              type="button"
              role="tab"
              aria-selected={tab === 'into'}
              onClick={() => setTab('into')}
            >
              Into
            </button>
            <button
              className="score-tab"
              type="button"
              role="tab"
              aria-selected={tab === 'out'}
              onClick={() => setTab('out')}
            >
              Roll out
            </button>
          </div>
        </section>

        {list.length === 0 ? (
          <section className="card history-card history-empty">
            <p className="history-footer">No more data</p>
          </section>
        ) : (
          months.map((m) => (
            <section className="card history-card" key={m}>
              <h2 className="history-month">
                <time dateTime={m}>{m}</time>
              </h2>
              {list
                .filter((e) => e.month === m)
                .map((e) => (
                  <article className="transaction" key={e.id}>
                    <div className="transaction-heading">
                      <h3 className="transaction-title">{e.title}</h3>
                      <span className={`transaction-amount ${e.amount < 0 ? 'debit' : 'credit'}`}>
                        {e.amount < 0 ? '' : '+'}
                        {e.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="transaction-meta">
                      <span>ID: {e.id.slice(0, 8).toUpperCase()}</span>
                      <span>&bull;&nbsp; UTR: {e.utr}</span>
                      <span>&bull;&nbsp; DATE: {shortDate(e.date)}</span>
                    </p>
                  </article>
                ))}
              <p className="history-footer">No more data</p>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
