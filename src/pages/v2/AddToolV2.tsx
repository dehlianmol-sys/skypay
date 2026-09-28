import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';
import {
  TEACHING_VIDEO_URL,
  UNAVAILABLE_LABEL,
  WALLET_TOOLS,
  buildUpiOptions,
  tabTypeFor,
  type ToolCategory,
  type WalletTool,
} from '@/lib/walletTools';
import { css as addCss } from './css/AddToolRef';
import { css as setupCss } from './css/ToolSetupRef';
import { css as stepsCss } from './css/WalletStepsRef';
import PinOverlay from '@/components/v2/PinOverlay';
import GuidedInstallModal from '@/components/v2/GuidedInstallModal';
import { useWalletPin } from '@/lib/pin';
import { getAppInstall, markDownloaded, markInstalled } from '@/lib/appInstalls';
import { useBanners } from '@/lib/v2data';
import { openInExternalChrome, openExternalUrl } from '@/lib/nativeBridge';
import AppLoading from '@/components/AppLoading';

type Phase = 'gate' | 'empty' | 'loading' | 'choose' | 'setup' | 'phone' | 'upi';

/**
 * New-user Add Wallet / Add Tool flow, built from the supplied designs:
 * empty Tool screen -> choose payment -> app setup guide -> phone -> UPI handle
 * -> saved wallet overlay with the enable / disable switch.
 */
