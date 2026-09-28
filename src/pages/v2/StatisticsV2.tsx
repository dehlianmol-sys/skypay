import { useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { css } from './css/StatisticsRef';
import AppLoading from '@/components/AppLoading';

const money = (value: number) => `₹ ${value.toFixed(2)}`;

export default function StatisticsV2() {
  const navigate = useNavigate();
  const { currentUser, deposits, appSettings, toggleSelling } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const upi = currentUser?.upis[0];
  const values = useMemo(() => {
    const mine = deposits.filter((item) => item.userId === currentUser?.id);
    const success = mine.filter((item) => item.status === 'Success');
    const pending = mine.filter((item) => item.status === 'Pending');
    return {
      deposit: success.reduce((sum, item) => sum + item.amount, 0),
      commission: success.reduce((sum, item) => sum + item.reward, 0),
      pendingAmount: pending.reduce((sum, item) => sum + item.amount, 0),
      pendingOrders: pending.length,
      estimated: pending.reduce((sum, item) => sum + item.reward, 0),
    };
  }, [deposits, currentUser?.id]);
  const changeSelling = async () => {
    if (!upi || busy) return;
    setBusy(true);
    try { await toggleSelling(upi.id); setConfirming(false); } finally { setBusy(false); }
  };
  const today = new Intl.DateTimeFormat('en-GB').format(new Date());
  return (
    <div className="stats-app">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="stats-svg-defs" aria-hidden="true"><defs><symbol id="stats-coin" viewBox="0 0 20 22"><g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2a8.5 8.5 0 1 0 7.2 4M10 2v4a4.8 4.8 0 1 0 4.1 2.2"/><path d="M13.5 3v8a3.3 3.3 0 1 1-3.3-3.3M10.2 7.7v3.4"/></g></symbol></defs></svg>
      <header className="stats-head"><h1>Statistics</h1></header>
      <main className="stats-main">
        <div className="stats-card">
          <section>
            <h2 className="stats-heading">Statistics <time>({today})</time></h2>
            <dl className="stats-grid">
               <div className="stats-metric"><dt><span className="stats-metric-icon balance-icon"><img src="/ui/stats-balance.png" alt="" /></span>Balance</dt><dd>{money(currentUser?.wallet ?? 0)}</dd></div>
               <div className="stats-metric"><dt><span className="stats-metric-icon sell-icon"><img src="/ui/stats-sell.png" alt="" /></span>Sell</dt><dd>{money(0)}</dd></div>
               <div className="stats-metric"><dt><span className="stats-metric-icon deposit-icon"><img src="/ui/stats-deposit.png" alt="" /></span>Deposit</dt><dd>{money(values.deposit)}</dd></div>
               <div className="stats-metric"><dt><span className="stats-metric-icon commission-icon"><img src="/ui/stats-commission.png" alt="" /></span>Commission</dt><dd>{money(values.commission)}</dd></div>
            </dl>
          </section>
          <section className="stats-payment">
            <h2 className="stats-heading">Payment</h2>
            <div className="stats-panel">
              <div className="stats-rate"><span>Real Time Exchange Rates(INR/USDT)</span><strong>110.5</strong></div>
              <dl className="stats-grid stats-payment-grid">
                 {([['In Process Amount', money(values.pendingAmount)], ['In Process Orders', String(values.pendingOrders)], ['Commission Rate', `${(appSettings?.rewardPercentage ?? 4).toFixed(2)} %`], ['Estimated Income', money(values.estimated)]] as const).map(([label, value]) => <div className="stats-metric" key={label}><dt><svg className="stats-coin"><use href="#stats-coin" /></svg>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </div>
          </section>
        </div>
        <button className={`stats-selling${upi?.isSelling ? ' active' : ''}`} disabled={!upi || busy} onClick={() => setConfirming(true)}>{upi?.isSelling ? 'Closed Selling' : 'Start Selling'}</button>
      </main>
       {confirming && <div className="stats-dialog-backdrop"><div className="stats-dialog" role="dialog" aria-modal="true"><h2>Are you sure?</h2><p>Are you sure you want to {upi?.isSelling ? 'stop' : 'start'} selling?</p><div className="stats-dialog-actions"><button onClick={() => setConfirming(false)}>Cancel</button><button className="confirm" onClick={() => void changeSelling()}>Yes</button></div></div></div>}
       {busy && <AppLoading />}
    </div>
  );
}