import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { useWalletPin } from '@/lib/pin';
import { eligibleTools } from '@/lib/paymentTools';
import SelectToolModal from '@/components/v2/SelectToolModal';
import { css } from './css/PaymentClaimsRef';
import { isOrderPending } from '@/lib/orderStatus';
import AppLoading from '@/components/AppLoading';

type FilterKey = 'top' | 'small' | 'medium' | 'large';

interface Claim {
  code: string;
  amount: number;
  income: string;
  special?: boolean;
}

const RANGES: Record<FilterKey, [number, number]> = {
  top: [100, 3000],
  small: [100, 499],
  medium: [500, 3000],
  large: [3001, 100000],
};

const CODE_CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Deterministic per-day list so codes stay stable while the screen is open. */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildClaims(filter: FilterKey, rewardPct: number, min: number, max: number, daySeed: number): Claim[] {
  const [lo, hi] = RANGES[filter];
  const low = Math.max(lo, min);
  const high = Math.min(hi, max);
  if (high < low) return [];
  const rand = seededRandom(daySeed + filter.length * 7919 + low);
  const count = filter === 'top' ? 5 : 4;
  const list: Claim[] = [];
  for (let i = 0; i < count; i++) {
    const raw = low + Math.floor(rand() * (high - low + 1));
    const amount = Math.max(low, Math.round(raw));
    let code = '';
    for (let c = 0; c < 6; c++) code += CODE_CHARS[Math.floor(rand() * CODE_CHARS.length)];
    list.push({
      code,
      amount,
      income: (+(amount * rewardPct / 100).toFixed(2)).toString(),
      ...(filter === 'top' && i < 2 ? { special: true } : {}),
    });
  }
  return list;
}

