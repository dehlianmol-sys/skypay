import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/toast';
import AuthHints, { phoneRules, passwordRules, isInvalid } from '@/components/AuthHints';
import { generateOtp, sendOtpSms } from '@/lib/otp';
import SecurityVerify from '@/components/SecurityVerify';
import AppLoading from '@/components/AppLoading';

const OTP_RATE_PREFIX = 'hk_reset_otp_rate_';

interface OtpRateRecord { attempts: number; lastRequestedAt: number; currentCooldown: number }

function readOtpRate(phone: string): OtpRateRecord | null {
  try {
    const raw = localStorage.getItem(OTP_RATE_PREFIX + phone);
    return raw ? (JSON.parse(raw) as OtpRateRecord) : null;
  } catch { return null; }
}

function cooldownRemaining(phone: string): number {
  const record = readOtpRate(phone);
  if (!record) return 0;
  return Math.max(0, record.currentCooldown - Math.floor((Date.now() - record.lastRequestedAt) / 1000));
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cooldown > 0]);

  useEffect(() => {
    if (!/^\d{10}$/.test(phone)) return;
    const remaining = cooldownRemaining(phone);
    if (remaining > 0) setCooldown(remaining);
  }, [phone]);

  const fail = (message: string) => {
    setStatus(message);
    toast(message, 'error');
  };

  const [verifyOpen, setVerifyOpen] = useState(false);
  const requestOtp = () => {
    if (loading || cooldown > 0) return;
    if (!/^\d{10}$/.test(phone)) return fail('Enter a 10-digit phone number.');
    setVerifyOpen(true);
  };

  const sendOtp = async (turnstileToken?: string) => {
    if (loading || cooldown > 0) return;
    if (!turnstileToken) return fail('Please complete the security verification.');
    setStatus('');
    if (!/^\d{10}$/.test(phone)) return fail('Enter a 10-digit phone number.');
    const remaining = cooldownRemaining(phone);
    if (remaining > 0) return setCooldown(remaining);
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles').select('id').eq('phone', phone).maybeSingle();
      if (!profile) return fail('This phone number is not registered.');

      const generated = generateOtp();
      // Forgot password template (GUERAR).
      const result = await sendOtpSms(phone, generated, 'GUERAR', turnstileToken);
      if (!result.ok) return fail(result.error ?? 'Could not send OTP. Please try again.');

      const previous = readOtpRate(phone);
      const nextCooldown = previous?.currentCooldown ? previous.currentCooldown * 2 : 60;
      localStorage.setItem(
        OTP_RATE_PREFIX + phone,
        JSON.stringify({ attempts: (previous?.attempts ?? 0) + 1, lastRequestedAt: Date.now(), currentCooldown: nextCooldown }),
      );
      setSentOtp(generated);
      setCooldown(nextCooldown);
      setStatus('OTP sent to your phone.');
      toast('OTP sent successfully', 'success');
    } catch {
      fail('Could not send OTP. Please check your connection.');
    } finally { setLoading(false); }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setStatus('');
    if (!/^\d{10}$/.test(phone)) return fail('Enter a 10-digit phone number.');
    if (password.length < 6) return fail('Password must be at least 6 characters.');
    if (!sentOtp) return fail('Please send the OTP first.');
    if (otp !== sentOtp) return fail('Invalid OTP code.');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles').update({ password }).eq('phone', phone);
      if (error) return fail('Could not reset the password. Please try again.');

      localStorage.removeItem(OTP_RATE_PREFIX + phone);
      setSentOtp('');
      setOtp('');
      setPassword('');
      toast('Password reset successful', 'success');
      setStatus('Password reset successful. Please sign in with your new password.');
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      navigate('/login', { replace: true });
    } catch {
      fail('Could not reset the password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className="hk-auth hk-auth-form-page">
      <header className="hk-auth-header">
        <Link className="hk-auth-back" to="/login" aria-label="Back to Sign In">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h19" /></svg>
        </Link>
        <h1>Reset Password</h1>
        <span />
      </header>
      <form className="hk-auth-form" onSubmit={submit} noValidate>
        <div className="hk-fields">
          <div>
          <div className={`hk-input-shell hk-phone-shell${isInvalid(phone, phoneRules(phone)) ? ' cp-invalid' : ''}`}>
            <svg className="hk-field-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.4v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.6 5.2 2 2 0 0 1 4.6 3h3l2 5-2.2 2.2a15 15 0 0 0 6.4 6.4L16 14.4z" /></svg>
            <span className="hk-prefix">+91</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="Phone" required />
          </div>
          <AuthHints value={phone} rules={phoneRules(phone)} />
          </div>
          <div>
          <div className={`hk-input-shell${isInvalid(password, passwordRules(password)) ? ' cp-invalid' : ''}`}>
            <svg className="hk-field-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="12" rx="1" /><path d="M7 10V6a5 5 0 0 1 10 0v4M12 15v3" /></svg>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="New Password" minLength={6} required />
          </div>
          <AuthHints value={password} rules={passwordRules(password)} />
          </div>
          <div className="hk-input-shell hk-otp-shell">
            <svg className="hk-field-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4.5h20v15H2zM2 5l10 7L22 5" /></svg>
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="OTP Code" required />
            <button className={`hk-send${/^\d{10}$/.test(phone) && cooldown <= 0 ? ' cp-ready' : ''}`} type="button" onClick={requestOtp} disabled={loading || cooldown > 0}>
              {cooldown > 0 ? `${cooldown}s` : 'Send'}
            </button>
          </div>
        </div>
        <button className="hk-primary" type="submit" disabled={loading}>
          Reset Password
        </button>
      </form>
      <SecurityVerify open={verifyOpen} onClose={() => setVerifyOpen(false)} onVerified={(token) => { setVerifyOpen(false); void sendOtp(token); }} />
      {loading && <AppLoading />}
    </main>
  );
}
