import { useCallback, useEffect, useState } from 'react';
import { UserPlus, Trash2, IndianRupee, X } from 'lucide-react';
import { COMMISSION_TIERS, referralLink, createAgent, deleteAgent, getAgentStats, listAgents, settleAgentCommission, type Agent, type AgentStats } from '../../lib/agents';
import { useToast } from '../../lib/toast';

export default function Agents() {
  const toast = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Record<string, AgentStats>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState<number>(COMMISSION_TIERS.level1);
  const [busy, setBusy] = useState(false);
  const [settleTarget, setSettleTarget] = useState<Agent | null>(null);

  const load = useCallback(async () => {
    const list = await listAgents();
    setAgents(list);
    const entries = await Promise.all(
      list.map(async (a) => [a.agentId, await getAgentStats(a.agentId, a.commissionPercentage)] as const),
    );
    setStats(Object.fromEntries(entries));
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || phone.trim().length < 10) {
      toast('Enter a valid name and phone number', 'error');
      return;
    }
    const pct = Number(commissionPercentage);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      toast('Enter a valid commission percentage between 0 and 100', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await createAgent({ name: name.trim(), phone: phone.trim(), commissionPercentage: pct });
      toast(res.message, res.ok ? 'success' : 'error');
      if (res.ok) {
        setName('');
        setPhone('');
        setCommissionPercentage(COMMISSION_TIERS.level1);
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a: Agent) => {
    await deleteAgent(a.id);
    toast(`Agent ${a.agentId} removed`, 'info');
    await load();
  };

  /** Records a partial or full offline payout against the agent's ledger. */
  const confirmSettlement = async (agent: Agent, amount: number) => {
    setBusy(true);
    try {
      const res = await settleAgentCommission(agent.id, amount);
      toast(res.message, res.ok ? 'success' : 'error');
      if (res.ok) {
        setSettleTarget(null);
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Agent Management</h1>

      <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-5 grid gap-4 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Agent name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="10-digit phone" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Commission %</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={commissionPercentage}
            onChange={(e) => setCommissionPercentage(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="e.g. 5"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-semibold py-2 disabled:opacity-50">
            <UserPlus size={16} /> {busy ? 'Creating...' : 'Create Agent'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Agent</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Referral link</th>
              <th className="text-right px-4 py-3">Rate</th>
              <th className="text-right px-4 py-3">Users</th>
              <th className="text-right px-4 py-3">Deposits</th>
              <th className="text-right px-4 py-3">Owed</th>
              <th className="text-right px-4 py-3">Settle</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">No agents yet.</td></tr>
            )}
            {agents.map((a) => {
              const s = stats[a.agentId] ?? { users: 0, deposits: 0, commission: 0 };
              return (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{a.name}</div>
                    <div className="text-xs text-slate-400">{a.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{a.agentId}</td>
                  <td className="px-4 py-3 text-xs text-blue-600 break-all">{referralLink(a.agentId)}</td>
                  <td className="px-4 py-3 text-right">{a.commissionPercentage}%</td>
                  <td className="px-4 py-3 text-right">{s.users}</td>
                  <td className="px-4 py-3 text-right">₹{s.deposits}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                    ₹{a.commissionBalance.toFixed(2)}
                    <div className="text-[11px] font-normal text-slate-400">
                      earned ₹{a.totalCommissionEarned.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSettleTarget(a)}
                      disabled={busy || a.commissionBalance <= 0}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40"
                    >
                      <IndianRupee size={14} /> Settle
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(a)} className="text-rose-500 hover:text-rose-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {settleTarget && (
        <SettleModal
          agent={settleTarget}
          busy={busy}
          onClose={() => setSettleTarget(null)}
          onConfirm={(amount) => confirmSettlement(settleTarget, amount)}
          onInvalid={(msg) => toast(msg, 'error')}
        />
      )}
    </div>
  );
}

function SettleModal({
  agent,
  busy,
  onClose,
  onConfirm,
  onInvalid,
}: {
  agent: Agent;
  busy: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  onInvalid: (message: string) => void;
}) {
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(value);
    if (Number.isNaN(amount) || amount <= 0) {
      onInvalid('Enter a valid settlement amount');
      return;
    }
    if (amount > agent.commissionBalance) {
      onInvalid('Amount is more than the unsettled balance');
      return;
    }
    onConfirm(+amount.toFixed(2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Settle commission</h2>
            <p className="text-xs text-slate-500">{agent.name} · {agent.agentId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 mb-4">
          <div className="text-[11px] font-semibold uppercase text-emerald-700">Total unsettled balance</div>
          <div className="text-2xl font-extrabold text-emerald-700">₹{agent.commissionBalance.toFixed(2)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lifetime earned ₹{agent.totalCommissionEarned.toFixed(2)} (never reduced)
          </div>
        </div>

        <form onSubmit={submit}>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Enter settlement amount</label>
          <input
            autoFocus
            type="number"
            min={0}
            max={agent.commissionBalance}
            step={0.01}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 2500"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-2"
          />
          <button
            type="button"
            onClick={() => setValue(agent.commissionBalance.toFixed(2))}
            className="text-xs font-semibold text-blue-600 mb-4"
          >
            Pay full balance
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              <IndianRupee size={14} /> {busy ? 'Saving…' : 'Confirm Settlement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
