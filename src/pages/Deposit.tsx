import { useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { useToast } from '../lib/toast';

const PACKAGES = [
  300, 500, 1000, 2000, 3000, 5000, 7500, 10000, 100, 200, 750, 1500, 2500, 4000, 6000, 8000,
];

export default function Deposit() {
  const { createDepositIntent, currentUser, appSettings } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USDT'>('INR');
  const [buyingAmount, setBuyingAmount] = useState<number | null>(null);

  const minOrder = appSettings?.minOrderSize ?? 300;
  const maxOrder = appSettings?.maxOrderSize ?? 50000;
  const rewardPct = appSettings?.rewardPercentage ?? 4;

  const filtered = useMemo(() => {
    const inRange = PACKAGES.filter((p) => p >= minOrder && p <= maxOrder).sort((a, b) => a - b);
    const q = query.trim();
    if (!q) return inRange;
    const n = Number(q);
    if (!isNaN(n)) return inRange.filter((p) => p >= n - 50 && p <= n + 50);
    return inRange.filter((p) => String(p).includes(q));
  }, [query, minOrder, maxOrder]);

  const buy = async (amount: number) => {
    if (buyingAmount !== null) return;
    setBuyingAmount(amount);
    try {
      if (amount < minOrder) {
        toast(`Minimum order size is ₹${minOrder}`, 'error');
        return;
      }
      if (amount > maxOrder) {
        toast(`Maximum order size is ₹${maxOrder}`, 'error');
        return;
      }
      if (currentUser?.lockedDepositId) {
        toast('You have an active order. Complete or cancel it first.', 'error');
        navigate('/order');
        return;
      }
      const res = await createDepositIntent(amount);
      if (!res.ok) {
        toast(res.message, 'error');
        return;
      }
      toast('Order created — pay within 30 minutes', 'success');
      navigate('/order');
    } finally {
      setBuyingAmount(null);
    }
  };

  return (
    <div>
      <div className="vp-header">
        <span style={{ width: 20 }} />
        <span className="vp-header-title">Deposit</span>
        <i className="fa-solid fa-clock-rotate-left" onClick={() => navigate('/mine')} />
      </div>

      {currentUser?.lockedDepositId && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-[13px] text-amber-800">
          <span className="min-w-0">Your order is pending. Complete or cancel it to buy again.</span>
          <button
            onClick={() => navigate('/order')}
            className="shrink-0 rounded-full bg-amber-500 px-3 py-1 text-[12px] font-semibold text-white"
          >
            Open
          </button>
        </div>
      )}

      <div className="vp-filter-tabs">
        <div className="vp-filter-pill">
          <button
            type="button"
            className={currency === 'INR' ? 'active' : undefined}
            onClick={() => setCurrency('INR')}
          >
            INR
          </button>
          <button
            type="button"
            className={currency === 'USDT' ? 'active' : undefined}
            onClick={() => setCurrency('USDT')}
          >
            USDT
          </button>
        </div>
      </div>

      <div className="vp-dep-controls">
        <i className="fa-solid fa-filter" />
        <input
          type="text"
          inputMode="numeric"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            textAlign: 'center',
            color: '#555',
          }}
        />
        <i className="fa-solid fa-sort" />
      </div>

      <div className="vp-dep-list">
        {currency === 'USDT' && (
          <div className="vp-empty">
            <i className="fa-solid fa-box-open" />
            <p>USDT packages are not available yet.</p>
          </div>
        )}
        {currency === 'INR' && filtered.length === 0 && (
          <div className="vp-empty">
            <i className="fa-solid fa-box-open" />
            <p>No packages match your search.</p>
          </div>
        )}
        {currency === 'INR' && filtered.map((amount) => {
          const reward = +((amount * rewardPct) / 100).toFixed(2);
          const income = +(amount + reward).toFixed(2);
          return (
            <div key={amount} className="vp-dep-item">
              <div className="vp-dep-icon">
                <i className="fa-solid fa-indian-rupee-sign" />
              </div>
              <div className="vp-dep-details">
                <div className="vp-dep-title">
                  {amount} INR <span className="vp-bank-tag">• UPI</span>
                </div>
                <div className="vp-dep-income">
                  ₹{reward.toFixed(2)} <span>({rewardPct}% + {income.toFixed(2)} Itoken)</span>
                </div>
                <div className="vp-dep-sub">Income</div>
              </div>
              <button
                className="vp-btn-buy"
                onClick={() => buy(amount)}
                disabled={buyingAmount !== null}
              >
                {buyingAmount === amount ? '...' : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
