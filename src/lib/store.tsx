import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppSettings, Banner, CustomerService, Deposit, LinkedUPI, PaymentGateway, User } from './types';
import { isSupabaseConfigured, phoneToAuthEmail, supabase } from './supabase';
import { uploadImage as uploadToStorage, removeStoredImage } from './storage';
import { generateUserCode } from './referral';
import { isOrderExpired, SUBMIT_EXTENSION_MS } from './orderStatus';

const SESSION_KEY = 'hkwallet_session_v1';

interface ProfileRow {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: User['role'];
  wallet: number;
  has_deposited_300: boolean;
  locked_deposit_id: string | null;
  agent_id: string | null;
  created_at: string;
}

interface UpiRow {
  id: string;
  user_id: string;
  partner_id: string;
  partner_name: string;
  masked_phone: string;
  upi_id: string;
  tab_type: 'Buy' | 'Sell';
  is_selling: boolean;
  created_at: string;
}

interface GatewayRow {
  id: string;
  name: string;
  upi_id: string;
  qr: string;
  active: boolean;
  created_at: string;
  payee_name?: string | null;
  account_number?: string | null;
  ifsc?: string | null;
  transfer_type?: string | null;
}

interface BannerRow {
  id: string;
  url: string;
  is_active?: boolean | null;
  banner_type?: string | null;
  title?: string | null;
  notice_text?: string | null;
  sort_order?: number | null;
  created_at: string;
}

interface AppSettingsRow {
  id: string;
  reward_percentage: number;
  min_order_size: number;
  max_order_size: number;
  newbie_required_order_amount: number;
  newbie_reward_amount: number;
}

interface CustomerServiceRow {
  id: string;
  icon_url: string;
  name: string;
  description: string;
  link_url: string;
  created_at: string;
}

interface TxRow {
  id: string;
  user_id: string;
  user_phone: string;
  user_name: string;
  amount: number;
  reward: number;
  itoken: number;
  utr: string;
  receipt_base64: string | null;
  payment_method: {
    name: string;
    upi_id: string;
    qr: string;
    payee_name?: string | null;
    account_number?: string | null;
    ifsc?: string | null;
    transfer_type?: string | null;
  } | null;
  status: Deposit['status'];
  type: string;
  created_at: string;
  expires_at: string;
}

interface StoreValue {
  loading: boolean;
  users: User[];
  deposits: Deposit[];
  gateways: PaymentGateway[];
  banners: Banner[];
  currentUser: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (phone: string, password: string) => Promise<{ ok: boolean; message: string; user?: User }>;
  register: (name: string, phone: string, password: string, agentId?: string | null, authUserId?: string | null) => Promise<{ ok: boolean; message: string; user?: User }>;
  clearLocalSession: () => void;
  logout: () => void;
  addLinkedUPI: (upi: Omit<LinkedUPI, 'id' | 'createdAt'>) => Promise<void>;
  /** Links a wallet tool, keeping only one active handle per app. */
  linkWalletTool: (upi: Omit<LinkedUPI, 'id' | 'createdAt'>) => Promise<void>;
  toggleSelling: (upiId: string) => Promise<void>;
  createDepositIntent: (amount: number) => Promise<{ ok: boolean; message: string; deposit?: Deposit }>;
  createUsdtDepositIntent: (amount: number, chain: 'trc20' | 'bep20') => Promise<{ ok: boolean; message: string; deposit?: Deposit }>;
  cancelDeposit: (depositId: string) => Promise<void>;
  submitDepositProof: (depositId: string, utr: string, receiptPath: string | null) => Promise<{ ok: boolean; message: string }>;
  approveDeposit: (depositId: string) => Promise<void>;
  rejectDeposit: (depositId: string) => Promise<void>;
  addGateway: (g: Omit<PaymentGateway, 'id' | 'createdAt'>) => Promise<void>;
  updateGateway: (id: string, patch: Partial<PaymentGateway>) => Promise<void>;
  deleteGateway: (id: string) => Promise<void>;
  addBanner: (url: string, options?: { bannerType?: 'normal' | 'notice' | 'tutorial'; title?: string; noticeText?: string; sortOrder?: number }) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  activeBanners: Banner[];
  activeGateways: PaymentGateway[];
  appSettings: AppSettings | null;
  updateAppSettings: (patch: Partial<Pick<AppSettings, 'rewardPercentage' | 'minOrderSize' | 'maxOrderSize' | 'newbieRequiredOrderAmount' | 'newbieRewardAmount'>>) => Promise<void>;
  customerServices: CustomerService[];
  addCustomerService: (cs: Omit<CustomerService, 'id' | 'createdAt'>) => Promise<void>;
  deleteCustomerService: (id: string) => Promise<void>;
  adjustUserBalance: (userId: string, delta: number) => Promise<void>;
  uploadImage: (file: File, folder: string) => Promise<string>;
  refreshData: () => Promise<void>;
  dataRevision: number;
}