export default function AddToolV2({ onDone, startAtChoose = false }: { onDone?: () => void; startAtChoose?: boolean }) {
  const { currentUser, linkWalletTool, toggleSelling } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const { pin: walletPin, loading: pinLoading } = useWalletPin(currentUser?.id);
  const { tutorial: tutorialSlides, submitTutorial: submitTutorialSlides } = useBanners();
  const [pinGate, setPinGate] = useState(false);
  const afterPin = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<Phase>(startAtChoose ? 'gate' : 'empty');
  const [category, setCategory] = useState<ToolCategory>('personal');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [tool, setTool] = useState<WalletTool | null>(null);

  const [download, setDownload] = useState<'idle' | 'running' | 'done'>('idle');
  const [installed, setInstalled] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(3);
  const [tutorialMode, setTutorialMode] = useState<'install' | 'submit' | null>(null);

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [upiOptions, setUpiOptions] = useState<string[]>([]);
  const [chosenUpi, setChosenUpi] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (download !== 'running') return;
    setRedirectSeconds(3);
    const interval = window.setInterval(() => {
      setRedirectSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [download]);

  // Teen second ka countdown khatam hote hi tutorial khud khul jata hai —
  // user ko "Open Chrome Browser" dabane ki zarurat nahi.
  useEffect(() => {
    if (download !== 'running' || redirectSeconds > 0 || tutorialMode) return;
    setTutorialMode('install');
  }, [download, redirectSeconds, tutorialMode]);

  useEffect(() => {
    const isAdding = phase !== 'gate' && phase !== 'empty' && phase !== 'loading';
    document.body.classList.toggle('wallet-add-flow-active', isAdding);
    return () => document.body.classList.remove('wallet-add-flow-active');
  }, [phase]);

  // Existing users tapping "Add" land here: verify the PIN before the destination opens.
  useEffect(() => {
    if (phase !== 'gate' || pinLoading || pinGate) return;
    if (!walletPin) {
      toast('Set your 6-digit PIN first to continue.', 'info');
      navigate('/pin');
      return;
    }
    afterPin.current = () => setPhase('choose');
    setPinGate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pinLoading, walletPin]);

  /** PIN gate runs at the entry point, before the Add Wallet / Add Tool destination opens. */
  const requirePin = (next: () => void) => {
    if (pinLoading) return;
    if (!walletPin) {
      toast('Set your 6-digit PIN first to continue.', 'info');
      navigate('/pin');
      return;
    }
    afterPin.current = next;
    setPinGate(true);
  };

  const startAdd = () => {
    requirePin(() => {
      setPhase('loading');
      setTimeout(() => setPhase('choose'), 900);
    });
  };

  const openSetup = (picked: WalletTool) => {
    setDownload('idle');
    setRedirectSeconds(3);
    setTutorialMode(null);
    setInstalled(false);
    setPhase('setup');
    // Apps with no APK (IndusPay) are never download-gated.
    if (!picked.apkUrl || !currentUser?.id) {
      setInstalled(!picked.apkUrl);
      return;
    }
    void getAppInstall(currentUser.id, picked.id).then((row) => {
      if (row?.installedAt) {
        setInstalled(true);
        setDownload('done');
      }
    });
  };

  const confirmChoice = () => {
    const picked = WALLET_TOOLS.find((t) => t.id === selectedId && t.category === category);
    if (!picked) {
      setShowError(true);
      return;
    }
    if (!picked.available) {
      toast(UNAVAILABLE_LABEL, 'info');
      return;
    }
    setShowError(false);
    setTool(picked);
    openSetup(picked);
  };

  const startDownload = () => {
    if (!tool) return;
    if (download === 'running') return;
    if (!tool.apkUrl) {
      toast(`${tool.name} APK will be available soon.`, 'info');
      return;
    }
    setDownload('running');
    setRedirectSeconds(3);
  };

  const openInstallTutorial = () => {
    if (redirectSeconds > 0) return;
    setTutorialMode('install');
  };

  // Confirm hands the MediaFire URL to Android Chrome explicitly. A normal
  // _blank link stays inside many WebView wrappers as an internal tab.
  const confirmChromeDownload = () => {
    if (!tool?.apkUrl) return;
    setTutorialMode(null);
    setDownload('done');
    setInstalled(true);
    if (currentUser?.id) {
      void markDownloaded(currentUser.id, tool.id).catch(() => undefined);
      void markInstalled(currentUser.id, tool.id).catch(() => undefined);
    }

    try {
      const opened = openInExternalChrome(tool.apkUrl);
      if (!opened) throw new Error('Chrome redirect could not be created.');
    } catch {
      toast(`Could not open Chrome for ${tool.name}. Please try again.`, 'error');
    }
  };


  const openTeaching = () => {
    if (!TEACHING_VIDEO_URL) {
      toast('Teaching video will be added soon.', 'info');
      return;
    }
    openExternalUrl(TEACHING_VIDEO_URL);
  };

  const submitSetup = () => {
    // Per-app lock: this app's APK must be downloaded and installed first.
    if (tool?.apkUrl && !installed) {
      toast(`Please download the ${tool.name} app and login with your phone number.`, 'info');
      return;
    }
    setTutorialMode('submit');
  };

  const continueToPhone = () => {
    setTutorialMode(null);
    setPhone('');
    setPhoneError(null);
    setPhase('phone');
  };

  const submitPhone = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Please enter your 10-digit mobile number.');
      return;
    }
    setPhoneError(null);
    const options = tool ? buildUpiOptions(tool, digits) : [];
    setUpiOptions(options);
    setChosenUpi(options[0] ?? null);
    setPhase('upi');
  };

  const saveUpi = async () => {
    if (!tool || !chosenUpi || saving) return;
    setSaving(true);
    try {
      const digits = phone.replace(/\D/g, '');
      await linkWalletTool({
        partnerId: tool.id,
        partnerName: tool.name,
        maskedPhone: `${digits.slice(0, 3)}****${digits.slice(7)}`,
        upiId: chosenUpi,
        tabType: tabTypeFor(tool.id),
        isSelling: true,
      });
      toast(`Selected ${chosenUpi}`, 'success');
      onDone?.();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not link this wallet', 'error');
    } finally {
      setSaving(false);
    }
  };

  const list = WALLET_TOOLS.filter((t) => t.category === category);
  const onSteps = phase === 'phone' || phase === 'upi';
  const scopeClass = phase === 'setup' ? 'tool-setup-scope' : onSteps ? 'wallet-steps-scope' : 'tool-add-scope';
  const activeCss = phase === 'setup' ? setupCss : onSteps ? stepsCss : addCss;
  const digitsOnly = phone.replace(/\D/g, '');
  const maskedPhone = digitsOnly.length === 10 ? `${digitsOnly.slice(0, 4)}****${digitsOnly.slice(8)}` : digitsOnly;

  return (
    <div className={scopeClass}>
      <style dangerouslySetInnerHTML={{ __html: activeCss }} />

      {pinGate && (
        <PinOverlay
          open
          onVerify={(entered) => Boolean(walletPin) && entered === walletPin}
          onSuccess={() => {
            setPinGate(false);
            const next = afterPin.current;
            afterPin.current = null;
            next?.();
          }}
          onCancel={() => {
            setPinGate(false);
            afterPin.current = null;
            if (phase === 'gate') onDone?.();
          }}
        />
      )}

      <GuidedInstallModal
        open={tutorialMode !== null}
        appName={tool?.name ?? 'Wallet app'}
        slides={tutorialMode === 'submit' ? submitTutorialSlides : tutorialSlides}
        title={tutorialMode === 'submit' ? 'Submit Tutorial' : 'Open Chrome Browser'}
        emptyTitle={tutorialMode === 'submit' ? 'Continue wallet setup' : undefined}
        emptyText={tutorialMode === 'submit' ? 'Confirm to enter your wallet phone number.' : undefined}
        confirmLabel={tutorialMode === 'submit' ? 'Confirm & Continue' : undefined}
        onClose={() => setTutorialMode(null)}
        onConfirm={tutorialMode === 'submit' ? continueToPhone : confirmChromeDownload}
      />


      {(phase === 'empty' || phase === 'loading') && (
        <section className="screen">
          <header style={{ padding: '18px 0 6px', background: '#FFFFFF' }}>
            <h1 className="main-title">Tool</h1>
          </header>
          <div className="empty-content">
            <p className="empty-message">No wallets yet</p>
            <button className="primary-button add-button" type="button" onClick={startAdd}>Add</button>
          </div>
          {phase === 'loading' && <AppLoading />}
        </section>
      )}

      {phase === 'choose' && (
        <section className="screen" style={{ display: 'block' }}>
          <header className="payment-header" style={{ height: 64, paddingTop: 16 }}>
            <button className="back-button" type="button" aria-label="Back to wallet" onClick={() => setPhase('empty')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
            </button>
            <h1 className="main-title">Add Tool</h1>
          </header>
          <div className="selection-content">
            <h2 className="selection-title">Choose your payment</h2>
            <div className="segmented-control" role="tablist" aria-label="Payment account type">
              {(['personal', 'business'] as ToolCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={category === c}
                  className={`tab${category === c ? ' active' : ''}`}
                  onClick={() => { setCategory(c); setSelectedId(null); setShowError(false); }}
                >
                  {c === 'personal' ? 'Personal' : 'Business'}
                </button>
              ))}
            </div>
            <div id="payment-list" role="radiogroup" aria-label="Choose your payment">
              {list.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedId === m.id}
                  aria-disabled={!m.available}
                  className={`payment-item${selectedId === m.id ? ' active' : ''}`}
                  style={m.available ? undefined : { opacity: 0.55 }}
                  onClick={() => {
                    if (!m.available) { toast(UNAVAILABLE_LABEL, 'info'); return; }
                    setSelectedId(m.id);
                    setShowError(false);
                  }}
                >
                  {m.logoUrl ? <img className="payment-logo" src={m.logoUrl} alt="" width={40} height={40} /> : <span className="payment-logo" />}
                  <span className="payment-details">
                    <span className="payment-heading">
                      <span className="payment-name">{m.name}</span>
                      {m.bonus && <span className="bonus-badge">{m.bonus}</span>}
                    </span>
                    <span className="payment-bottom">
                      {m.available ? (
                        <>
                          {typeof m.min === 'number' && typeof m.max === 'number' && (
                            <span className="payment-limit">{`Payin ${m.min.toFixed(2)} - ${m.max.toFixed(2)}`}</span>
                          )}
                          {m.payout && <span className="payment-payout">Payout</span>}
                        </>
                      ) : (
                        <span className="payment-limit" style={{ color: '#9CA3AF' }}>{UNAVAILABLE_LABEL}</span>
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <footer className="confirm-footer">
            <p className="selection-error" style={{ display: showError ? 'block' : 'none' }} role="alert">
              Please choose a payment method.
            </p>
            <button className="primary-button sure-button" type="button" onClick={confirmChoice}>Sure</button>
          </footer>
        </section>
      )}

      {phase === 'setup' && tool && (
        <div className="app" style={{ minHeight: 'auto', background: 'transparent' }}>
          <header className="header">
            <button className="back-button" type="button" aria-label="Go back" onClick={() => setPhase('choose')}>←</button>
              <h1>{tool.name}</h1>
          </header>
          <main>
            <section className="info-card">
              <span className="app-icon" aria-hidden="true">{tool.name.charAt(0)}</span>
              <div className="info-copy">
                <h2>{tool.name} Setup Guide</h2>
                <p className="setup-mode">Mode: {tool.name}</p>
                <p>Please complete all steps before submitting</p>
              </div>
            </section>

            <section className="steps-card" aria-label="Setup steps">
              <ol className="steps-list">
                <li className="step">Uninstall your old {tool.name}</li>
                <li className="step">Close googleplay protect</li>
                <li className="step">
                  {download !== 'running' && (
                    <div>
                      <button
                        type="button"
                        className="download-text-link"
                        onClick={startDownload}
                      >
                        {download === 'done' ? 'Re-download' : 'Download'}
                      </button>
                      <span> New {tool.name} in Skypay</span>
                    </div>
                  )}
                  {download !== 'idle' && (
                    <section className={`download-panel is-open`} aria-label="Download progress">
                      <div className="download-panel-inner">
                        <div className="download-heading">
                          <span className={`download-percentage${download === 'done' ? ' is-complete' : ''}`}>
                            {download === 'done' ? 'Opened in Chrome browser.' : 'Automatic redirect — open Chrome browser'}
                          </span>
                          <span className="download-product">New {tool.name} in Skypay</span>
                        </div>
                        <div className="progress-box">
                          <div className="status-row">
                            <span className="status-label">Status</span>
                            <span className="status-value" role="status" aria-live="polite">
                              {download === 'done' ? 'Redirected' : redirectSeconds > 0 ? `Redirecting in ${redirectSeconds} seconds` : 'Ready to open Chrome'}
                            </span>
                          </div>
                          {download === 'running' && tool.apkUrl && (
                            <button
                              className="install-button"
                              type="button"
                              disabled={redirectSeconds > 0}
                              onClick={openInstallTutorial}
                              style={
                                redirectSeconds === 0
                                  ? { animation: 'pulse 1.4s ease-in-out infinite', boxShadow: '0 0 0 4px rgba(15,138,95,.18)' }
                                  : undefined
                              }
                            >
                              {redirectSeconds > 0 ? `Open Chrome Browser (${redirectSeconds}s)` : 'Open Chrome Browser'}
                            </button>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </li>
                <li className="step">Login {tool.name} account</li>
                <li className="step">
                  Bind {tool.name} in Skypay<br />
                  <button type="button" className="text-link teaching-link" onClick={openTeaching} style={{ border: 0, background: 'transparent', padding: 0 }}>
                    teaching video
                  </button>
                </li>
                <li className="step">do a task</li>
              </ol>
            </section>

            <aside className="notice-card">
              <h2>Notice</h2>
              <p>
                {tool.apkUrl && !installed
                  ? `First download ${tool.name} and install it, then Submit will open.`
                  : 'After completing the above steps, tap Submit to continue.'}
              </p>
            </aside>
          </main>
          <footer className="bottom-bar">
            <button
              className="submit-button"
              type="button"
              aria-disabled={Boolean(tool.apkUrl) && !installed}
              style={tool.apkUrl && !installed ? { opacity: 0.55 } : undefined}
              onClick={submitSetup}
            >
              Submit
            </button>
          </footer>
        </div>
      )}

      {phase === 'phone' && tool && (
        <div className="wallet-app phone-page">
          <header className="page-header">
            <div className="header-content">
              <button className="back-link" type="button" aria-label="Back" onClick={() => setPhase('setup')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" /></svg>
              </button>
              <h1 className="page-title">Wallet</h1>
            </div>
          </header>

          <main className="page-content">
            <nav className="progress" aria-label="Wallet setup progress">
              <ol className="steps">
                <li className="step" aria-current="step"><span className="step-circle" aria-hidden="true">1</span><span className="step-label">Phone</span></li>
                <li className="step"><span className="step-circle" aria-hidden="true">2</span><span className="step-label">Authorize</span></li>
                <li className="step"><span className="step-circle" aria-hidden="true">3</span><span className="step-label">Finish</span></li>
              </ol>
            </nav>

            <form onSubmit={(e) => { e.preventDefault(); submitPhone(); }} noValidate>
              <section className="wallet-card">
                <header className="card-heading">
                  <h2 className="card-title">Submit {tool.name} Phone Number</h2>
                </header>
                <div className="card-body">
                  <h3 className="intro-title">Enter the phone number you use to log in to {tool.name}</h3>
                  <ol className="description-steps">
                    <li>Please enter the phone number.</li>
                    <li>You just used to log in for verification.</li>
                    <li>If you enter the wrong number, verification will fail.</li>
                  </ol>
                  <div className="phone-field">
                    <label className="phone-label" htmlFor="phone">Your Phone</label>
                    <div className={`phone-input${phoneError ? ' invalid' : ''}`}>
                      <span className="country-code" aria-hidden="true">+91</span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError(null); }}
                      />
                    </div>
                    {phoneError && <p className="field-error" role="alert">{phoneError}</p>}
                  </div>
                </div>
              </section>
              <button className="submit-button" type="submit">Submit</button>
            </form>
          </main>
        </div>
      )}

      {phase === 'upi' && tool && (
        <div className="wallet-app">
          <header className="page-header">
            <div className="header-content">
              <button className="back-link" type="button" aria-label="Back" onClick={() => setPhase('phone')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7" /></svg>
              </button>
              <h1 className="page-title">Wallet</h1>
            </div>
          </header>

          <main className="page-content">
            <nav className="progress" aria-label="Wallet setup progress">
              <ol className="steps">
                <li className="step"><span className="step-circle" aria-hidden="true">1</span><span className="step-label">Phone</span></li>
                <li className="step"><span className="step-circle" aria-hidden="true">2</span><span className="step-label">Authorize</span></li>
                <li className="step" aria-current="step"><span className="step-circle" aria-hidden="true">3</span><span className="step-label">Finish</span></li>
              </ol>
            </nav>

            <section className="verification-card">
              <h2 className="v-card-heading">Verification Result</h2>
              <div className="v-card-body">
                <div className="wallet-details">
                  <div className="detail-row"><span>Wallet Name</span><span className="detail-value">{tool.name}</span></div>
                  <div className="detail-row"><span>Your Phone</span><span className="detail-value">{maskedPhone}</span></div>
                </div>

                <h3 className="upi-title">Select UPI</h3>
                <div className="upi-options" role="radiogroup" aria-label="Select UPI address">
                  {upiOptions.map((u) => (
                    <button
                      key={u}
                      className={`upi-option${chosenUpi === u ? ' is-selected' : ''}`}
                      type="button"
                      role="radio"
                      aria-checked={chosenUpi === u}
                      onClick={() => setChosenUpi(u)}
                    >
                      <span className="selection-control" aria-hidden="true">
                        <svg viewBox="0 0 32 32" fill="none"><path d="m7 16.5 6 6L25 10" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className="upi-option-label">{u}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <button className="finish-button" type="button" onClick={saveUpi} disabled={saving}>
              {saving ? 'Saving...' : 'Finish'}
            </button>
          </main>
        </div>
      )}

    </div>
  );
}
