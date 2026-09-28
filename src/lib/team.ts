import { supabase } from './supabase';
import { referralLink, DEFAULT_COMMISSION_PERCENT } from './brand';
import { generateUserCode } from './referral';

/** Invitation link for a normal user — live domain + their SHORT code. */
export function userReferralLink(code: string): string {
  return code ? referralLink(code) : '';
}

export interface TeamStats {
  todayMembers: number;
  todayCommission: number;
  totalMembers: number;
  totalCommission: number;
}

const EMPTY: TeamStats = {
  todayMembers: 0,
  todayCommission: 0,
  totalMembers: 0,
  totalCommission: 0,
};

function startOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

interface MemberRow {
  id: string;
  created_at: string;
}

/**
 * Ensures the user has a short referral code; creates one if the column is
 * empty (older accounts) so every invite link is a short code, never a UUID.
 */
export async function ensureUserReferralCode(userId: string): Promise<string> {
  if (!userId) return '';
  const { data } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', userId)
    .maybeSingle();
  const existing = (data as { referral_code: string | null } | null)?.referral_code;
  if (existing) return existing;

  for (let i = 0; i < 5; i++) {
    const code = generateUserCode();
    const { error } = await supabase.from('profiles').update({ referral_code: code }).eq('id', userId);
    if (!error) return code;
  }
  return '';
}

/**
 * Real team figures for one user.
 * A member is any profile referred by this user's short code (legacy columns
 * holding the user id keep working).
 */
export async function getTeamStats(
  userId: string,
  referralCode?: string | null,
  commissionPercent: number = DEFAULT_COMMISSION_PERCENT,
): Promise<TeamStats> {
  if (!userId) return EMPTY;

  const keys = [...(referralCode ? [referralCode] : []), userId];
  const orFilter = keys
    .flatMap((k) => [`referred_by.eq.${k}`, `referred_by_code.eq.${k}`])
    .join(',');

  const { data: memberRows, error } = await supabase
    .from('profiles')
    .select('id,created_at')
    .or(orFilter);

  if (error || !memberRows || memberRows.length === 0) return EMPTY;

  const members = memberRows as MemberRow[];
  const ids = members.map((m) => m.id);
  const dayStart = startOfToday();
  const todayMembers = members.filter((m) => m.created_at >= dayStart).length;

  const { data: txRows } = await supabase
    .from('transaction_records')
    .select('amount,created_at')
    .in('user_id', ids)
    .eq('status', 'Success');

  const txs = (txRows ?? []) as { amount: number; created_at: string }[];
  const rate = commissionPercent / 100;
  const totalVolume = txs.reduce((s, t) => s + Number(t.amount || 0), 0);
  const todayVolume = txs
    .filter((t) => t.created_at >= dayStart)
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  return {
    todayMembers,
    todayCommission: +(todayVolume * rate).toFixed(2),
    totalMembers: members.length,
    totalCommission: +(totalVolume * rate).toFixed(2),
  };
}

export interface UserTeam {
  code: string;
  link: string;
  stats: TeamStats;
}

/** Short code + invite link + live team figures for the signed-in user. */
export async function getUserTeam(userId: string): Promise<UserTeam> {
  if (!userId) return { code: '', link: '', stats: EMPTY };
  const { data } = await supabase
    .from('profiles')
    .select('referral_code,commission_rate')
    .eq('id', userId)
    .maybeSingle();
  const row = data as { referral_code: string | null; commission_rate: number | null } | null;
  const code = row?.referral_code || (await ensureUserReferralCode(userId));
  const stats = await getTeamStats(
    userId,
    code,
    Number(row?.commission_rate ?? DEFAULT_COMMISSION_PERCENT),
  );
  return { code, link: userReferralLink(code), stats };
}

/** Backwards-compatible helper. */
export async function getTeamStatsForUser(userId: string): Promise<TeamStats> {
  return (await getUserTeam(userId)).stats;
}

/** One member row shown in the Level B / Level C lists. */
export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  volume: number;
}

export interface TeamLevels {
  B: TeamMember[];
  C: TeamMember[];
}

interface ProfileRow {
  id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  referral_code: string | null;
}

function orFor(keys: string[]): string {
  return keys
    .filter(Boolean)
    .flatMap((k) => [`referred_by.eq.${k}`, `referred_by_code.eq.${k}`])
    .join(',');
}

async function childrenOf(keys: string[]): Promise<ProfileRow[]> {
  const filter = orFor(keys);
  if (!filter) return [];
  const { data } = await supabase
    .from('profiles')
    .select('id,name,phone,created_at,referral_code')
    .or(filter);
  return (data ?? []) as ProfileRow[];
}

/** Success volume per user id, for the member lists. */
async function volumeByUser(ids: string[]): Promise<Record<string, number>> {
  if (ids.length === 0) return {};
  const { data } = await supabase
    .from('transaction_records')
    .select('user_id,amount')
    .in('user_id', ids)
    .eq('status', 'Success');
  const out: Record<string, number> = {};
  ((data ?? []) as { user_id: string; amount: number }[]).forEach((r) => {
    out[r.user_id] = (out[r.user_id] ?? 0) + Number(r.amount || 0);
  });
  return out;
}

/** Direct (Level B) and second-line (Level C) members of one user. */
export async function getTeamLevels(userId: string, referralCode?: string | null): Promise<TeamLevels> {
  if (!userId) return { B: [], C: [] };
  const code = referralCode || (await ensureUserReferralCode(userId));
  const bRows = await childrenOf([code, userId].filter(Boolean) as string[]);
  const bKeys = bRows.flatMap((r) => [r.referral_code, r.id].filter(Boolean) as string[]);
  const cRows = bRows.length ? await childrenOf(bKeys) : [];
  const bIds = new Set(bRows.map((r) => r.id));
  const cOnly = cRows.filter((r) => !bIds.has(r.id) && r.id !== userId);
  const volumes = await volumeByUser([...bRows, ...cOnly].map((r) => r.id));
  const toMember = (r: ProfileRow): TeamMember => ({
    id: r.id,
    name: r.name ?? '',
    phone: r.phone ?? '',
    createdAt: r.created_at,
    volume: +(volumes[r.id] ?? 0).toFixed(2),
  });
  return { B: bRows.map(toMember), C: cOnly.map(toMember) };
}