const StoreContext = createContext<StoreValue | null>(null);

function mapUser(p: ProfileRow, upis: LinkedUPI[]): User {
  return {
    id: p.id,
    name: p.name,
    phone: p.phone,
    password: p.password,
    role: p.role,
    wallet: Number(p.wallet),
    has_deposited_300: p.has_deposited_300,
    upis,
    createdAt: p.created_at,
    lockedDepositId: p.locked_deposit_id,
  };
}

function mapUpi(r: UpiRow): LinkedUPI {
  return {
    id: r.id,
    partnerId: r.partner_id,
    partnerName: r.partner_name,
    maskedPhone: r.masked_phone,
    upiId: r.upi_id,
    tabType: r.tab_type,
    isSelling: r.is_selling,
    createdAt: r.created_at,
  };
}

function mapGateway(r: GatewayRow): PaymentGateway {
  return {
    id: r.id,
    name: r.name,
    upiId: r.upi_id ?? '',
    qr: r.qr ?? '',
    active: r.active,
    createdAt: r.created_at,
    payeeName: r.payee_name ?? '',
    accountNumber: r.account_number ?? '',
    ifsc: r.ifsc ?? '',
    transferType: r.transfer_type ?? 'IMPS',
  };
}

function mapBanner(r: BannerRow): Banner {
  const isSubmitMarker = r.title === '__submit_tutorial__';
  const isLegacyTutorial = r.banner_type === 'notice' && (r.title === '__tutorial__' || isSubmitMarker);
  const rawType = isLegacyTutorial ? 'tutorial' : (r.banner_type ?? 'normal');
  const bannerType: Banner['bannerType'] = rawType === 'notice' || rawType === 'tutorial' ? rawType : 'normal';
  return {
    id: r.id,
    url: r.url,
    isActive: r.is_active !== false,
    bannerType,
    title: isSubmitMarker ? '__submit_tutorial__' : isLegacyTutorial ? '' : (r.title ?? ''),
    noticeText: r.notice_text ?? '',
    sortOrder: Number(r.sort_order ?? 0),
    createdAt: r.created_at,
  };
}

function mapAppSettings(r: AppSettingsRow): AppSettings {
  return {
    id: r.id,
    rewardPercentage: Number(r.reward_percentage),
    minOrderSize: Number(r.min_order_size),
    maxOrderSize: Number(r.max_order_size),
    newbieRequiredOrderAmount: Number(r.newbie_required_order_amount ?? 300),
    newbieRewardAmount: Number(r.newbie_reward_amount ?? 60),
  };
}

function mapCustomerService(r: CustomerServiceRow): CustomerService {
  return {
    id: r.id,
    iconUrl: r.icon_url,
    name: r.name,
    description: r.description,
    linkUrl: r.link_url,
    createdAt: r.created_at,
  };
}

function mapDeposit(r: TxRow): Deposit {
  return {
    id: r.id,
    userId: r.user_id,
    userPhone: r.user_phone,
    userName: r.user_name,
    amount: Number(r.amount),
    reward: Number(r.reward),
    itoken: Number(r.itoken),
    utr: r.utr,
    receiptBase64: r.receipt_base64,
    paymentMethod: r.payment_method
      ? {
          name: r.payment_method.name,
          upiId: r.payment_method.upi_id ?? '',
          qr: r.payment_method.qr ?? '',
          payeeName: r.payment_method.payee_name ?? '',
          accountNumber: r.payment_method.account_number ?? '',
          ifsc: r.payment_method.ifsc ?? '',
          transferType: r.payment_method.transfer_type ?? 'IMPS',
        }
      : null,
    transactionType: r.type,
    status: r.status,
    createdAt: r.created_at,
    expiresAt: r.expires_at,
  };
}

/**
 * Surfaces write failures that would otherwise be swallowed — including the
 * silent "0 rows changed" case (blocked by row-level security), which is what
 * makes the UI look stuck on stale data after a successful-looking click.
 */
function assertWrite(
  res: { error: { message: string } | null; data?: unknown },
  action: string,
): void {
  if (res.error) throw new Error(`${action} failed: ${res.error.message}`);
  if (Array.isArray(res.data) && res.data.length === 0) {
    throw new Error(`${action} failed: the database rejected the change (no rows updated).`);
  }
}

