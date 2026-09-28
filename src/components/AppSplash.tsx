import { useEffect, useState } from 'react';

import { APP_LOGO, APP_LOGO_FALLBACK } from '@/lib/brand';
import { preloadAppShell } from '@/lib/preload';
import CachedImage from '@/components/CachedImage';
const WAVE_IMG_URL = '/ui/loading-wave.png';

/* Copied from the supplied Skypay loading screen: splash spinner -> ripple onboarding reveal. */
const CSS = `
.hkl { --white:#ffffff; --ink:#5d6467; --mint:#53aa8e; --blue:#689afa; --yellow:#edce68;
  --unit: min(0.266666667vw, 0.125svh); --ripple-radius: 150vmax; --reveal-duration: 920ms;
  --hkl-bg: radial-gradient(ellipse at 19% 10%, #d9eeec 0%, transparent 46%), radial-gradient(ellipse at 92% 20%, #e0e9f8 0%, transparent 52%), radial-gradient(ellipse at 72% 85%, #f6efdc 0%, transparent 43%), linear-gradient(155deg, #e6f7fa 0%, #f6f8fa 51%, #fdfbf0 100%);
  position:fixed; inset:0; z-index:100; isolation:isolate; width:100%; height:100svh; overflow:hidden; background:var(--white); font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; }
.hkl *, .hkl *::before, .hkl *::after { box-sizing:border-box; }
.hkl img { display:block; max-width:100%; object-fit:contain; user-select:none; -webkit-user-drag:none; }
.hkl .splash, .hkl .onboarding { position:absolute; inset:0; display:grid; place-items:center; }
.hkl .splash { z-index:2; pointer-events:none; }
.hkl .splash[hidden] { display:none; }
.hkl .splash-content { display:flex; flex-direction:column; align-items:center; gap:calc(9 * var(--unit)); transition:opacity 260ms ease, transform 320ms ease; transform:translateY(-36vh); }
.hkl .splash-orbit { position:relative; display:grid; place-items:center; width:calc(56 * var(--unit)); aspect-ratio:1; }
.hkl .spinner { position:absolute; inset:0; border:max(1px, calc(0.75 * var(--unit))) solid #e9ebec; border-top-color:#adb5b8; border-right-color:#adb5b8; border-bottom-color:transparent; border-radius:50%; animation:hkl-spin 1050ms linear infinite; }
.hkl .splash-logo { width:calc(45 * var(--unit)); height:calc(45 * var(--unit)); border-radius:calc(11 * var(--unit)); }
.hkl .splash-title { margin:0; color:var(--ink); font-size:clamp(14px, calc(15 * var(--unit)), 30px); font-weight:400; line-height:1.3; letter-spacing:-0.025em; }
.hkl .onboarding { z-index:1; overflow:hidden; background:var(--hkl-bg); clip-path:circle(0px at 50% 50%); transition:clip-path var(--reveal-duration) cubic-bezier(0.22, 0.68, 0.2, 1) 80ms; }
.hkl .corner-wave { position:absolute; top:8.1%; right:calc(-2 * var(--unit)); width:calc(116 * var(--unit)); height:calc(313 * var(--unit)); overflow:hidden; opacity:0; pointer-events:none; }
.hkl .corner-wave img { position:absolute; top:calc(-36 * var(--unit)); right:calc(-102 * var(--unit)); width:calc(375 * var(--unit)); height:calc(375 * var(--unit)); max-width:none; }
.hkl .decorations { position:absolute; inset:0; opacity:0; pointer-events:none; }
.hkl .decoration { position:absolute; left:var(--x); top:var(--y); width:calc(var(--size) * var(--unit)); height:calc(var(--size) * var(--unit)); border-radius:50%; background:var(--color); opacity:var(--opacity, 0.75); animation:hkl-dot-drop var(--duration, 6s) ease-in-out var(--delay, 0s) infinite; animation-play-state:paused; }
.hkl .decoration.line { height:calc(2.8 * var(--unit)); border-radius:999px; }
.hkl .decoration.line { animation-name:hkl-line-sway; }
.hkl .decoration.dashed { height:calc(1.5 * var(--unit)); border-radius:0; background:repeating-linear-gradient(90deg, var(--color) 0 calc(4 * var(--unit)), transparent calc(4 * var(--unit)) calc(7 * var(--unit))); }
.hkl .card-entrance { position:relative; display:grid; place-items:center; margin-top:calc(-8 * var(--unit)); opacity:0; }
.hkl .card-float { animation:hkl-card-float 6.5s ease-in-out 1400ms infinite; animation-play-state:paused; }
.hkl .feature-card { position:relative; display:grid; place-items:center; width:calc(315 * var(--unit)); height:calc(210 * var(--unit)); border:1px solid rgb(255 255 255 / 90%); border-radius:calc(20 * var(--unit)); background:rgb(255 255 255 / 75%); box-shadow:0 calc(24 * var(--unit)) calc(44 * var(--unit)) calc(-9 * var(--unit)) rgb(37 50 60 / 17%), 0 calc(2 * var(--unit)) calc(4 * var(--unit)) rgb(37 50 60 / 3%); transform:rotate(-15deg); }
.hkl .card-texture, .hkl .card-fold { position:absolute; inset:0; overflow:hidden; border-radius:inherit; pointer-events:none; }
.hkl .card-texture { background-image:radial-gradient(#84aeb9 0.6px, transparent 0.8px); background-size:calc(7 * var(--unit)) calc(7 * var(--unit)); opacity:0.1; mask-image:linear-gradient(135deg, #000, transparent 62%); }
.hkl .card-fold::before, .hkl .card-fold::after { position:absolute; inset:0; content:""; }
.hkl .card-fold::before { background:#f8efd0; opacity:0.88; clip-path:polygon(74% 0, 100% 0, 100% 35%); }
.hkl .card-fold::after { background:#eaf2fc; opacity:0.47; clip-path:polygon(91% 0, 100% 0, 100% 50%); }
.hkl .logo-tile { position:relative; z-index:1; display:grid; place-items:center; width:calc(115 * var(--unit)); height:calc(115 * var(--unit)); padding:0; border:0; border-radius:calc(24 * var(--unit)); background:transparent; box-shadow:0 calc(12 * var(--unit)) calc(25 * var(--unit)) rgb(31 41 54 / 20%); transform:rotate(15deg); }
.hkl .logo-tile img { width:100%; height:100%; border-radius:calc(24 * var(--unit)); object-fit:cover; }
.hkl:not([data-phase="splash"]) .splash-content { opacity:0; transform:translateY(calc(-28vh - 5 * var(--unit))) scale(0.97); }
.hkl:not([data-phase="splash"]) .onboarding { clip-path:circle(var(--ripple-radius) at 50% 50%); }
.hkl:not([data-phase="splash"]) .corner-wave { animation:hkl-wave-enter 900ms cubic-bezier(0.2, 0.7, 0.2, 1) 100ms both; }
.hkl:not([data-phase="splash"]) .decorations { animation:hkl-fade-in 500ms ease 100ms both; }
.hkl:not([data-phase="splash"]) .card-entrance { animation:hkl-card-enter 850ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both; }
.hkl:not([data-phase="splash"]) .card-float, .hkl:not([data-phase="splash"]) .decoration { animation-play-state:running; }
.hkl[data-phase="ready"] .onboarding { clip-path:none; transition:none; }
.hkl[data-phase="ready"] .spinner { animation:none; }
@keyframes hkl-spin { to { transform:rotate(360deg); } }
@keyframes hkl-fade-in { from { opacity:0; } to { opacity:1; } }
@keyframes hkl-wave-enter { from { opacity:0; transform:translateX(calc(20 * var(--unit))); } to { opacity:1; transform:translateX(0); } }
@keyframes hkl-card-enter { 0% { opacity:0; transform:translateY(calc(24 * var(--unit))) scale(0.78); } 65% { opacity:1; transform:translateY(calc(-3 * var(--unit))) scale(1.018); } 100% { opacity:1; transform:translateY(0) scale(1); } }
@keyframes hkl-card-float { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(calc(-5 * var(--unit))); } }
@keyframes hkl-dot-drop { 0%, 100% { opacity:.35; transform:translateY(calc(-4 * var(--unit))) scale(.82); } 50% { opacity:var(--opacity, .75); transform:translateY(calc(4 * var(--unit))) scale(1); } }
@keyframes hkl-line-sway { 0%, 100% { transform:translateX(calc(-3 * var(--unit))); } 50% { transform:translateX(calc(4 * var(--unit))); } }
@media (prefers-reduced-motion: reduce) {
  .hkl *, .hkl *::before, .hkl *::after { animation:none !important; }
  .hkl .splash-content { transition:opacity 160ms linear; transform:translateY(-36vh) !important; }
  .hkl .onboarding { clip-path:none !important; }
  .hkl:not([data-phase="splash"]) .onboarding, .hkl:not([data-phase="splash"]) .card-entrance, .hkl:not([data-phase="splash"]) .corner-wave, .hkl:not([data-phase="splash"]) .decorations { opacity:1; }
}
`;

