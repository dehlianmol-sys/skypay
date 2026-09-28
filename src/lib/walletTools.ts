/**
 * Add Wallet / Add Tool catalogue.
 *
 * Only five personal payment apps are in service (Mobikwik, Phonepe, Paytm,
 * Freecharge, IndusPay). Every other entry stays visible but unavailable.
 *
 * `apkUrl` points at the APK files attached to the public GitHub release whose
 * tag is `app.apk`. Asset names are lowercase and must match exactly.
 */
import { getLogoUrl } from './storage';

/* ===========================================================================
 * APK DOWNLOAD LINKS  —  EDIT ONLY THIS BLOCK
 * ---------------------------------------------------------------------------
 * File: src/lib/walletTools.ts   (yahi ek jagah link badalni hai)
 * Kisi bhi app ki link change karni ho to niche ki line me URL replace kar do.
 * Baaki code apne aap nayi link use karne lagega.
 * ========================================================================= */
export const APK_LINKS: Record<string, string> = {
  paytm: 'https://www.mediafire.com/file/bngrrz9f5b1eayo/paytm.apk/file?dkey=uaodpui9vyq&r=402',
  freecharge: 'https://www.mediafire.com/file/ay3wjvbawjq9zbl/freecharge.apk/file?dkey=9h8kaj46o3z&r=1005',
  phonepe: 'https://www.mediafire.com/file/pf3o7epas81n340/phonpe.apk/file?dkey=8e8exmfdstm&r=136',
  mobikwik: 'https://www.mediafire.com/file/30lkrap4zgyst3b/mobikek.apk/file?dkey=lmpkli1sn1f&r=719',
};

export type ToolCategory = 'personal' | 'business';

export interface WalletTool {
  id: string;
  category: ToolCategory;
  name: string;
  logoUrl: string;
  min?: number;
  max?: number;
  payout?: boolean;
  bonus?: string;
  available: boolean;
  /** UPI handles this app issues; the user picks one after entering the phone. */
  handles: string[];
  /** Filled in later by the owner. */
  apkUrl: string | null;
}

/** One teaching video is shared by every supported app. */
/**
 * Teaching video shown on the Add Wallet steps.
 * Paste the final link here and it is used everywhere.
 */
export const TEACHING_VIDEO_URL = 'https://youtu.be/ysA960kbEKA';

export const UNAVAILABLE_LABEL = 'Unavailable in service';

export const WALLET_TOOLS: WalletTool[] = [
  {
    id: 'freecharge', category: 'personal', name: 'Freecharge', logoUrl: getLogoUrl('Freecharge.png'),
    min: 200, max: 100000, payout: true, available: true, handles: ['@freecharge', '@fc'], apkUrl: APK_LINKS.freecharge,
  },
  {
    id: 'phonepe', category: 'personal', name: 'Phonepe', logoUrl: getLogoUrl('Phonepe.png'),
    min: 100, max: 2000, available: true, handles: ['@ybl', '@ibl', '@axl'], apkUrl: APK_LINKS.phonepe,
  },
  {
    id: 'mobikwik', category: 'personal', name: 'Mobikwik', logoUrl: getLogoUrl('MobiKwik.jpg'),
    min: 100, max: 100000, payout: true, available: true, handles: ['@mbkns', '@mbk', '@ikwik'], apkUrl: APK_LINKS.mobikwik,
  },
  {
    id: 'paytm', category: 'personal', name: 'Paytm', logoUrl: getLogoUrl('Paytm.png'),
    min: 10, max: 100000, payout: true, available: true,
    handles: ['@paytm', '@ptyes', '@ptaxis', '@ptsbi', '@pthdfc'], apkUrl: APK_LINKS.paytm,
  },
  {
    id: 'induspay', category: 'personal', name: 'IndusPay', logoUrl: getLogoUrl('Induspay.png'),
    min: 10, max: 100000, available: true, handles: ['@indus', '@indusind', '@indie'], apkUrl: null,
  },
  {
    id: 'bharatpe', category: 'personal', name: 'BharatpeBiz', logoUrl: getLogoUrl('Bharatpaybusiness.png'),
    min: 10, max: 100000, available: false, handles: [], apkUrl: null,
  },
  {
    id: 'navi', category: 'personal', name: 'Navi', logoUrl: getLogoUrl('Navi.png'),
    min: 50, max: 3000, available: false, handles: ['@naviaxis', '@navi'], apkUrl: null,
  },
  {
    id: 'paytm-biz', category: 'business', name: 'Paytm Business', logoUrl: getLogoUrl('Paytmbusiness.png'),
    min: 10, max: 100000, bonus: 'Binding Bonus', available: false, handles: [], apkUrl: null,
  },
  {
    id: 'googlepay-biz', category: 'business', name: 'GooglePay Business', logoUrl: getLogoUrl('Googlepay.png'),
    min: 50, max: 500, available: false, handles: [], apkUrl: null,
  },
];

export function toolById(id: string): WalletTool | undefined {
  return WALLET_TOOLS.find((t) => t.id === id);
}

/** Buy-side apps; the rest of the linked accounts land in the Sell tab. */
const BUY_TOOLS = new Set(['mobikwik', 'freecharge', 'induspay']);

export function tabTypeFor(toolId: string): 'Buy' | 'Sell' {
  return BUY_TOOLS.has(toolId) ? 'Buy' : 'Sell';
}

export function buildUpiOptions(tool: WalletTool, phone: string): string[] {
  return tool.handles.map((h) => `${phone}${h}`);
}
