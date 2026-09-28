import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router-compat';
import { phoneToAuthEmail, supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';
import AuthHints, { usernameRules, phoneRules, passwordRules, isInvalid } from '@/components/AuthHints';
import { normalizeRefCode, REF_CODE_KEY } from '@/lib/referral';
import { generateOtp, sendOtpSms } from '@/lib/otp';
import SecurityVerify from '@/components/SecurityVerify';
import AppLoading from '@/components/AppLoading';

const OTP_RATE_PREFIX = 'hk_otp_rate_';

interface OtpRateRecord { attempts: number; lastRequestedAt: number; currentCooldown: number }

function readOtpRate(phone: string): OtpRateRecord | null {
  try {
    const raw = localStorage.getItem(OTP_RATE_PREFIX + phone);
    return raw ? JSON.parse(raw) as OtpRateRecord : null;
  } catch { return null; }
}

function cooldownRemaining(phone: string): number {
  const record = readOtpRate(phone);
  if (!record) return 0;
  return Math.max(0, record.currentCooldown - Math.floor((Date.now() - record.lastRequestedAt) / 1000));
}

export default function Register({ referralCode }: { referralCode?: string } = {}) {
  const { register, clearLocalSession } = useStore();
  const navigate = useNavigate();
  const { search } = useLocation();
  const toast = useToast();
  const queryRef = new URLSearchParams(search).get('ref');
  const initialInvite = normalizeRefCode(referralCode ?? queryRef ?? '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [inviteCode, setInviteCode] = useState(initialInvite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cooldown > 0]);

  // A cooldown already running for this number survives reloads and page changes.
  useEffect(() => {
    if (!/^\d{10}$/.test(phone)) return;
    const remaining = cooldownRemaining(phone);
    if (remaining > 0) {
      setCooldown(remaining);
      if (!sentOtp) setOtpSent(true);
    }
  }, [phone]);

  const validateBase = () => {
    if (!/^[A-Za-z0-9_]{5,12}$/.test(username)) return 'User Name must be 5–12 letters, numbers, or underscores.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!/^\d{10}$/.test(phone)) return 'Enter a 10-digit phone number.';
    if (!normalizeRefCode(inviteCode)) return 'Please enter your invitation code.';
    return '';
  };

  const fail = (message: string) => {
    setError(message);
  };

  const [verifyOpen, setVerifyOpen] = useState(false);
  useEffect(() => { if (error) { toast(error, 'error'); setError(''); } }, [error]);
  const requestOtp = () => {
    if (loading || cooldown > 0) return;
    const invalid = validateBase();
    if (invalid) return fail(invalid);
    setVerifyOpen(true);
  };

  const sendOtp = async (turnstileToken?: string) => {
    if (loading || cooldown > 0) return;
    if (!turnstileToken) return fail('Please complete the security verification.');
    setError('');
    const invalid = validateBase();
    if (invalid) return fail(invalid);
    const remaining = cooldownRemaining(phone);
    if (remaining > 0) return setCooldown(remaining);
    setLoading(true);
    try {
      const { data: existing } = await supabase.from('profiles').select('id').eq('phone', phone).maybeSingle();
      if (existing) return fail('Phone number already registered.');
      const generated = generateOtp();
      // Registration template (FYDBZR) via this app's own /api/public/send-otp endpoint.
      const result = await sendOtpSms(phone, generated, 'FYDBZR', turnstileToken);
      if (!result.ok) {
        return fail(result.error ?? 'Could not send OTP. Please try again.');
      }
      // Each further request doubles the waiting time: 60s, 120s, 240s …
      const previous = readOtpRate(phone);
      const nextCooldown = previous?.currentCooldown ? previous.currentCooldown * 2 : 60;
      localStorage.setItem(OTP_RATE_PREFIX + phone, JSON.stringify({ attempts: (previous?.attempts ?? 0) + 1, lastRequestedAt: Date.now(), currentCooldown: nextCooldown }));
      setSentOtp(generated);
      setOtpSent(true);
      setCooldown(nextCooldown);
      toast('OTP sent successfully', 'success');
    } catch {
      fail('Could not send OTP. Please check your connection.');
    } finally { setLoading(false); }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    const invalid = validateBase();
    if (invalid) return setError(invalid);
    if (!sentOtp) return setError('Please send the OTP first.');
    if (otp !== sentOtp) return setError('Invalid OTP code.');
    setLoading(true);
    const invite = normalizeRefCode(inviteCode);
    try {
      const [{ data: agent }, { data: inviter }] = await Promise.all([
        supabase.from('agents').select('agent_id').eq('agent_id', invite).maybeSingle(),
        supabase.from('profiles').select('referral_code').eq('referral_code', invite).maybeSingle(),
      ]);
      if (!agent && !inviter) return setError('Please enter a valid invitation code.');
      let authUserId: string | null = null;
      const { data: authData } = await supabase.auth.signUp({
        email: phoneToAuthEmail(phone), password,
        options: { data: { username, phone, referral_code: invite } },
      });
      authUserId = authData.user?.id ?? null;
      const result = await register(username.trim(), phone, password, invite, authUserId);
      if (!result.ok) return setError(result.message);
      clearLocalSession();
      localStorage.removeItem(REF_CODE_KEY);
      localStorage.removeItem(OTP_RATE_PREFIX + phone);
      toast('Sign up successful', 'success');
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      navigate('/login', { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <main className="hk-auth hk-auth-form-page">
      <header className="hk-auth-header">
        <Link className="hk-auth-back" to="/login" aria-label="Back to Sign In"><svg viewBox="0 0 24 24"><path d="m10 5-7 7 7 7M3 12h19" /></svg></Link>
        <h1>Register</h1><span />
      </header>
      <form className="hk-auth-form" onSubmit={submit} noValidate>
        <div className="hk-fields">
          <AuthInput icon="user" value={username} onChange={setUsername} placeholder="User Name" maxLength={12} rules={usernameRules(username)} />
          <AuthInput icon="lock" value={password} onChange={setPassword} placeholder="Password" type="password" maxLength={72} rules={passwordRules(password)} />
          <AuthInput icon="phone" value={phone} onChange={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone" prefix="+91" maxLength={10} rules={phoneRules(phone)} />
          <div className="hk-input-shell hk-otp-shell">
            <FieldIcon type="otp" /><input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="OTP Code" maxLength={6} />
            <button className={`hk-send${/^\d{10}$/.test(phone) && cooldown <= 0 ? ' cp-ready' : ''}`} type="button" onClick={requestOtp} disabled={loading || cooldown > 0}>{cooldown > 0 ? `${cooldown}s` : 'Send'}</button>
          </div>
          <AuthInput icon="invite" value={inviteCode} onChange={(value) => setInviteCode(value.replace(/[^A-Za-z0-9]/g, '').slice(0, 20))} placeholder="Invite Code" maxLength={20} />
        </div>
        <button className="hk-primary" type="submit" disabled={loading}>Sign Up</button>
      </form>
      <SecurityVerify open={verifyOpen} onClose={() => setVerifyOpen(false)} onVerified={(token) => { setVerifyOpen(false); void sendOtp(token); }} />
      {loading && <AppLoading />}
    </main>
  );
}

function AuthInput({ icon, value, onChange, placeholder, type = 'text', prefix, maxLength, rules }: { rules?: { ok: boolean; text: string }[]; icon: 'user' | 'lock' | 'phone' | 'invite'; value: string; onChange: (value: string) => void; placeholder: string; type?: string; prefix?: string; maxLength: number }) {
  const bad = rules ? isInvalid(value, rules) : false;
  return <div><div className={`hk-input-shell${bad ? ' cp-invalid' : ''}`}><FieldIcon type={icon} />{prefix && <span className="hk-prefix">{prefix}</span>}<input value={value} onChange={(e) => onChange(e.target.value)} type={type} inputMode={icon === 'phone' ? 'numeric' : undefined} autoComplete={icon === 'user' ? 'username' : icon === 'lock' ? 'new-password' : icon === 'phone' ? 'tel-national' : 'off'} placeholder={placeholder} maxLength={maxLength} required /></div>{rules && <AuthHints value={value} rules={rules} />}</div>;
}

function FieldIcon({ type }: { type: 'user' | 'lock' | 'phone' | 'otp' | 'invite' }) {
  const paths = {
    user: <><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="8" r="2.5"/><path d="M5.3 18.5v-1A4.5 4.5 0 0 1 9.8 13h4.4a4.5 4.5 0 0 1 4.5 4.5v1"/></>,
    lock: <><rect x="4" y="10" width="16" height="12" rx="1"/><path d="M7 10V6a5 5 0 0 1 10 0v4M12 15v3"/></>,
    phone: <path d="M21 16.4v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.6 5.2 2 2 0 0 1 4.6 3h3l2 5-2.2 2.2a15 15 0 0 0 6.4 6.4L16 14.4z"/>,
    otp: <path d="M2 4.5h20v15H2zM2 5l10 7L22 5"/>,
    invite: <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>,
  };
  return <svg className="hk-field-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>;
}