function getSession(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}
function setSession(id: string | null) {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [customerServices, setCustomerServices] = useState<CustomerService[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => getSession());
  const [dataRevision, setDataRevision] = useState(() => Date.now());
  const mounted = useRef(true);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);

  const runRefresh = useCallback(async (targetSessionId = sessionUserId) => {
    const PROFILE_COLUMNS =
      'id,name,phone,password,role,wallet,has_deposited_300,locked_deposit_id,agent_id,created_at';
    const UPI_COLUMNS =
      'id,user_id,partner_id,partner_name,masked_phone,upi_id,tab_type,is_selling,created_at';
    const TX_COLUMNS =
      'id,user_id,user_phone,user_name,amount,reward,itoken,utr,receipt_base64,payment_method,status,type,created_at,expires_at';

    let pRes = targetSessionId
      ? await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', targetSessionId)
      : { data: [] as ProfileRow[], error: null };
    const ownProfile = ((pRes.data ?? []) as unknown as ProfileRow[])[0];
    const privileged = ownProfile?.role === 'admin' || ownProfile?.role === 'super_admin';
    if (privileged) pRes = await supabase.from('profiles').select(PROFILE_COLUMNS).limit(2000);

    const upiQuery = privileged
      ? supabase.from('upi_accounts').select(UPI_COLUMNS).limit(2000)
      : targetSessionId
        ? supabase.from('upi_accounts').select(UPI_COLUMNS).eq('user_id', targetSessionId).limit(50)
        : Promise.resolve({ data: [] as UpiRow[], error: null });
    const transactionQuery = privileged
      ? supabase.from('transaction_records').select(TX_COLUMNS).order('created_at', { ascending: false }).limit(500)
      : targetSessionId
        ? supabase
            .from('transaction_records')
            .select(TX_COLUMNS)
            .eq('user_id', targetSessionId)
            .order('created_at', { ascending: false })
            .limit(100)
        : Promise.resolve({ data: [] as TxRow[], error: null });

    // One round-trip burst: everything the app needs arrives together.
    const [uRes, gRes, bRes, tRes, sRes, csRes] = await Promise.all([
      upiQuery,
      supabase.from('payment_configurations').select('*').limit(100),
      supabase.from('banners').select('*').order('created_at', { ascending: false }).limit(30),
      transactionQuery,
      supabase.from('app_settings').select('*').maybeSingle(),
      supabase.from('customer_services').select('*').order('created_at', { ascending: false }).limit(30),
    ]);

    if (!mounted.current) return;

    const upisByUser: Record<string, LinkedUPI[]> = {};
    const newestByHandle = new Map<string, UpiRow>();
    for (const row of (uRes.data ?? []) as unknown as UpiRow[]) {
      const key = `${row.user_id}:${row.upi_id.trim().toLowerCase()}`;
      const current = newestByHandle.get(key);
      if (!current || Date.parse(row.created_at) > Date.parse(current.created_at)) {
        newestByHandle.set(key, row);
      }
    }
    for (const row of newestByHandle.values()) {
      (upisByUser[row.user_id] ??= []).push(mapUpi(row));
    }

    const mappedUsers = ((pRes.data ?? []) as unknown as ProfileRow[]).map((p) =>
      mapUser(p, upisByUser[p.id] ?? []),
    );
    setUsers(mappedUsers);
    setGateways(((gRes.data ?? []) as GatewayRow[]).map(mapGateway));
    setBanners(((bRes.data ?? []) as BannerRow[]).map(mapBanner));
    setDeposits(((tRes.data ?? []) as unknown as TxRow[]).map(mapDeposit));
    setAppSettings(sRes.data ? mapAppSettings(sRes.data as AppSettingsRow) : null);
    setCustomerServices(((csRes.data ?? []) as CustomerServiceRow[]).map(mapCustomerService));
    setDataRevision(Date.now());
    window.dispatchEvent(new CustomEvent('hkwallet:data-refreshed'));
  }, [sessionUserId]);

  // Any number of parallel refresh requests share a single in-flight fetch,
  // so a burst of clicks never turns into a burst of network calls.
  const refreshAll = useCallback(async (targetSessionId?: string | null) => {
    if (targetSessionId === undefined && inFlight.current) return inFlight.current;
    const promise = runRefresh(targetSessionId === undefined ? undefined : targetSessionId)
      .finally(() => { if (inFlight.current === promise) inFlight.current = null; });
    inFlight.current = promise;
    return promise;
  }, [runRefresh]);

  // Debounced refresh for realtime events — coalesces bursts of changes into one fetch
  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => {
      refreshTimer.current = null;
      refreshAll();
    }, 900);
  }, [refreshAll]);

  useEffect(() => {
    mounted.current = true;
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    (async () => {
      setLoading(true);
      try {
        await refreshAll();
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();

    const channel = supabase
      .channel('hkwallet-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'upi_accounts' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_configurations' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transaction_records' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_services' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_task_tiers' }, scheduleRefresh)
      .subscribe();

    const refreshOnResume = () => {
      if (document.visibilityState === 'visible') void refreshAll();
    };
    window.addEventListener('focus', refreshOnResume);
    window.addEventListener('pageshow', refreshOnResume);
    document.addEventListener('visibilitychange', refreshOnResume);

    return () => {
      mounted.current = false;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      window.removeEventListener('focus', refreshOnResume);
      window.removeEventListener('pageshow', refreshOnResume);
      document.removeEventListener('visibilitychange', refreshOnResume);
      supabase.removeChannel(channel);
    };
  }, [refreshAll, scheduleRefresh]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionUserId) ?? null,
    [users, sessionUserId],
  );

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const refreshData = useCallback(async () => {
    await refreshAll();
  }, [refreshAll]);

  // Latest snapshot for the background sweep below, without re-creating the
  // timer (and its listeners) every time the data changes.
  const liveRef = useRef({ user: currentUser, deposits });
  liveRef.current = { user: currentUser, deposits };

  // Keep timed-out orders and the user's active-order lock in sync even when
  // realtime delivery is delayed or the app returns from the background.
  const userId = currentUser?.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let running = false;
    const syncExpired = async () => {
      if (running) return;
      const { user, deposits: rows } = liveRef.current;
      if (!user) return;
      const now = Date.now();
      const expired = rows.filter((deposit) =>
        deposit.userId === user.id
        && deposit.status === 'Pending'
        && isOrderExpired(deposit, now),
      );
      if (expired.length === 0) return;
      running = true;
      try {
        const ids = expired.map((deposit) => deposit.id);
        const result = await supabase
          .from('transaction_records')
          .update({ status: 'Rejected' })
          .in('id', ids)
          .eq('status', 'Pending');
        if (result.error) throw result.error;
        if (user.lockedDepositId && ids.includes(user.lockedDepositId)) {
          const profileResult = await supabase
            .from('profiles')
            .update({ locked_deposit_id: null })
            .eq('id', user.id);
          if (profileResult.error) throw profileResult.error;
        }
        await refreshAll();
      } catch (error) {
        console.error('Could not refresh expired orders', error);
      } finally {
        running = false;
      }
    };
    void syncExpired();
    const interval = window.setInterval(syncExpired, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') void syncExpired(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId, refreshAll]);

  const login: StoreValue['login'] = useCallback(async (phone, password) => {
    if (!isSupabaseConfigured) {
      return { ok: false, message: 'Connection is not configured. Please try again shortly.' };
    }
    // 1) Official Supabase Auth sign-in — creates a real session so RLS-protected
    //    reads/writes run as the authenticated user.
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: phoneToAuthEmail(phone),
      password,
    });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    if (error && !authData?.user) return { ok: false, message: 'Network error. Please try again.' };
    if (!data) return { ok: false, message: 'Account not found. Please register.' };
    const row = data as ProfileRow;

    // 2) Legacy accounts created before Supabase Auth existed still log in with
    //    their stored profile password; everyone else must pass Auth.
    if (authError && row.password !== password) {
      return { ok: false, message: 'Incorrect password.' };
    }

    setSession(row.id);
    setSessionUserId(row.id);
    await refreshAll(row.id);
    return { ok: true, message: 'Login successful', user: mapUser(row, []) };
  }, [refreshAll]);

  const register: StoreValue['register'] = useCallback(async (name, phone, password, agentId, authUserId) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();
    if (existing) return { ok: false, message: 'Phone number already registered.' };

    const base = {
      // Link the profile row to the Supabase Auth user when we have one, so the
      // authenticated session and the profile share the same id.
      ...(authUserId ? { id: authUserId } : {}),
      name,
      phone,
      password,
      role: 'user',
      wallet: 149,
      has_deposited_300: false,
      agent_id: agentId || null,
    };
    // Own SHORT invite code for this user (USR82914) + who invited them.
    // Falls back gracefully when the referral columns do not exist yet.
    const ownCode = generateUserCode();
    const invitedBy = (agentId || '').trim() || null;
    let { data, error } = await supabase
      .from('profiles')
      .insert({ ...base, referral_code: ownCode, referred_by: invitedBy })
      .select('*')
      .single();
    if (error) {
      // Some databases still have referral/agent columns typed as uuid, which
      // rejects short codes like "AGT4674". Strip the agent code (and, if the
      // first retry still fails, the referral columns) so the account itself
      // is never lost. Run supabase/safe_migration.sql to fix the column types
      // permanently — referral attribution then works on the first insert.
      const isTypeError = /uuid|invalid input syntax|22P02/i.test(error.message ?? '');
      const retryBase = isTypeError ? { ...base, agent_id: null } : base;
      ({ data, error } = await supabase.from('profiles').insert(retryBase).select('*').single());
      if (error && isTypeError) {
        const { agent_id: _drop, ...bare } = base;
        ({ data, error } = await supabase.from('profiles').insert(bare).select('*').single());
      }
    }
    if (error) return { ok: false, message: error.message };
    const row = data as ProfileRow;
    setSession(row.id);
    setSessionUserId(row.id);
    await refreshAll(row.id);
    return { ok: true, message: 'Registration successful! ₹149 welcome bonus added.', user: mapUser(row, []) };
  }, [refreshAll]);

  const clearLocalSession = useCallback(() => {
    setSession(null);
    setSessionUserId(null);
    void supabase.auth.signOut();
  }, []);

  const logout = clearLocalSession;

  const addLinkedUPI: StoreValue['addLinkedUPI'] = useCallback(async (upi) => {
    if (!currentUser) return;
    const { error } = await supabase.from('upi_accounts').insert({
      user_id: currentUser.id,
      partner_id: upi.partnerId,
      partner_name: upi.partnerName,
      masked_phone: upi.maskedPhone,
      upi_id: upi.upiId,
      tab_type: upi.tabType,
      is_selling: upi.isSelling,
    });
    if (error) throw error;
    await refreshAll();
  }, [currentUser, refreshAll]);

  // One app = one active handle: relinking the same app replaces the old row.
  const linkWalletTool: StoreValue['linkWalletTool'] = useCallback(async (upi) => {
    if (!currentUser) return;
    const { error: delError } = await supabase
      .from('upi_accounts')
      .delete()
      .eq('user_id', currentUser.id)
      .or(`partner_id.eq.${upi.partnerId},upi_id.ilike.${upi.upiId.trim()}`);
    if (delError) throw delError;
    const { error } = await supabase.from('upi_accounts').insert({
      user_id: currentUser.id,
      partner_id: upi.partnerId,
      partner_name: upi.partnerName,
      masked_phone: upi.maskedPhone,
      upi_id: upi.upiId,
      tab_type: upi.tabType,
      is_selling: upi.isSelling,
    });
    if (error) throw error;
    await refreshAll();
  }, [currentUser, refreshAll]);


  const toggleSelling: StoreValue['toggleSelling'] = useCallback(async (upiId) => {
    // Read the live value from the database first: a value captured from React
    // state can be one refresh behind, which made the button need two or three
    // taps before it flipped. Now one tap always lands.
    const { data: row, error: readError } = await supabase
      .from('upi_accounts')
      .select('id,is_selling')
      .eq('id', upiId)
      .maybeSingle();
    if (readError) throw readError;
    if (!row) return;
    const next = !row.is_selling;
    const snapshot = users;
    setUsers((prev) => prev.map((u) => ({
      ...u,
      upis: u.upis.map((x) => (x.id === upiId ? { ...x, isSelling: next } : x)),
    })));
    try {
      assertWrite(
        await supabase.from('upi_accounts').update({ is_selling: next }).eq('id', upiId).select('id'),
        'Updating the account',
      );
    } catch (e) {
      if (mounted.current) setUsers(snapshot);
      throw e;
    } finally {
      await refreshAll();
    }
  }, [users, refreshAll]);

  const createDepositIntent: StoreValue['createDepositIntent'] = useCallback(async (amount) => {
    if (!currentUser) return { ok: false, message: 'Please log in.' };
    if (currentUser.lockedDepositId) {
      const existing = deposits.find((d) => d.id === currentUser.lockedDepositId);
      if (existing && existing.status === 'Pending' && new Date(existing.expiresAt).getTime() > Date.now()) {
        return { ok: false, message: 'You already have an active deposit. Complete or cancel it first.' };
      }
    }
    const active = gateways.filter((g) =>
      g.active && g.payeeName?.trim() && g.accountNumber?.trim() && g.ifsc?.trim(),
    );
    if (active.length === 0) return { ok: false, message: 'No payment methods available. Please try later.' };
    const chosen = active[Math.floor(Math.random() * active.length)];
    const rewardPct = appSettings?.rewardPercentage ?? 4;
    const reward = +(amount * rewardPct / 100).toFixed(2);
    const now = Date.now();
    const { data, error } = await supabase
      .from('transaction_records')
      .insert({
        user_id: currentUser.id,
        user_phone: currentUser.phone,
        user_name: currentUser.name,
        amount,
        reward,
        itoken: +(amount + reward).toFixed(2),
        utr: '',
        receipt_base64: null,
        payment_method: {
          name: chosen.name,
          upi_id: '',
          qr: '',
          payee_name: chosen.payeeName ?? '',
          account_number: chosen.accountNumber ?? '',
          ifsc: chosen.ifsc ?? '',
          transfer_type: chosen.transferType ?? 'IMPS',
        },
        status: 'Pending',
        type: 'deposit',
        created_at: new Date(now).toISOString(),
        expires_at: new Date(now + 30 * 60 * 1000).toISOString(),
      })
      .select('*')
      .single();
    if (error || !data) return { ok: false, message: 'Could not create order. Please try again.' };
    const tx = mapDeposit(data as TxRow);
    await supabase.from('profiles').update({ locked_deposit_id: tx.id }).eq('id', currentUser.id);
    await refreshAll();
    return { ok: true, message: 'Order created. Pay within 30 minutes.', deposit: tx };
  }, [currentUser, deposits, gateways, appSettings, refreshAll]);

  const createUsdtDepositIntent: StoreValue['createUsdtDepositIntent'] = useCallback(async (amount, chain) => {
    if (!currentUser) return { ok: false, message: 'Please log in.' };
    const rewardPct = appSettings?.rewardPercentage ?? 4;
    const convertedAmount = amount * 110.5;
    const reward = +(convertedAmount * rewardPct / 100).toFixed(2);
    const now = Date.now();
    const isBep = chain === 'bep20';
    const { data, error } = await supabase.from('transaction_records').insert({
      user_id: currentUser.id,
      user_phone: currentUser.phone,
      user_name: currentUser.name,
      amount,
      reward,
      itoken: +(convertedAmount + reward).toFixed(2),
      utr: '',
      receipt_base64: null,
      payment_method: {
        name: isBep ? 'BSC-USDT' : 'TRC20-USDT',
        upi_id: isBep ? '0xd90930988dd1a50e194e133a8f7f1dbeb9185411' : 'TAXw4PU4D7im1BiU5fuTtFdffDYauMM8Z5',
        qr: '',
        transfer_type: isBep ? 'BEP20' : 'TRC20',
      },
      status: 'Pending',
      type: `usdt-${chain}`,
      created_at: new Date(now).toISOString(),
      expires_at: new Date(now + 30 * 60 * 1000).toISOString(),
    }).select('*').single();
    if (error || !data) return { ok: false, message: error?.message ?? 'Could not create USDT order.' };
    const tx = mapDeposit(data as TxRow);
    setDeposits((previous) => [tx, ...previous.filter((item) => item.id !== tx.id)]);
    await refreshAll();
    return { ok: true, message: 'USDT order created.', deposit: tx };
  }, [currentUser, appSettings, refreshAll]);

  const cancelDeposit: StoreValue['cancelDeposit'] = useCallback(async (depositId) => {
    try {
      assertWrite(
        await supabase.from('transaction_records').delete().eq('id', depositId).select('id'),
        'Cancelling the order',
      );
      if (currentUser?.lockedDepositId === depositId) {
        await supabase.from('profiles').update({ locked_deposit_id: null }).eq('id', currentUser.id);
      }
    } finally {
      await refreshAll();
    }
  }, [currentUser, refreshAll]);

  const submitDepositProof: StoreValue['submitDepositProof'] = useCallback(async (depositId, utr, receiptPath) => {
    // The voucher screenshot is the proof now; a UTR is only validated when one is given.
    if (utr && !/^\d{12}$/.test(utr)) return { ok: false, message: 'UTR must be exactly 12 numeric digits.' };
    if (!utr && !receiptPath) return { ok: false, message: 'Please upload the payment voucher.' };
    // Submitting (or re-submitting) restarts a fresh 120 minute window and the
    // order stays locked with the admin until it is approved or rejected.
    const { error } = await supabase
      .from('transaction_records')
      .update({
        utr,
        receipt_base64: receiptPath,
        status: 'Pending',
        expires_at: new Date(Date.now() + SUBMIT_EXTENSION_MS).toISOString(),
      })
      .eq('id', depositId);
    if (error) return { ok: false, message: error.message };
    await refreshAll();
    return { ok: true, message: 'Payment proof submitted. Awaiting admin approval.' };
  }, [refreshAll]);

  /** Instantly reflects a status change locally; returns a rollback function. */
  const optimisticDepositStatus = useCallback((depositId: string, status: Deposit['status']) => {
    const snapshot = deposits;
    setDeposits((prev) => prev.map((d) => (d.id === depositId ? { ...d, status } : d)));
    return () => { if (mounted.current) setDeposits(snapshot); };
  }, [deposits]);

  const approveDeposit: StoreValue['approveDeposit'] = useCallback(async (depositId) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep || dep.status !== 'Pending') return;
    const rollback = optimisticDepositStatus(depositId, 'Success');
    try {
      assertWrite(
        await supabase.from('transaction_records').update({ status: 'Success' }).eq('id', depositId).select('id'),
        'Approval',
      );
      const target = users.find((u) => u.id === dep.userId);
      if (target) {
        const newbieMin = appSettings?.newbieRequiredOrderAmount ?? 300;
        const newbieReward = appSettings?.newbieRewardAmount ?? 60;
        const qualifiesForNewbie = !target.has_deposited_300 && dep.amount >= newbieMin;
        const bonus = qualifiesForNewbie ? newbieReward : 0;
        const patch: Record<string, unknown> = {
          wallet: +(target.wallet + dep.itoken + bonus).toFixed(2),
        };
        if (qualifiesForNewbie) patch.has_deposited_300 = true;
        if (target.lockedDepositId === depositId) patch.locked_deposit_id = null;
        assertWrite(
          await supabase.from('profiles').update(patch).eq('id', target.id).select('id'),
          'Wallet credit',
        );
      }
    } catch (e) {
      rollback();
      throw e;
    } finally {
      await refreshAll();
    }
  }, [deposits, users, appSettings, refreshAll, optimisticDepositStatus]);

  const rejectDeposit: StoreValue['rejectDeposit'] = useCallback(async (depositId) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;
    const rollback = optimisticDepositStatus(depositId, 'Rejected');
    try {
      assertWrite(
        await supabase.from('transaction_records').update({ status: 'Rejected' }).eq('id', depositId).select('id'),
        'Rejection',
      );
      const target = users.find((u) => u.id === dep.userId);
      if (target && target.lockedDepositId === depositId) {
        assertWrite(
          await supabase.from('profiles').update({ locked_deposit_id: null }).eq('id', target.id).select('id'),
          'Rejection',
        );
      }
    } catch (e) {
      rollback();
      throw e;
    } finally {
      await refreshAll();
    }
  }, [deposits, users, refreshAll, optimisticDepositStatus]);

  const adjustUserBalance: StoreValue['adjustUserBalance'] = useCallback(async (userId, delta) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newWallet = Math.max(0, +(target.wallet + delta).toFixed(2));
    const snapshot = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, wallet: newWallet } : u)));
    try {
      assertWrite(
        await supabase.from('profiles').update({ wallet: newWallet }).eq('id', userId).select('id'),
        'Balance update',
      );
    } catch (e) {
      if (mounted.current) setUsers(snapshot);
      throw e;
    } finally {
      await refreshAll();
    }
  }, [users, refreshAll]);

  const updateAppSettings: StoreValue['updateAppSettings'] = useCallback(async (patch) => {
    if (!appSettings) return;
    const dbPatch: Record<string, unknown> = {};
    if (patch.rewardPercentage !== undefined) dbPatch.reward_percentage = patch.rewardPercentage;
    if (patch.minOrderSize !== undefined) dbPatch.min_order_size = patch.minOrderSize;
    if (patch.maxOrderSize !== undefined) dbPatch.max_order_size = patch.maxOrderSize;
    if (patch.newbieRequiredOrderAmount !== undefined) dbPatch.newbie_required_order_amount = patch.newbieRequiredOrderAmount;
    if (patch.newbieRewardAmount !== undefined) dbPatch.newbie_reward_amount = patch.newbieRewardAmount;
    const { error } = await supabase.from('app_settings').update(dbPatch).eq('id', appSettings.id);
    if (error) throw error;
    await refreshAll();
  }, [appSettings, refreshAll]);

  const addCustomerService: StoreValue['addCustomerService'] = useCallback(async (cs) => {
    const { error } = await supabase.from('customer_services').insert({
      icon_url: cs.iconUrl,
      name: cs.name,
      description: cs.description,
      link_url: cs.linkUrl,
    });
    if (error) throw error;
    await refreshAll();
  }, [refreshAll]);

  const deleteCustomerService: StoreValue['deleteCustomerService'] = useCallback(async (id) => {
    const { error } = await supabase.from('customer_services').delete().eq('id', id);
    if (error) throw error;
    await refreshAll();
  }, [refreshAll]);

  const addGateway: StoreValue['addGateway'] = useCallback(async (g) => {
    const base = { name: g.name, upi_id: '', qr: '', active: g.active };
    const bank = {
      payee_name: g.payeeName ?? '',
      account_number: g.accountNumber ?? '',
      ifsc: g.ifsc ?? '',
      transfer_type: g.transferType ?? 'IMPS',
    };
    let res = await supabase.from('payment_configurations').insert({ ...base, ...bank }).select('id');
    // Databases without the bank columns yet still accept the original fields.
    if (res.error) res = await supabase.from('payment_configurations').insert(base).select('id');
    assertWrite(res, 'Adding the payment method');
    await refreshAll();
  }, [refreshAll]);

  const updateGateway: StoreValue['updateGateway'] = useCallback(async (id, patch) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    dbPatch.upi_id = '';
    dbPatch.qr = '';
    if (patch.active !== undefined) dbPatch.active = patch.active;
    const bankPatch: Record<string, unknown> = {};
    if (patch.payeeName !== undefined) bankPatch.payee_name = patch.payeeName;
    if (patch.accountNumber !== undefined) bankPatch.account_number = patch.accountNumber;
    if (patch.ifsc !== undefined) bankPatch.ifsc = patch.ifsc;
    if (patch.transferType !== undefined) bankPatch.transfer_type = patch.transferType;
    let res = await supabase
      .from('payment_configurations')
      .update({ ...dbPatch, ...bankPatch })
      .eq('id', id)
      .select('id');
    if (res.error && Object.keys(bankPatch).length > 0) {
      res = await supabase.from('payment_configurations').update(dbPatch).eq('id', id).select('id');
    }
    assertWrite(res, 'Updating the payment method');
    await refreshAll();
  }, [refreshAll]);

  const deleteGateway: StoreValue['deleteGateway'] = useCallback(async (id) => {
    assertWrite(
      await supabase.from('payment_configurations').delete().eq('id', id).select('id'),
      'Deleting the payment method',
    );
    await refreshAll();
  }, [refreshAll]);

  const addBanner: StoreValue['addBanner'] = useCallback(async (url, options) => {
    const type = options?.bannerType ?? 'normal';
    const payload: Record<string, unknown> = {
      url,
      banner_type: type,
      is_active: true,
      sort_order: options?.sortOrder ?? 0,
    };
    // The title always travels with the row: tutorial rows use it to tell the
    // install sequence apart from the submit sequence.
    payload['title'] = options?.title ?? '';
    payload['notice_text'] = options?.noticeText ?? '';
    let res = await supabase.from('banners').insert(payload).select('id');
    // Existing databases may still have the old normal/notice-only constraint.
    // Store tutorial rows with a reserved marker until the migration is applied.
    if (res.error && type === 'tutorial') {
      res = await supabase.from('banners').insert({
        url,
        banner_type: 'notice',
        title: options?.title === '__submit_tutorial__' ? '__submit_tutorial__' : '__tutorial__',
        notice_text: '',
        is_active: true,
        sort_order: options?.sortOrder ?? 0,
      }).select('id');
    }
    // Older databases without any banner metadata still accept a plain URL.
    if (res.error && type !== 'tutorial') res = await supabase.from('banners').insert({ url }).select('id');
    assertWrite(res, 'Adding the banner');
    await refreshAll();
  }, [refreshAll]);

  const deleteBanner: StoreValue['deleteBanner'] = useCallback(async (id) => {
    const stored = banners.find((b) => b.id === id)?.url ?? '';
    assertWrite(await supabase.from('banners').delete().eq('id', id).select('id'), 'Deleting the banner');
    // Remove the image file too, so storage does not keep orphaned uploads.
    await removeStoredImage(stored);
    await refreshAll();
  }, [banners, refreshAll]);

  const activeBanners = useMemo(() => banners.filter((banner) => banner.isActive), [banners]);
  const activeGateways = useMemo(() => gateways.filter((g) => g.active), [gateways]);

  const value: StoreValue = useMemo(() => ({
    loading,
    users,
    deposits,
    gateways,
    banners,
    currentUser,
    isAdmin,
    isSuperAdmin,
    login,
      register,
      clearLocalSession,
    logout,
    addLinkedUPI,
    linkWalletTool,
    toggleSelling,
    createDepositIntent,
    createUsdtDepositIntent,
    cancelDeposit,
    submitDepositProof,
    approveDeposit,
    rejectDeposit,
    addGateway,
    updateGateway,
    deleteGateway,
    addBanner,
    deleteBanner,
    activeBanners,
    activeGateways,
    appSettings,
    updateAppSettings,
    customerServices,
    addCustomerService,
    deleteCustomerService,
    adjustUserBalance,
    uploadImage: uploadToStorage,
    refreshData,
    dataRevision,
  }), [
    loading, users, deposits, gateways, banners, currentUser, isAdmin, isSuperAdmin,
    login, register, clearLocalSession, logout, addLinkedUPI, linkWalletTool, toggleSelling, createDepositIntent, createUsdtDepositIntent,
    cancelDeposit, submitDepositProof, approveDeposit, rejectDeposit,
    addGateway, updateGateway, deleteGateway, addBanner, deleteBanner,
    activeBanners, activeGateways, appSettings, updateAppSettings,
    customerServices, addCustomerService, deleteCustomerService, adjustUserBalance, refreshData, dataRevision,
    uploadToStorage,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