const DECORATIONS: Array<{ cls?: string; style: Record<string, string> }> = [
  { style: { '--x': '28.3%', '--y': '43.6%', '--size': '18', '--color': 'var(--mint)', '--duration': '6.8s', '--delay': '-1s' } },
  { style: { '--x': '70.2%', '--y': '45.3%', '--size': '11', '--color': 'var(--blue)', '--duration': '5.6s', '--delay': '-2.8s' } },
  { style: { '--x': '78.1%', '--y': '55.1%', '--size': '14', '--color': 'var(--mint)', '--duration': '7.2s', '--delay': '-3.5s' } },
  { style: { '--x': '32.2%', '--y': '58.7%', '--size': '9', '--color': 'var(--yellow)', '--duration': '5.8s', '--delay': '-1.7s' } },
  { cls: 'line', style: { '--x': '19.5%', '--y': '63.1%', '--size': '43', '--color': 'var(--mint)', '--duration': '6.2s', '--delay': '-2.2s' } },
  { cls: 'line', style: { '--x': '23.6%', '--y': '67%', '--size': '29', '--color': 'var(--mint)', '--duration': '7s', '--delay': '-0.7s' } },
  { cls: 'line', style: { '--x': '27.4%', '--y': '70.9%', '--size': '20', '--color': 'var(--mint)', '--opacity': '0.62', '--duration': '6.5s', '--delay': '-3.2s' } },
  { cls: 'dashed', style: { '--x': '19%', '--y': '35.8%', '--size': '18', '--color': 'var(--blue)', '--opacity': '0.16', '--duration': '8s', '--delay': '-4s' } },
  { style: { '--x': '60.5%', '--y': '30.7%', '--size': '3', '--color': 'var(--yellow)', '--opacity': '0.35', '--duration': '7s', '--delay': '-2s' } },
];

