import { useMemo, useState } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '../../lib/toast';
import { createSellOrder, updateSellOrder, useSellOrders, type SellOrder, type SellStatus } from '@/lib/sellOrders';

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const badge: Record<SellStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
};

export default function SellOrders() {
  const { users, deposits, refreshData } = useStore();
  const toast = useToast();
  const { orders, reload } = useSellOrders(null, true);
  const [filter, setFilter] = useState<'all' | SellStatus>('all');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SellOrder | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ userId: '', upiId: '', amount: '', time: toLocalInput(new Date().toISOString()), status: 'pending' as SellStatus });

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const upisOf = (userId: string) =>
    Array.from(new Set((users.find((u) => u.id === userId)?.upis ?? []).map((x) => x.upiId).filter(Boolean)));
  const formUpis = upisOf(form.userId);

  const rows = useMemo(() => users
    .filter((u) => u.role === 'user')
    .map((u) => {
      const mine = orders.filter((o) => o.userId === u.id);
      const sold = mine.filter((o) => o.status === 'success').reduce((s, o) => s + o.amount, 0);
      const pending = mine.filter((o) => o.status === 'pending').reduce((s, o) => s + o.amount, 0);
      const hasDeposit = deposits.some((d) => d.userId === u.id && d.status === 'Success');
      return { u, sold, pending, remaining: u.wallet, total: u.wallet, hasDeposit };
    })
    .filter((r) => r.u.wallet > 0 || r.hasDeposit || r.pending > 0 || r.sold > 0), [users, orders, deposits]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(({ u }) => u.phone.includes(q) || u.id.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  }, [rows, search]);
  const PAGE = 10;
  const pages = Math.max(1, Math.ceil(filteredRows.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const pageRows = filteredRows.slice(safePage * PAGE, safePage * PAGE + PAGE);

  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
  const shown = orders.filter((o) => filter === 'all' || o.status === filter);

  const openCreate = (userId = '') => {
    const list = userId ? upisOf(userId) : [];
    setForm({ userId, upiId: list.length === 1 ? list[0] : '', amount: '', time: toLocalInput(new Date().toISOString()), status: 'pending' });
    setCreating(true);
  };

  const saveCreate = async () => {
    const amount = Number(form.amount);
    if (!form.userId || !form.upiId || !(amount > 0)) return toast('Select user, UPI and a valid amount', 'error');
    setSaving(true);
    try {
      await createSellOrder({ userId: form.userId, upiId: form.upiId, amount, status: form.status, createdAt: new Date(form.time).toISOString() });
      toast('Sell order created', 'success');
      setCreating(false);
      await Promise.all([reload(), refreshData()]);
    } catch (e) { toast((e as Error).message, 'error'); }
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSellOrder(editing.id, { status: editing.status, upiId: editing.upiId, createdAt: editing.createdAt });
      toast('Order updated', 'success');
      setEditing(null);
      await Promise.all([reload(), refreshData()]);
    } catch (e) { toast((e as Error).message, 'error'); }
    setSaving(false);
  };

  const input = 'w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">User Sell Orders</h1>
        <button onClick={() => openCreate()} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"><Plus size={16} /> New Sell Order</button>
      </div>

      <section className="bg-white rounded-xl shadow-sm">
        <div className="p-4 space-y-3">
          <h2 className="font-semibold text-slate-700">Users with balance <span className="text-xs text-slate-400">({filteredRows.length})</span></h2>
          <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Search by Mobile Number, User ID, or Name" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left"><tr>
              <th className="p-3">User</th><th className="p-3">Total Balance</th><th className="p-3">Total Sold</th><th className="p-3">Pending Sell</th><th className="p-3">Remaining</th><th className="p-3" />
            </tr></thead>
            <tbody>{pageRows.map(({ u, total, sold, pending, remaining }) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="p-3">{u.name}<div className="text-xs text-slate-400">{u.phone}</div></td>
                <td className="p-3">{total.toFixed(2)}</td><td className="p-3">{sold.toFixed(2)}</td>
                <td className="p-3">{pending.toFixed(2)}</td><td className="p-3 font-semibold">{remaining.toFixed(2)}</td>
                <td className="p-3"><button onClick={() => openCreate(u.id)} className="text-blue-600 text-xs">Sell</button></td>
              </tr>))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-slate-100">
          {pageRows.map(({ u, total, sold, pending, remaining }) => (
            <div key={u.id} className="p-3 text-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="min-w-0"><div className="truncate font-medium">{u.name}</div><div className="text-xs text-slate-400">{u.phone}</div></div>
                <button onClick={() => openCreate(u.id)} className="shrink-0 bg-blue-600 text-white rounded-lg px-3 py-1 text-xs">Sell</button>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
                <span>Total: <b>{total.toFixed(2)}</b></span><span>Sold: <b>{sold.toFixed(2)}</b></span>
                <span>Pending: <b>{pending.toFixed(2)}</b></span><span>Remaining: <b>{remaining.toFixed(2)}</b></span>
              </div>
            </div>
          ))}
        </div>
        {filteredRows.length === 0 && <p className="p-4 text-center text-sm text-slate-400">No users found</p>}
        <div className="flex items-center justify-between p-3 border-t border-slate-100 text-sm">
          <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)} className="px-3 py-1 rounded-lg bg-slate-100 disabled:opacity-40">Previous</button>
          <span className="text-slate-500">Page {safePage + 1} of {pages}</span>
          <button disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)} className="px-3 py-1 rounded-lg bg-slate-100 disabled:opacity-40">Next</button>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="flex gap-2 p-4 flex-wrap">
          {(['all', 'pending', 'success', 'failed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs capitalize ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{f}</button>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left"><tr>
            <th className="p-3">Order</th><th className="p-3">User</th><th className="p-3">Amount</th><th className="p-3">UPI</th><th className="p-3">Status</th><th className="p-3">Time</th><th className="p-3" />
          </tr></thead>
          <tbody>{shown.map((o) => {
            const u = userById.get(o.userId);
            return (
              <tr key={o.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{o.orderCode}</td>
                <td className="p-3">{u?.name ?? '—'}<div className="text-xs text-slate-400">{u?.phone}</div></td>
                <td className="p-3">{o.amount.toFixed(2)}</td><td className="p-3">{o.upiId}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${badge[o.status]}`}>{o.status}</span></td>
                <td className="p-3 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-3"><button onClick={() => setEditing({ ...o })} className="flex items-center gap-1 text-blue-600 text-xs"><Pencil size={14} /> Edit Order</button></td>
              </tr>);
          })}
            {shown.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-slate-400">No sell orders</td></tr>}
          </tbody>
        </table>
      </section>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 space-y-2 overflow-y-auto" style={{ maxHeight: '85vh' }}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{creating ? 'New Sell Order' : `Edit ${editing?.orderCode}`}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }}><X size={18} /></button>
            </div>
            {creating ? (<>
              <select className={input} value={form.userId} onChange={(e) => { const id = e.target.value; const list = upisOf(id); setForm({ ...form, userId: id, upiId: list.length === 1 ? list[0] : '' }); }}>
                <option value="">Select user</option>
                {rows.map(({ u }) => <option key={u.id} value={u.id}>{u.name} · {u.phone} · ₹{u.wallet.toFixed(2)}</option>)}
              </select>
              <select className={input} value={form.upiId} disabled={!form.userId || formUpis.length === 0} onChange={(e) => setForm({ ...form, upiId: e.target.value })}>
                <option value="">{form.userId ? 'Select UPI ID' : 'Select a user first'}</option>
                {formUpis.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              {form.userId && formUpis.length === 0 && (
                <p className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2 py-1">⚠️ Selected user has not added any UPI ID yet</p>
              )}
              <input className={input} type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input className={input} type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SellStatus })}>
                <option value="pending">Pending</option><option value="success">Success</option><option value="failed">Failed</option>
              </select>
              <button disabled={saving} onClick={saveCreate} className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            </>) : editing && (<>
              {(() => { const u = userById.get(editing.userId); return (
                <div className="text-sm bg-slate-50 rounded-lg p-3 space-y-1">
                  <div>User: <b>{u?.name}</b> ({u?.phone})</div>
                  <div>Wallet: ₹{u?.wallet.toFixed(2)}</div>
                  <div>Amount: <b>₹{editing.amount.toFixed(2)}</b></div>
                </div>); })()}
              <select className={input} value={editing.upiId} onChange={(e) => setEditing({ ...editing, upiId: e.target.value })}>
                {[editing.upiId, ...upisOf(editing.userId).filter((x) => x !== editing.upiId)].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <input className={input} type="datetime-local" value={toLocalInput(editing.createdAt)} onChange={(e) => setEditing({ ...editing, createdAt: new Date(e.target.value).toISOString() })} />
              <select className={input} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as SellStatus })}>
                <option value="pending">Pending</option><option value="success">Success</option><option value="failed">Failed</option>
              </select>
              <button disabled={saving} onClick={saveEdit} className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm disabled:opacity-60">{saving ? 'Saving…' : 'Save Status'}</button>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}
