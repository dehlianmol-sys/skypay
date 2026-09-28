import { createFileRoute } from '@tanstack/react-router';
import { APP_CONFIG } from '@/config/app-config';

// Skypay — OTP sender endpoint (server side only).
// Environment driven, with a built-in fallback from src/config/app-config.ts so
// the OTP keeps working even when the .env file is missing:
//   SMS_API_URL, SMS_API_KEY, SMS_SENDER_ID, SMS_BRAND_NAME

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export const Route = createFileRoute('/api/public/send-otp')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as {
            phone?: string;
            otp?: string;
            senderType?: string;
            turnstileToken?: string;
          };

          const phone = (payload.phone ?? '').replace(/\D/g, '');
          const otp = (payload.otp ?? '').replace(/\D/g, '');

          if (phone.length !== 10) {
            return json({ error: 'A valid 10 digit mobile number is required.' }, 400);
          }
          if (otp.length !== 6) {
            return json({ error: 'A valid 6 digit OTP is required.' }, 400);
          }

          // Cloudflare Turnstile: verify the widget token server side before
          // spending an SMS. The secret key stays server-side only.
          const turnstileToken = (payload.turnstileToken ?? '').trim();
          if (!turnstileToken) {
            return json({ success: false, error: 'Please complete the security verification.' }, 200);
          }
          const turnstileSecret = process.env['TURNSTILE_SECRET_KEY'];
          if (!turnstileSecret) {
            console.error('send-otp: TURNSTILE_SECRET_KEY is not configured.');
            return json({ success: false, error: 'Verification is not configured. Please try again later.' }, 200);
          }
          const verifyBody = new URLSearchParams({ secret: turnstileSecret, response: turnstileToken });
          const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: verifyBody,
          });
          const verifyData = (await verifyResponse.json().catch(() => null)) as {
            success?: boolean;
            'error-codes'?: string[];
          } | null;
          if (!verifyData?.success) {
            console.error('send-otp: turnstile verification failed', verifyData?.['error-codes']);
            return json({ success: false, error: 'Verification failed. Please try again.' }, 200);
          }

          // Bulk Blaster OTP API
          const apiKey = process.env['SMS_API_KEY'] || APP_CONFIG.smsApiKey;
          const apiUrl = process.env['SMS_API_URL'] || APP_CONFIG.smsApiUrl;
          const senderType =
            payload.senderType || process.env['SMS_SENDER_ID'] || APP_CONFIG.smsSenderId;
          const brandName = process.env['SMS_BRAND_NAME'] || APP_CONFIG.smsBrandName;

          if (!apiKey) {
            console.error('send-otp: SMS_API_KEY is not configured.');
            return json({ success: false, error: 'SMS service is not configured. Please contact support.' }, 200);
          }

          const providerResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey,
              phone,
              otp,
              brandName,
              senderType,
            }),
          });

          const providerData = (await providerResponse.json().catch(() => null)) as {
            success?: boolean;
            error?: string;
          } | null;

          if (!providerResponse.ok || providerData?.success === false) {
            console.error(
              'send-otp: provider error',
              providerResponse.status,
              providerData?.error ?? 'unknown',
            );
            return json(
              { success: false, error: providerData?.error ?? 'Could not send OTP. Please try again.' },
              200,
            );
          }

          return json({ success: true, phone });
        } catch (err) {
          console.error('send-otp: unexpected error', err);
          return json({ success: false, error: 'Unexpected error while sending OTP.' }, 200);
        }
      },
    },
  },
});
