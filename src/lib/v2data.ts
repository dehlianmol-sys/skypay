/**
 * Data helpers for the new Skypay screens (home banners, notice banner and
 * task reward configuration). Every query tolerates an older database schema:
 * if the new columns/tables are missing the UI simply falls back to defaults.
 */
import { useEffect, useMemo, useState } from 'react';
import { useStore } from './store';
import { supabase } from './supabase';
import { getPublicUrl } from './storage';

export interface HomeBanner {
  id: string;
  imageUrl: string;
}

export interface NoticeBanner {
  id: string;
  imageUrl: string;
  title: string;
  text: string;
}

export interface BannerData {
  normal: HomeBanner[];
  notice: NoticeBanner | null;
  notices?: NoticeBanner[];
  tutorial: HomeBanner[];
  submitTutorial: HomeBanner[];
}

interface BannerRowAny {
  id: string;
  url: string;
  banner_type?: string | null;
  title?: string | null;
  notice_text?: string | null;
  is_active?: boolean | null;
  sort_order?: number | null;
  created_at?: string;
}

export async function fetchBanners(): Promise<BannerData> {
  const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
  const rows = (data ?? []) as BannerRowAny[];
  const active = rows.filter((r) => r.is_active !== false);
  const isTutorial = (r: BannerRowAny) =>
    r.banner_type === 'tutorial' ||
    (r.banner_type === 'notice' && (r.title === '__tutorial__' || r.title === '__submit_tutorial__'));
  const isSubmitTutorial = (r: BannerRowAny) =>
    (r.banner_type === 'tutorial' || r.banner_type === 'notice') && r.title === '__submit_tutorial__';
  const normal = active
    .filter((r) => (r.banner_type ?? 'normal') !== 'notice' && !isTutorial(r))
    .map((r) => ({ id: r.id, imageUrl: getPublicUrl(r.url) }));
  const noticeRow = active.find((r) => r.banner_type === 'notice' && !isTutorial(r));
  const tutorial = active
    .filter((r) => isTutorial(r) && !isSubmitTutorial(r))
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0) || Date.parse(a.created_at ?? '') - Date.parse(b.created_at ?? ''))
    .map((r) => ({ id: r.id, imageUrl: getPublicUrl(r.url) }));
  const submitTutorial = active
    .filter(isSubmitTutorial)
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0) || Date.parse(a.created_at ?? '') - Date.parse(b.created_at ?? ''))
    .map((r) => ({ id: r.id, imageUrl: getPublicUrl(r.url) }));
  return {
    normal,
    tutorial,
    submitTutorial,
    notice: noticeRow
      ? {
          id: noticeRow.id,
          imageUrl: getPublicUrl(noticeRow.url),
          title: noticeRow.title ?? '',
          text: noticeRow.notice_text ?? '',
        }
      : null,
  };
}

/** Banners refresh after every central sync, including realtime and app resume. */
export function useBanners(): BannerData {
  const { activeBanners } = useStore();
  return useMemo(() => {
    const sortedTutorials = activeBanners
      .filter((banner) => banner.bannerType === 'tutorial')
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder || Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const asImage = (banner: (typeof activeBanners)[number]) => ({
      id: banner.id,
      imageUrl: getPublicUrl(banner.url),
    });
    const noticeList = activeBanners
      .filter((banner) => banner.bannerType === 'notice')
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder || Date.parse(a.createdAt) - Date.parse(b.createdAt))
      .map((banner) => ({ id: banner.id, imageUrl: getPublicUrl(banner.url), title: banner.title, text: banner.noticeText }));
    const noticeBanner = activeBanners.find((banner) => banner.bannerType === 'notice');
    return {
      notices: noticeList,
      normal: activeBanners.filter((banner) => banner.bannerType === 'normal').map(asImage),
      tutorial: sortedTutorials.filter((banner) => banner.title !== '__submit_tutorial__').map(asImage),
      submitTutorial: sortedTutorials.filter((banner) => banner.title === '__submit_tutorial__').map(asImage),
      notice: noticeBanner
        ? {
            id: noticeBanner.id,
            imageUrl: getPublicUrl(noticeBanner.url),
            title: noticeBanner.title,
            text: noticeBanner.noticeText,
          }
        : null,
    };
  }, [activeBanners]);
}

export interface DailyTier {
  amount: number;
  reward: number;
}

export interface TaskConfig {
  newbieRequiredAmount: number;
  newbieReward: number;
  inviteReward: number;
  dailyTiers: DailyTier[];
}

export const DEFAULT_DAILY_TIERS: DailyTier[] = [
  { amount: 10000, reward: 50 },
  { amount: 20000, reward: 100 },
  { amount: 40000, reward: 250 },
  { amount: 60000, reward: 300 },
  { amount: 80000, reward: 500 },
];

export const DEFAULT_TASK_CONFIG: TaskConfig = {
  newbieRequiredAmount: 3000,
  newbieReward: 100,
  inviteReward: 100,
  dailyTiers: DEFAULT_DAILY_TIERS,
};

export async function fetchTaskConfig(): Promise<TaskConfig> {
  const cfg: TaskConfig = { ...DEFAULT_TASK_CONFIG, dailyTiers: [...DEFAULT_DAILY_TIERS] };

  // Both reads travel together instead of one after the other.
  const [settings, tiers] = await Promise.all([
    supabase.from('app_settings').select('*').maybeSingle(),
    supabase.from('daily_task_tiers').select('*').order('amount', { ascending: true }).limit(20),
  ]);
  const s = settings.data as Record<string, unknown> | null;
  if (s) {
    const req = Number(s['newbie_required_order_amount']);
    const rew = Number(s['newbie_reward_amount']);
    const inv = Number(s['invite_reward_amount']);
    if (Number.isFinite(req) && req > 0) cfg.newbieRequiredAmount = req;
    if (Number.isFinite(rew) && rew > 0) cfg.newbieReward = rew;
    if (Number.isFinite(inv) && inv > 0) cfg.inviteReward = inv;
  }

  const tierRows = (tiers.data ?? []) as Array<{ amount: number; reward: number }>;
  if (tierRows.length) {
    cfg.dailyTiers = tierRows.map((r) => ({ amount: Number(r.amount), reward: Number(r.reward) }));
  }
  return cfg;
}

/** Task settings refresh after every central sync, including realtime and app resume. */
export function useTaskConfig(): TaskConfig {
  const { dataRevision } = useStore();
  const [cfg, setCfg] = useState<TaskConfig>(DEFAULT_TASK_CONFIG);
  useEffect(() => {
    let alive = true;
    fetchTaskConfig()
      .then((c) => { if (alive) setCfg(c); })
      .catch(() => {});
    return () => { alive = false; };
  }, [dataRevision]);
  return cfg;
}

/** The user-facing wallet ID: the last six digits of the phone number. */
export function walletUserId(phone: string | undefined | null): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  return digits.slice(-6) || '------';
}
