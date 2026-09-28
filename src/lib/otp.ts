/**
 * Skypay — single place where the app asks for an SMS OTP.
 *
 * The request goes to this app's own endpoint (`/api/public/send-otp`), which
 * holds the SMS provider key server side (SMS_API_KEY). No Supabase Edge
 * Function is involved, so the flow keeps working in preview, on the published
 * site and in the exported build.
 *
 * senderType picks the DLT approved template:
 *   FYDBZR -> registration OTP
 *   GUERAR -> forgot / reset password OTP
 *   DASSAM -> generic login OTP (provider default)
 */
export type OtpSenderType = 'FYDBZR' | 'GUERAR' | 'DASSAM';

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpSms(
  phone: string,
  otp: string,
  senderType: OtpSenderType,
  turnstileToken?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch('/api/public/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, senderType, turnstileToken }),
    });
    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; error?: string }
      | null;

    if (!response.ok || data?.success === false || data?.error) {
      return { ok: false, error: data?.error ?? 'Could not send OTP. Please try again.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not send OTP. Please check your connection.' };
  }
}
