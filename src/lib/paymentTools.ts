/**
 * Payment wallets allowed for INR claim payments (Mobikwik / PhonePe / Paytm /
 * Freecharge) plus the deep links used by the "go pay" button.
 */
import type { LinkedUPI } from './types';
import { getLogoUrl } from './storage';

export type Brand = 'mobikwik' | 'paytm' | 'phonepe' | 'freecharge';

const BRANDS: Record<string, Brand> = {
  mobikwik: 'mobikwik',
  paytm: 'paytm',
  'paytm-biz': 'paytm',
  phonepe: 'phonepe',
  'phonepe-biz': 'phonepe',
  freecharge: 'freecharge',
};

export function brandOf(partnerId: string): Brand | null {
  return BRANDS[partnerId] ?? null;
}

export interface PaymentTool {
  id: string;
  partnerId: string;
  brand: Brand;
  name: string;
  number: string;
  upiId: string;
  logoUrl: string;
}

const LOGOS: Record<Brand, string> = {
  mobikwik: 'MobiKwik.jpg',
  paytm: 'Paytm.png',
  phonepe: 'Phonepe.png',
  freecharge: 'Freecharge.png',
};

const LABELS: Record<Brand, string> = {
  mobikwik: 'Mobikwik',
  paytm: 'Paytm',
  phonepe: 'Phonepe',
  freecharge: 'Freecharge',
};

/** Only the user's own linked wallets that are accepted for payments. */
export function eligibleTools(upis: LinkedUPI[] | undefined): PaymentTool[] {
  const unique = Array.from(
    new Map(
      [...(upis ?? [])]
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
        .map((upi) => [upi.upiId.trim().toLowerCase(), upi]),
    ).values(),
  );
  return unique.flatMap((u) => {
    const brand = brandOf(u.partnerId);
    if (!brand) return [];
    const linkedPhone = u.upiId.split('@')[0]?.replace(/\D/g, '') ?? '';
    return [{
      id: u.id,
      partnerId: u.partnerId,
      brand,
      name: u.partnerName || LABELS[brand],
      // Payment selection and order details show the linked tool's phone number.
      number: linkedPhone.length === 10 ? linkedPhone : u.maskedPhone,
      upiId: u.upiId,
      logoUrl: getLogoUrl(LOGOS[brand]),
    }];
  });
}