/** Brief branded intro on a cold launch; app data continues loading in parallel. */
const SPLASH_DURATION = 1000;
const REVEAL_DURATION = 2500;
/** Total time of the full intro (spinner splash + onboarding reveal). */
export const SPLASH_TOTAL_DURATION = SPLASH_DURATION + REVEAL_DURATION;

export default function AppSplash({ onFinish }: { onFinish?: () => void }) {
  const [phase, setPhase] = useState<'splash' | 'revealing' | 'ready'>('splash');

  useEffect(() => {
    let alive = true;
    const t1 = window.setTimeout(() => setPhase('revealing'), SPLASH_DURATION);
    const t2 = window.setTimeout(() => setPhase('ready'), SPLASH_DURATION + REVEAL_DURATION);

    // Warm the two main screens and their artwork while the intro is visible.
    // Slow downloads never hold the splash open beyond the fixed duration.
    void preloadAppShell().catch(() => undefined);
    const finishTimer = window.setTimeout(() => {
      if (alive && onFinish) onFinish();
    }, SPLASH_TOTAL_DURATION);

    return () => {
      alive = false;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <main className="hkl" data-phase={phase} aria-label="Loading Skypay" aria-busy={phase !== 'ready'}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section className="splash" hidden={phase === 'ready'} aria-label="Loading Skypay">
        <div className="splash-content">
          <div className="splash-orbit">
            <span className="spinner" aria-hidden="true" />
            <img className="splash-logo" src={APP_LOGO_FALLBACK} alt="" draggable={false} fetchPriority="high" />
          </div>
          <h1 className="splash-title">Skypay</h1>
        </div>
      </section>

      <section className="onboarding" aria-label="Welcome to Skypay">
        <div className="corner-wave" aria-hidden="true">
          <img src={WAVE_IMG_URL} alt="" draggable={false} />
        </div>
        <div className="decorations" aria-hidden="true">
          {DECORATIONS.map((d, i) => (
            <span
              key={i}
              className={`decoration${d.cls ? ` ${d.cls}` : ''}`}
              style={d.style as React.CSSProperties}
            />
          ))}
        </div>
        <div className="card-entrance">
          <div className="card-float">
            <div className="feature-card">
              <div className="card-texture" aria-hidden="true" />
              <div className="card-fold" aria-hidden="true" />
              <div className="logo-tile">
                <CachedImage src={APP_LOGO} fallbackSrc={APP_LOGO_FALLBACK} cacheKey="app-logo-v2" alt="Skypay" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