/** Payment claims screen — supplied design wired to the live account. */
export default function PaymentClaimsV2() {
  const navigate = useNavigate();
  const { currentUser, deposits, appSettings, createDepositIntent } = useStore();
  const { hasPin, loading: pinLoading } = useWalletPin(currentUser?.id);

  const [filter, setFilter] = useState<FilterKey>('top');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [toolOpen, setToolOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rewardPct = appSettings?.rewardPercentage ?? 4;
  const minOrder = appSettings?.minOrderSize ?? 100;
  const maxOrder = appSettings?.maxOrderSize ?? 100000;

  const tools = useMemo(() => eligibleTools(currentUser?.upis), [currentUser]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedTool && tools.length) setSelectedTool(tools[0].id);
  }, [tools, selectedTool]);

  const daySeed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  const claims = useMemo(
    () => buildClaims(filter, rewardPct, minOrder, maxOrder, daySeed),
    [filter, rewardPct, minOrder, maxOrder, daySeed],
  );

  const mine = useMemo(() => deposits.filter((d) => d.userId === currentUser?.id), [deposits, currentUser]);
  const reward = mine.filter((d) => d.status === 'Success').reduce((s, d) => s + (d.reward || 0), 0);
  const pending = mine.filter((d) => isOrderPending(d, now)).reduce((s, d) => s + d.amount, 0);

  // Expiry state only needs a quiet periodic check. The central store already
  // owns focus, resume, realtime, and request de-duplication.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const pickTab = (next: FilterKey) => {
    if (next === filter) return;
    setBusy(true);
    setFilter(next);
    setTimeout(() => setBusy(false), 400);
  };

  const claim = (amount: number) => {
    if (pinLoading || busy) return;
    if (tools.length === 0) {
      setWalletError('Please use Mobikwik , Phonpe or Paytm wallet for payment!');
      setTimeout(() => { setWalletError(null); navigate('/upi'); }, 2500);
      return;
    }
    if (!hasPin) {
      showToast('Please set your wallet PIN first.');
      setTimeout(() => navigate('/pin'), 1200);
      return;
    }
    const activeLockedOrder = deposits.find((deposit) =>
      deposit.id === currentUser?.lockedDepositId
      && isOrderPending(deposit, Date.now()),
    );
    if (activeLockedOrder) {
      showToast('You already have an active order.');
      try { sessionStorage.setItem('hkwallet_selected_order', activeLockedOrder.id); } catch { /* ignore */ }
      setTimeout(() => navigate('/order'), 900);
      return;
    }
    setPendingAmount(amount);
    setToolOpen(true);
  };

  const confirmTool = async () => {
    if (pendingAmount === null || !selectedTool) return;
    setToolOpen(false);
    setBusy(true);
    try {
      try { sessionStorage.setItem('hkwallet_pay_tool', selectedTool); } catch { /* ignore */ }
      const res = await createDepositIntent(pendingAmount);
      if (!res.ok) {
        showToast(res.message);
        // An order already running: still take the user to the payment page.
        const active = deposits.find(
          (d) =>
            d.userId === currentUser?.id &&
            !d.transactionType.toLowerCase().includes('usdt') &&
            d.status === 'Pending' &&
            new Date(d.expiresAt).getTime() > Date.now(),
        );
        if (active) {
          try { sessionStorage.setItem('hkwallet_selected_order', active.id); } catch { /* ignore */ }
          setTimeout(() => navigate('/order'), 700);
        }
        return;
      }
      if (res.deposit) {
        try { sessionStorage.setItem('hkwallet_selected_order', res.deposit.id); } catch { /* ignore */ }
      }
      navigate('/order');
    } finally {
      setBusy(false);
      setPendingAmount(null);
    }
  };

  const money = (value: number) => `∫ ${(+value.toFixed(2)).toString()}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="app">
        <header className="page-header"><h1>Payment</h1></header>
        <main>
          <section className="hero" aria-label="Wallet overview">
            <svg className="hero-art" viewBox="0 0 842 548" preserveAspectRatio="none" aria-hidden="true">
              <circle cx="818" cy="47" r="157" fill="#EBC431" />
              <circle cx="831" cy="227" r="180" fill="#347EF0" fillOpacity=".92" />
              <g transform="translate(455 63)" fill="#FFF">
                <path d="M0 154H310" stroke="#FFF" strokeOpacity=".18" strokeWidth="2" />
                <path d="M0 120h47v34H0Z" fillOpacity=".13" />
                <path d="M66 66h47v88H66Z" fillOpacity=".35" />
                <path d="M132 0h47v154h-47Z" fillOpacity=".56" />
                <path d="M198 91h47v63h-47Z" fillOpacity=".64" />
                <path d="M264 54h47v100h-47Z" fillOpacity=".86" />
              </g>
            </svg>
            <p className="cashback">Cashback<strong>{rewardPct}%</strong></p>
            <dl className="wallet-grid">
              <div className="wallet-stat balance"><dt>Balance</dt><dd>{money(currentUser?.wallet ?? 0)}</dd></div>
              <div className="wallet-stat"><dt>Reward</dt><dd>{money(reward)}</dd></div>
              <div className="wallet-stat"><dt>Pending</dt><dd>{money(pending)}</dd></div>
            </dl>
          </section>
          <div className="filters">
            <p className="notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Warning" role="img">
                <path d="m10.3 3.6-8 14A2 2 0 0 0 4 20.5h16a2 2 0 0 0 1.7-2.9l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 8v5M12 16.5h.01" />
              </svg>
              Please use Freecharge or Mobikwik or Paytm wallet <span className="notice-tail">for payment!</span>
            </p>
            <div className="tabs-wrap">
              <div className="tabs" role="tablist" aria-label="Payment amount filters">
                {([['top', 'Top Picks'], ['small', '100-499'], ['medium', '500-3000'], ['large', '3001-100000']] as Array<[FilterKey, string]>).map(([key, label]) => (
                  <button
                    key={key}
                    className="tab"
                    id={`tab-${key}`}
                    role="tab"
                    type="button"
                    aria-selected={filter === key}
                    aria-controls="claims"
                    tabIndex={filter === key ? 0 : -1}
                    onClick={() => pickTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <section className="claims" id="claims" role="tabpanel" aria-labelledby={`tab-${filter}`} aria-busy={busy} tabIndex={0}>
            {claims.map((item) => (
              <article className="claim-card" key={item.code} aria-label={`INR ${item.amount}, code ${item.code}`}>
                <div className="card-top">
                  <h2 className="currency">INR</h2>
                  <span className="code"><span className="code-label">Code</span><span>{item.code}</span></span>
                </div>
                <p className="amount">Amount: <strong>∫ {item.amount}</strong></p>
                <div className="card-bottom">
                  <div className="income-group">
                    <p className="income">Income:<strong>+{item.income}</strong></p>
                    {item.special && <span className="special"><strong>+ ∫ 2.00</strong><span>Special</span></span>}
                  </div>
                  <button
                    className="claim-button"
                    type="button"
                    disabled={busy}
                    aria-label={`Claim INR ${item.amount}, code ${item.code}`}
                    onClick={() => claim(item.amount)}
                  >
                    Claim
                  </button>
                </div>
              </article>
            ))}
            <p className="no-more-data">No more data</p>
          </section>
        </main>
      </div>


      {busy && <AppLoading />}
      <div className="toast" role="status" aria-live="polite" hidden={!toast}>{toast}</div>

      <SelectToolModal
        open={toolOpen}
        tools={tools}
        selectedId={selectedTool}
        onSelect={setSelectedTool}
        onCancel={() => { setToolOpen(false); setPendingAmount(null); }}
        onConfirm={confirmTool}
        error={walletError}
      />
    </>
  );
}
