import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import {
  AGENT_SESSION_KEY,
  COMMISSION_TIERS,
  referralLink,
  getAgentById,
  getAgentLedger,
  getAgentRangeSummary,
  getAgentWallet,
  presetRange,
  type Agent,
  type AgentMember,
  type AgentRangeSummary,
  type CommissionEntry,
  type DateRange,
} from '../../lib/agents';
import { useToast } from '../../lib/toast';
import AppLoading from '@/components/AppLoading';

type Preset = 'today' | 'yesterday' | 'last7' | 'all' | 'custom';

const PRESETS: { key: Exclude<Preset, 'custom'>; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'all', label: 'All Time' },
];

const EMPTY: AgentRangeSummary = {
  members: [], newUsers: 0, depositCount: 0, successVolume: 0, pendingVolume: 0, commission: 0,
};

function toInputDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AgentRangeSummary>(EMPTY);
  const [preset, setPreset] = useState<Preset>('last7');
  const [customFrom, setCustomFrom] = useState(toInputDate(presetRange('last7').from));
  const [customTo, setCustomTo] = useState(toInputDate(new Date()));
  const [search, setSearch] = useState('');
  const [wallet, setWallet] = useState<{ balance: number; totalEarned: number }>({ balance: 0, totalEarned: 0 });
  const [ledger, setLedger] = useState<CommissionEntry[]>([]);

  const range: DateRange = useMemo(() => {
    if (preset !== 'custom') return presetRange(preset);
    const from = new Date(`${customFrom}T00:00:00`);
    const to = new Date(`${customTo}T23:59:59`);
    return { from, to };
  }, [preset, customFrom, customTo]);

  useEffect(() => {
    let active = true;
    (async () => {
      let id: string | null = null;
      try { id = localStorage.getItem(AGENT_SESSION_KEY); } catch { id = null; }
      if (!id) { navigate('/agent/login', { replace: true }); return; }
      const a = await getAgentById(id);
      if (!a) { navigate('/agent/login', { replace: true }); return; }
      if (!active) return;
      setAgent(a);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [navigate]);

  const load = useCallback(async () => {
    if (!agent) return;
    setRefreshing(true);
    try {
      const [s, w, l] = await Promise.all([
        getAgentRangeSummary(agent.agentId, range, agent.commissionPercentage, agent.id),
        getAgentWallet(agent.id),
        getAgentLedger(agent.id),
      ]);
      setSummary(s);
      setWallet(w);
      setLedger(l);
    } catch {
      toast('Could not load your data. Please try again.', 'error');
    } finally {
      setRefreshing(false);
    }
  }, [agent, range, toast]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return summary.members;
    return summary.members.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q),
    );
  }, [summary.members, search]);

  if (loading || !agent) {
    return <AppLoading />;
  }

  const link = referralLink(agent.agentId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast('Link copied!', 'success');
    } catch {
      toast('Could not copy link', 'error');
    }
  };

  const logout = () => {
    try { localStorage.removeItem(AGENT_SESSION_KEY); } catch { /* ignore */ }
    navigate('/agent/login', { replace: true });
  };

  return (
    <div className="min-h-[100dvh] bg-[#0b1e4f] text-white">
      <div className="max-w-[560px] mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold">Agent Dashboard</h1>
            <p className="text-[13px] text-white/60">{agent.name} · {agent.agentId}</p>
          </div>
          <button onClick={logout} className="text-[13px] text-rose-300 underline">Logout</button>
        </div>

        <div className="rounded-2xl p-4 mb-4 bg-gradient-to-r from-[#ff9800] to-[#f57c00]">
          <div className="text-[12px] text-black/70 font-semibold">Commission balance (unsettled)</div>
          <div className="text-3xl font-extrabold text-black mt-1">₹{wallet.balance.toFixed(2)}</div>
          <div className="text-[12px] text-black/70 mt-1">
            Lifetime earned ₹{wallet.totalEarned.toFixed(2)} · Rate {agent.commissionPercentage}%
          </div>
        </div>


        <div className="bg-white/10 rounded-2xl p-4 mb-5">
          <div className="text-[12px] text-white/60 mb-1">Your referral link</div>
          <div className="text-[13px] break-all mb-3">{link}</div>
          <button onClick={copy} className="rounded-xl bg-gradient-to-r from-[#ff9800] to-[#f57c00] px-4 py-2 text-sm font-bold">
            Copy link
          </button>
        </div>

        {/* Date filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                preset === p.key ? 'bg-white text-[#0b1e4f]' : 'bg-white/10 text-white/80'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setPreset('custom')}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
              preset === 'custom' ? 'bg-white text-[#0b1e4f]' : 'bg-white/10 text-white/80'
            }`}
          >
            Custom
          </button>
        </div>

        {preset === 'custom' && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="date"
              value={customFrom}
              max={customTo}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-[13px] outline-none"
            />
            <span className="text-white/50 text-[12px]">to</span>
            <input
              type="date"
              value={customTo}
              min={customFrom}
              onChange={(e) => setCustomTo(e.target.value)}
              className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-[13px] outline-none"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Stat label="New Users" value={String(summary.newUsers)} />
          <Stat label="Deposits" value={String(summary.depositCount)} />
          <Stat label="Success Volume" value={`₹${summary.successVolume.toFixed(2)}`} />
          <Stat label="Commission" value={`₹${summary.commission.toFixed(2)}`} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User ID, phone or name"
            className="flex-1 rounded-xl bg-white/10 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-white/40"
          />
          <button
            onClick={() => void load()}
            className="rounded-xl bg-white/15 px-3.5 py-2.5 text-[13px] font-semibold"
          >
            {refreshing ? '…' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white/5 rounded-2xl p-6 text-center text-[13px] text-white/60">
              {refreshing ? 'Loading…' : 'No users found for this period.'}
            </div>
          )}
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>

        <div className="mt-6">
          <div className="text-[14px] font-bold mb-2">Commission earnings</div>
          {ledger.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-5 text-center text-[13px] text-white/60">
              No commission yet. You earn the moment an admin approves your user's deposit.
            </div>
          ) : (
            <div className="space-y-2">
              {ledger.map((e) => (
                <div key={e.id} className="bg-white/10 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold truncate">
                        {e.entryType === 'Settlement'
                          ? `Admin Settlement Paid: -₹${Math.abs(e.commission).toFixed(2)}`
                          : `${e.userName} deposited ₹${e.depositAmount.toFixed(2)}`}
                      </div>
                      <div className="text-[11px] text-white/45">
                        {e.entryType === 'Settlement' ? 'Paid offline by admin' : e.userPhone} ·{' '}
                        {new Date(e.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {e.entryType === 'Settlement' ? (
                        <div className="font-extrabold text-rose-300">
                          -₹{Math.abs(e.commission).toFixed(2)}
                        </div>
                      ) : (
                        <>
                          <div className="font-extrabold text-emerald-300">+₹{e.commission.toFixed(2)}</div>
                          <div className="text-[11px] text-white/45">{e.ratePercentage}%</div>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-block mt-2 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      e.entryType === 'Settlement'
                        ? 'bg-rose-500/20 text-rose-300'
                        : e.status === 'Settled'
                          ? 'bg-white/15 text-white/70'
                          : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {e.entryType === 'Settlement' ? 'Settlement' : e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[12px] text-white/50 mt-5">
          Level 1: {COMMISSION_TIERS.level1}% · Level 2: {COMMISSION_TIERS.level2}% · Level 3: {COMMISSION_TIERS.level3}%
        </p>
        <p className="text-[11px] text-white/40 mt-2">
          View-only access. Agents cannot approve deposits, change balances or create agents.
        </p>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: AgentMember }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-bold text-[15px] truncate">{member.name}</div>
          <div className="text-[12px] text-white/60">{member.phone}</div>
          <div className="text-[11px] text-white/40 break-all mt-1">ID: {member.id}</div>
          <div className="text-[11px] text-white/40">
            Joined {new Date(member.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[12px] text-white/60">Deposited</div>
          <div className="font-extrabold">₹{member.totalSuccess.toFixed(2)}</div>
          {member.pendingCount > 0 && (
            <div className="text-[11px] text-amber-300 mt-1">{member.pendingCount} pending</div>
          )}
        </div>
      </div>

      {member.deposits.length > 0 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 text-[12px] text-white/70 underline"
          >
            {open ? 'Hide' : `View ${member.deposits.length} deposit${member.deposits.length > 1 ? 's' : ''}`}
          </button>
          {open && (
            <div className="mt-2 space-y-2">
              {member.deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <div>
                    <div className="text-[13px] font-semibold">₹{d.amount.toFixed(2)}</div>
                    <div className="text-[11px] text-white/45">
                      {new Date(d.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <StatusPill status={d.status} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: 'Pending' | 'Success' | 'Rejected' }) {
  const cls =
    status === 'Success'
      ? 'bg-emerald-500/20 text-emerald-300'
      : status === 'Pending'
        ? 'bg-amber-500/20 text-amber-300'
        : 'bg-rose-500/20 text-rose-300';
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>{status}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 text-center">
      <div className="text-lg font-extrabold">{value}</div>
      <div className="text-[11px] text-white/60 mt-1">{label}</div>
    </div>
  );
}
