import { generateInviteCode } from './referral';
import { supabase } from './supabase';
import { SITE_ORIGIN, referralLink } from './brand';
import { REF_CODE_KEY } from './referral';

export interface Agent {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  commissionPercentage: number;
  commissionBalance: number;
  totalCommissionEarned: number;
}

interface AgentRow {
  id: string;
  agent_id: string;
  name: string;
  phone: string;
  commission_percentage: number;
  total_deposits: number;
  wallet_balance?: number | null;
  total_commission?: number | null;
}

export const AGENT_SESSION_KEY = 'hkwallet_agent_session_v1';
/** Legacy query-style base — old links keep working. */
export const REFERRAL_BASE = `${SITE_ORIGIN}/download?ref=`;
export { SITE_ORIGIN, referralLink, REF_CODE_KEY };
export const COMMISSION_TIERS = {
  level1: 4,
  level2: 1.5,
  level3: 0.3,
} as const;

function mapAgent(r: AgentRow): Agent {
  return {
    id: r.id,
    agentId: r.agent_id,
    name: r.name,
    phone: r.phone,
    commissionPercentage: Number(r.commission_percentage ?? COMMISSION_TIERS.level1),
    commissionBalance: Number(r.wallet_balance ?? 0),
    totalCommissionEarned: Number(r.total_commission ?? 0),
  };
}

export function generateAgentCode(): string {
  return generateInviteCode();
}

export async function listAgents(): Promise<Agent[]> {
  const { data } = await supabase
    .from('agents')
    .select('*')
    .order('agent_id', { ascending: false });
  return ((data ?? []) as AgentRow[]).map(mapAgent);
}

export async function createAgent(input: {
  name: string;
  phone: string;
  commissionPercentage?: number;
}): Promise<{ ok: boolean; message: string; agent?: Agent }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateAgentCode();
    const { data, error } = await supabase
      .from('agents')
      .insert({
        agent_id: code,
        name: input.name,
        phone: input.phone,
        commission_percentage: input.commissionPercentage ?? COMMISSION_TIERS.level1,
      })
      .select('*')
      .single();
    if (!error && data) return { ok: true, message: `Agent created with code ${code}`, agent: mapAgent(data as AgentRow) };
    if (error && !error.message.toLowerCase().includes('duplicate')) {
      return { ok: false, message: error.message };
    }
  }
  return { ok: false, message: 'Could not generate a unique agent code. Try again.' };
}

export async function deleteAgent(id: string): Promise<void> {
  await supabase.from('agents').delete().eq('id', id);
}

export async function agentLogin(agentCode: string, phone: string): Promise<Agent | null> {
  const { data } = await supabase
    .from('agents')
    .select('*')
    .in('agent_id', Array.from(new Set([agentCode.trim(), agentCode.trim().toUpperCase()])))
    .eq('phone', phone.trim())
    .maybeSingle();
  return data ? mapAgent(data as AgentRow) : null;
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const { data } = await supabase.from('agents').select('*').eq('id', id).maybeSingle();
  return data ? mapAgent(data as AgentRow) : null;
}

export interface AgentStats {
  users: number;
  deposits: number;
  commission: number;
}

/** Aggregate registered users + successful deposit volume for one agent code. */
export async function getAgentStats(agentCode: string, commissionPercentage: number = COMMISSION_TIERS.level1): Promise<AgentStats> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .or(`referred_by.eq.${agentCode},referred_by_code.eq.${agentCode},referred_by_uid.eq.${agentCode}`);
  const ids = ((profiles ?? []) as { id: string }[]).map((p) => p.id);
  if (ids.length === 0) return { users: 0, deposits: 0, commission: 0 };
  const { data: txs } = await supabase
    .from('transaction_records')
    .select('amount,status,user_id')
    .in('user_id', ids)
    .eq('status', 'Success');
  const deposits = ((txs ?? []) as { amount: number }[]).reduce((s, t) => s + Number(t.amount || 0), 0);
  return {
    users: ids.length,
    deposits: +deposits.toFixed(2),
    commission: +((deposits * commissionPercentage) / 100).toFixed(2),
  };
}

export async function claimPreRegistration(phone: string, refCode: string): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from('pre_registrations')
    .upsert({ phone_number: phone, ref_code: refCode }, { onConflict: 'phone_number' });
  if (error) return { ok: false, message: error.message };
  try { localStorage.setItem(REF_CODE_KEY, refCode); } catch { /* ignore */ }
  return { ok: true, message: 'Bonus claimed! Your download is starting.' };
}

/** Referral code for a signup: pre-registration by phone first, then locally stored code. */
export async function lookupRefCode(phone: string): Promise<string | null> {
  if (phone.trim().length >= 10) {
    const { data } = await supabase
      .from('pre_registrations')
      .select('ref_code')
      .eq('phone_number', phone.trim())
      .maybeSingle();
    const code = (data as { ref_code: string } | null)?.ref_code;
    if (code) return code;
  }
  try { return localStorage.getItem(REF_CODE_KEY); } catch { return null; }
}

