import { useState } from 'react';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '../../lib/toast';
import type { PaymentGateway } from '../../lib/types';

export default function Gateways() {
  const { gateways, addGateway, updateGateway, deleteGateway } = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState<PaymentGateway | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setName(''); setPayeeName(''); setAccountNumber(''); setIfsc('');
    setActive(true);
    setShowForm(true);
  };

  const openEdit = (g: PaymentGateway) => {
    setEditing(g);
    setName(g.name);
    setPayeeName(g.payeeName ?? '');
    setAccountNumber(g.accountNumber ?? '');
    setIfsc(g.ifsc ?? '');
    setActive(g.active);
    setShowForm(true);
  };

  const save = async () => {
    if (saving) return;
    if (!name.trim() || !payeeName.trim() || !accountNumber.trim() || !ifsc.trim()) {
      toast('Bank name, payee name, account number and IFSC are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        payeeName: payeeName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        transferType: 'IMPS',
        upiId: '',
        qr: '',
        active,
      };
      if (editing) {
        await updateGateway(editing.id, payload);
        toast('Gateway updated', 'success');
      } else {
        await addGateway(payload);
        toast('Gateway added', 'success');
      }
      setShowForm(false);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not save gateway.', 'error');
    } finally {
      setSaving(false);
    }
  };


  const remove = async (g: PaymentGateway) => {
    if (deletingId) return;
    if (!confirm(`Delete gateway "${g.name}"?`)) return;
    setDeletingId(g.id);
    try {
      await deleteGateway(g.id);
      toast('Gateway deleted', 'info');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete this gateway', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Payment Gateways</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={16} /> Add Gateway
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateways.map((g) => (
          <div key={g.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-slate-800">{g.name}</div>
                <div className="text-xs text-slate-500">{g.active ? 'Active' : 'Inactive'}</div>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${g.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {g.active ? 'Live' : 'Off'}
              </span>
            </div>
            <div className="text-xs text-slate-600 break-all mb-3 space-y-0.5">
              <div>A/C: {g.accountNumber || '—'}</div>
              <div>Name: {g.payeeName || '—'}</div>
              <div>IFSC: {g.ifsc || '—'}</div>
              <div>Type: {g.transferType || 'IMPS'}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(g)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => remove(g)}
                disabled={deletingId === g.id}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 disabled:opacity-50"
              >
                {deletingId === g.id
                  ? <span className="w-3 h-3 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                  : <Trash2 size={12} />}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editing ? 'Edit Gateway' : 'Add Gateway'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Bank / Method Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NSDL Payments Bank"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Payee Account Number</label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 501069695676"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Payee Name</label>
                <input
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. dipendrabh eisare"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">IFSC Code</label>
                  <input
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="e.g. NSPB0000002"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Type</label>
                  <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700">IMPS</div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                Active
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  : <Check size={16} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