// ---------------------------------------------------------------------------
// AGENT DASHBOARD — READ-ONLY DATA ACCESS
// Agents may only READ rows belonging to their own agent code. No writes here.
// ---------------------------------------------------------------------------

export interface AgentMemberDeposit {
  id: string;
  amount: number;
  status: 'Pending' | 'Success' | 'Rejected';
  utr: string;
  createdAt: string;
}

export interface AgentMember {
  id: string;
  name: string;
  phone: string;
  wallet: number;
  createdAt: string;
  deposits: AgentMemberDeposit[];
  totalSuccess: number;
  pendingCount: number;
}

export interface AgentRangeSummary {
  members: AgentMember[];
  newUsers: number;
  depositCount: number;
  successVolume: number;
  pendingVolume: number;
  commission: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export function presetRange(preset: 'today' | 'yesterday' | 'last7' | 'all'): DateRange {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  if (preset === 'yesterday') {
    from.setDate(from.getDate() - 1);
    to.setDate(to.getDate() - 1);
  } else if (preset === 'last7') {
    from.setDate(from.getDate() - 6);
  } else if (preset === 'all') {
    from.setFullYear(2000, 0, 1);
  }
  return { from, to };
}

interface MemberProfileRow {
  id: string;
  name: string | null;
  phone: string | null;
  wallet: number | null;
  created_at: string;
}

interface MemberTxRow {
  id: string;
  user_id: string;
  amount: number | null;
  status: AgentMemberDeposit['status'];
  utr: string | null;
  created_at: string;
}

/**
 * Everything one agent is allowed to see: only the users registered under
 * their own agent code, plus those users' deposits, inside a date range.
 */
export async function getAgentRangeSummary(
  agentCode: string,
  range: DateRange,
  commissionPercentage: number = COMMISSION_TIERS.level1,
  agentUuid?: string | null,
): Promise<AgentRangeSummary> {
  const empty: AgentRangeSummary = {
    members: [], newUsers: 0, depositCount: 0, successVolume: 0, pendingVolume: 0, commission: 0,
  };
  if (!agentCode) return empty;

  const select = 'id,name,phone,wallet,created_at';

  // The database keeps text referral columns (agent code) and uuid columns
  // (the agent row id). Query each family separately so a uuid column never
  // receives a text agent code (Postgres 22P02).
  const [byCode, byUuid] = await Promise.all([
    supabase
      .from('profiles')
      .select(select)
      .or(
        `referred_by.eq.${agentCode},referred_by_code.eq.${agentCode},referred_by_uid.eq.${agentCode}`,
      ),
    agentUuid
      ? supabase
          .from('profiles')
          .select(select)
          .or(`agent_id.eq.${agentUuid},agent_ref_id.eq.${agentUuid},referred_by_id.eq.${agentUuid}`)
      : Promise.resolve({ data: [] as MemberProfileRow[] }),
  ]);

  const merged = new Map<string, MemberProfileRow>();
  for (const row of [
    ...(((byCode as { data: MemberProfileRow[] | null }).data ?? [])),
    ...(((byUuid as { data: MemberProfileRow[] | null }).data ?? [])),
  ]) {
    merged.set(row.id, row);
  }

  const profiles = [...merged.values()].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  if (profiles.length === 0) return empty;

  const fromIso = range.from.toISOString();
  const toIso = range.to.toISOString();

  const { data: txRows } = await supabase
    .from('transaction_records')
    .select('id,user_id,amount,status,utr,created_at')
    .in('user_id', profiles.map((p) => p.id))
    .gte('created_at', fromIso)
    .lte('created_at', toIso)
    .order('created_at', { ascending: false });

  const txs = (txRows ?? []) as MemberTxRow[];
  const byUser = new Map<string, AgentMemberDeposit[]>();
  for (const t of txs) {
    const list = byUser.get(t.user_id) ?? [];
    list.push({
      id: t.id,
      amount: Number(t.amount ?? 0),
      status: t.status,
      utr: t.utr ?? '',
      createdAt: t.created_at,
    });
    byUser.set(t.user_id, list);
  }

  // A user shows up when they registered in range OR deposited in range.
  const members: AgentMember[] = profiles
    .filter((p) => (p.created_at >= fromIso && p.created_at <= toIso) || byUser.has(p.id))
    .map((p) => {
      const deposits = byUser.get(p.id) ?? [];
      return {
        id: p.id,
        name: p.name ?? '—',
        phone: p.phone ?? '—',
        wallet: Number(p.wallet ?? 0),
        createdAt: p.created_at,
        deposits,
        totalSuccess: +deposits
          .filter((d) => d.status === 'Success')
          .reduce((s, d) => s + d.amount, 0)
          .toFixed(2),
        pendingCount: deposits.filter((d) => d.status === 'Pending').length,
      };
    });

  const successVolume = +txs
    .filter((t) => t.status === 'Success')
    .reduce((s, t) => s + Number(t.amount ?? 0), 0)
    .toFixed(2);
  const pendingVolume = +txs
    .filter((t) => t.status === 'Pending')
    .reduce((s, t) => s + Number(t.amount ?? 0), 0)
    .toFixed(2);

  return {
    members,
    newUsers: profiles.filter((p) => p.created_at >= fromIso && p.created_at <= toIso).length,
    depositCount: txs.length,
    successVolume,
    pendingVolume,
    commission: +((successVolume * commissionPercentage) / 100).toFixed(2),
  };
}

// ---------------------------------------------------------------------------
// COMMISSION LEDGER (read-only for agents, settle-only for the Super Admin)
// ---------------------------------------------------------------------------

export interface CommissionEntry {
  id: string;
  depositId: string;
  userName: string;
  userPhone: string;
  depositAmount: number;
  ratePercentage: number;
  commission: number;
  status: 'Unsettled' | 'Settled';
  entryType: 'Commission' | 'Settlement';
  createdAt: string;
}

interface LedgerRow {
  id: string;
  deposit_id: string | null;
  user_name: string | null;
  user_phone: string | null;
  deposit_amount: number | null;
  rate_percentage: number | null;
  commission_amount: number | null;
  status: string | null;
  entry_type?: string | null;
  created_at: string;
}

function mapLedger(r: LedgerRow): CommissionEntry {
  return {
    id: r.id,
    depositId: r.deposit_id ?? '',
    userName: r.user_name ?? '—',
    userPhone: r.user_phone ?? '—',
    depositAmount: Number(r.deposit_amount ?? 0),
    ratePercentage: Number(r.rate_percentage ?? 0),
    commission: Number(r.commission_amount ?? 0),
    status: (r.status === 'Settled' ? 'Settled' : 'Unsettled'),
    entryType: r.entry_type === 'Settlement' ? 'Settlement' : 'Commission',
    createdAt: r.created_at,
  };
}

/** Commission history for one agent (newest first). Read-only. */
export async function getAgentLedger(agentUuid: string, limit = 100): Promise<CommissionEntry[]> {
  if (!agentUuid) return [];
  const { data, error } = await supabase
    .from('agent_commission_ledger')
    .select('*')
    .eq('agent_id', agentUuid)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return ((data ?? []) as LedgerRow[]).map(mapLedger);
}

export interface AgentWallet {
  balance: number;
  totalEarned: number;
}

export async function getAgentWallet(agentUuid: string): Promise<AgentWallet> {
  const { data } = await supabase
    .from('agents')
    .select('wallet_balance,total_commission')
    .eq('id', agentUuid)
    .maybeSingle();
  const row = data as { wallet_balance: number | null; total_commission: number | null } | null;
  return {
    balance: Number(row?.wallet_balance ?? 0),
    totalEarned: Number(row?.total_commission ?? 0),
  };
}

/**
 * SUPER ADMIN ONLY — records an offline payout of ANY amount (partial allowed).
 * Deducts exactly the entered amount from the unsettled balance and writes a
 * negative "Settlement" ledger row. Lifetime earned is never touched.
 */
export async function settleAgentCommission(
  agentUuid: string,
  amount: number,
  note?: string,
): Promise<{ ok: boolean; message: string; balance?: number }> {
  if (!agentUuid || !(amount > 0)) return { ok: false, message: 'Enter a valid amount.' };
  const paid = +amount.toFixed(2);

  // Preferred path: atomic database function.
  const rpc = await supabase.rpc('settle_agent_commission', {
    p_agent_id: agentUuid,
    p_amount: paid,
    p_note: note ?? null,
  });
  if (!rpc.error) {
    const balance = Number(rpc.data ?? 0);
    return {
      ok: true,
      balance,
      message: `₹${paid.toFixed(2)} settled. Remaining balance ₹${balance.toFixed(2)}.`,
    };
  }
  // If the function exists but rejected the request, surface its reason.
  if (!/function|schema cache|does not exist|404/i.test(rpc.error.message)) {
    return { ok: false, message: rpc.error.message };
  }

  // Fallback: same behaviour client-side when the SQL script is not run yet.
  const wallet = await getAgentWallet(agentUuid);
  if (paid > wallet.balance) return { ok: false, message: 'Amount is more than the unsettled balance.' };

  const newBalance = +(wallet.balance - paid).toFixed(2);
  const { data: cur } = await supabase
    .from('agents')
    .select('total_settled')
    .eq('id', agentUuid)
    .maybeSingle();
  const settledSoFar = Number((cur as { total_settled: number | null } | null)?.total_settled ?? 0);
  const { error } = await supabase
    .from('agents')
    .update({ wallet_balance: newBalance, total_settled: +(settledSoFar + paid).toFixed(2) })
    .eq('id', agentUuid);
  if (error) return { ok: false, message: error.message };

  await supabase.from('agent_settlements').insert({ agent_id: agentUuid, amount: paid, note: note ?? null });
  await supabase.from('agent_commission_ledger').insert({
    agent_id: agentUuid,
    commission_amount: -paid,
    entry_type: 'Settlement',
    status: 'Settled',
    settled_at: new Date().toISOString(),
    note: note ?? null,
  });
  return {
    ok: true,
    balance: newBalance,
    message: `₹${paid.toFixed(2)} settled. Remaining balance ₹${newBalance.toFixed(2)}.`,
  };
}
