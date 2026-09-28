import type { MouseEvent } from 'react';

import { APK_FILENAME, APK_URL, APP_LOGO, APP_LOGO_FALLBACK, APP_NAME } from '../lib/brand';
import CachedImage from '@/components/CachedImage';
import { downloadWithBestBridge } from '@/lib/nativeBridge';

/* Styles copied verbatim from the supplied Skypay landing page (uni-app rpx -> --rpx). */
const CSS = `
.lp-root { --rpx: calc(min(100vw, 450px) / 750); background:#1c43ae; display:flex; justify-content:center; min-height:100dvh; }
.lp { width:100%; max-width:450px; min-height:100dvh; background:#1c43ae; font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; overflow-x:hidden; }
.lp * { box-sizing:border-box; margin:0; padding:0; }
.lp img { display:block; }
.lp .topbar { height:calc(100 * var(--rpx)); padding:calc(18 * var(--rpx)) calc(26 * var(--rpx)) 0 calc(26 * var(--rpx)); display:flex; align-items:flex-start; justify-content:space-between; background:linear-gradient(180deg,#1a338c,rgba(26,51,140,0)); }
.lp .brand { display:flex; align-items:center; }
.lp .brand-logo { width:calc(56 * var(--rpx)); height:calc(56 * var(--rpx)); border-radius:calc(14 * var(--rpx)); object-fit:cover; }
.lp .brand-txt { margin-left:calc(12 * var(--rpx)); display:flex; flex-direction:column; }
.lp .brand-name { color:#eaf0ff; font-size:calc(28 * var(--rpx)); font-weight:700; line-height:calc(32 * var(--rpx)); }
.lp .brand-sub { color:#bcd0ff; font-size:calc(20 * var(--rpx)); margin-top:calc(2 * var(--rpx)); }
.lp .top-download { margin-top:calc(6 * var(--rpx)); background:linear-gradient(180deg,#ff922e,#f07700); padding:calc(18 * var(--rpx)) calc(36 * var(--rpx)); border-radius:calc(18 * var(--rpx)); box-shadow:0 calc(10 * var(--rpx)) calc(18 * var(--rpx)) rgba(0,0,0,.18); text-decoration:none; }
.lp .top-download-txt { color:#fff; font-weight:700; font-size:calc(26 * var(--rpx)); }
.lp .hero { padding:calc(18 * var(--rpx)) calc(26 * var(--rpx)) calc(10 * var(--rpx)) calc(26 * var(--rpx)); }
.lp .hero-title { margin-top:calc(8 * var(--rpx)); text-align:center; }
.lp .hero-title-line { display:block; color:#fff; font-size:calc(56 * var(--rpx)); font-weight:900; letter-spacing:calc(4 * var(--rpx)); text-shadow:0 calc(6 * var(--rpx)) 0 rgba(0,0,0,.16); line-height:calc(70 * var(--rpx)); }
.lp .hero-ill-wrap { margin-top:calc(18 * var(--rpx)); display:flex; justify-content:center; }
.lp .hero-ill { width:calc(560 * var(--rpx)); height:auto; }
.lp .btn-primary { margin:calc(26 * var(--rpx)) auto 0 auto; width:calc(520 * var(--rpx)); height:calc(86 * var(--rpx)); border-radius:calc(20 * var(--rpx)); background:linear-gradient(180deg,#ff922e,#f07700); display:flex; align-items:center; justify-content:center; box-shadow:0 calc(10 * var(--rpx)) calc(18 * var(--rpx)) rgba(0,0,0,.18); border:calc(4 * var(--rpx)) solid hsla(0,0%,100%,.18); text-decoration:none; }
.lp .btn-primary-txt { color:#fff; font-size:calc(32 * var(--rpx)); font-weight:800; }
.lp .panel { margin:calc(28 * var(--rpx)) calc(20 * var(--rpx)) 0 calc(20 * var(--rpx)); border-radius:calc(30 * var(--rpx)); background:rgba(15,40,120,.2); padding-bottom:calc(26 * var(--rpx)); }
.lp .panel-head { display:flex; justify-content:center; margin-top:calc(10 * var(--rpx)); }
.lp .panel-head-inner { width:calc(620 * var(--rpx)); height:calc(92 * var(--rpx)); border-radius:calc(26 * var(--rpx)); background:#244fb7; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 calc(4 * var(--rpx)) 0 hsla(0,0%,100%,.1); border:calc(2 * var(--rpx)) solid hsla(0,0%,100%,.1); }
.lp .panel-head-txt { color:#eaf0ff; font-size:calc(30 * var(--rpx)); font-weight:800; }
.lp .feature-card { margin:calc(16 * var(--rpx)) calc(24 * var(--rpx)) 0 calc(24 * var(--rpx)); background:rgba(231,240,255,.85); border-radius:calc(28 * var(--rpx)); padding:calc(26 * var(--rpx)) calc(18 * var(--rpx)); display:flex; justify-content:space-between; box-shadow:0 calc(16 * var(--rpx)) calc(22 * var(--rpx)) rgba(0,0,0,.15); }
.lp .feature-item { width:calc(206 * var(--rpx)); display:flex; flex-direction:column; align-items:center; }
.lp .feature-icon-wrap { width:calc(108 * var(--rpx)); height:calc(108 * var(--rpx)); border-radius:calc(22 * var(--rpx)); background:hsla(0,0%,100%,.92); box-shadow:0 calc(10 * var(--rpx)) calc(18 * var(--rpx)) rgba(0,0,0,.1); display:flex; align-items:center; justify-content:center; margin-bottom:calc(16 * var(--rpx)); }
.lp .feature-icon { width:calc(66 * var(--rpx)); height:calc(66 * var(--rpx)); object-fit:contain; }
.lp .feature-title { color:#0a2d86; font-size:calc(26 * var(--rpx)); font-weight:800; }
.lp .feature-sub { color:#0a2d86; font-size:calc(22 * var(--rpx)); margin-top:calc(6 * var(--rpx)); opacity:.88; }
.lp .mid-download { margin:calc(26 * var(--rpx)) auto 0 auto; width:calc(620 * var(--rpx)); height:calc(86 * var(--rpx)); border-radius:calc(20 * var(--rpx)); background:linear-gradient(180deg,#ff922e,#f07700); display:flex; align-items:center; justify-content:center; box-shadow:0 calc(10 * var(--rpx)) calc(18 * var(--rpx)) rgba(0,0,0,.18); border:calc(4 * var(--rpx)) solid hsla(0,0%,100%,.18); text-decoration:none; }
.lp .mid-download-txt { color:#fff; font-size:calc(32 * var(--rpx)); font-weight:800; }
.lp .section-card { margin:calc(26 * var(--rpx)) calc(20 * var(--rpx)) 0 calc(20 * var(--rpx)); border-radius:calc(30 * var(--rpx)); background:rgba(15,40,120,.2); padding:calc(18 * var(--rpx)); }
.lp .section-title-pill { width:calc(640 * var(--rpx)); height:calc(86 * var(--rpx)); margin:0 auto; border-radius:calc(26 * var(--rpx)); background:hsla(0,0%,100%,.92); display:flex; align-items:center; justify-content:center; box-shadow:0 calc(12 * var(--rpx)) calc(18 * var(--rpx)) rgba(0,0,0,.14); }
.lp .section-title { color:#10308a; font-size:calc(28 * var(--rpx)); font-weight:900; }
.lp .section-body { margin-top:calc(14 * var(--rpx)); padding:calc(22 * var(--rpx)) calc(22 * var(--rpx)) calc(18 * var(--rpx)) calc(22 * var(--rpx)); border-radius:calc(22 * var(--rpx)); background:rgba(7,60,150,.35); }
.lp .p-block { margin-bottom:calc(18 * var(--rpx)); }
.lp .p-title { display:block; color:#eaf0ff; font-size:calc(26 * var(--rpx)); font-weight:900; margin-bottom:calc(6 * var(--rpx)); }
.lp .p-text { display:block; color:#eaf0ff; font-size:calc(22 * var(--rpx)); opacity:.92; line-height:calc(32 * var(--rpx)); }
.lp .section-foot { margin-top:calc(16 * var(--rpx)); background:hsla(0,0%,100%,.92); border-radius:calc(18 * var(--rpx)); padding:calc(16 * var(--rpx)) calc(18 * var(--rpx)); text-align:center; }
.lp .section-foot-txt { color:#10308a; font-size:calc(24 * var(--rpx)); font-weight:800; line-height:calc(34 * var(--rpx)); }
.lp .level-row { margin-top:calc(16 * var(--rpx)); padding:calc(18 * var(--rpx)) calc(14 * var(--rpx)); border-radius:calc(22 * var(--rpx)); background:rgba(7,60,150,.35); display:flex; justify-content:space-between; }
.lp .level-item { width:calc(210 * var(--rpx)); border-radius:calc(22 * var(--rpx)); padding:calc(18 * var(--rpx)) calc(14 * var(--rpx)) calc(16 * var(--rpx)) calc(14 * var(--rpx)); display:flex; flex-direction:column; align-items:center; box-shadow:0 calc(14 * var(--rpx)) calc(20 * var(--rpx)) rgba(0,0,0,.18); border:calc(2 * var(--rpx)) solid hsla(0,0%,100%,.12); }
.lp .level-name { color:#fff; font-size:calc(26 * var(--rpx)); font-weight:900; margin-bottom:calc(14 * var(--rpx)); }
.lp .level-badge { width:calc(150 * var(--rpx)); height:calc(64 * var(--rpx)); border-radius:calc(32 * var(--rpx)); background:hsla(0,0%,100%,.92); display:flex; align-items:center; justify-content:center; box-shadow:inset 0 calc(4 * var(--rpx)) 0 rgba(0,0,0,.06); margin-bottom:calc(14 * var(--rpx)); }
.lp .level-rate { color:#10308a; font-size:calc(30 * var(--rpx)); font-weight:900; }
.lp .level-sub { color:hsla(0,0%,100%,.85); font-size:calc(20 * var(--rpx)); margin-top:calc(4 * var(--rpx)); }
.lp .level-a { background:linear-gradient(180deg,#6fa5ff,#4e77d6); }
.lp .level-b { background:linear-gradient(180deg,#ff6b6b,#d84a4a); }
.lp .level-c { background:linear-gradient(180deg,#59d88a,#39b86b); }
.lp .safe-gap { height:calc(40 * var(--rpx)); }
`;

export default function Landing() {

  /**
   * Download tap: inside the Android wrapper app the detected native bridge
   * takes over (native progress notification + "Install unknown apps" prompt).
   * In a plain browser the normal link download runs as the fallback.
   */
  const handleDownload = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    downloadWithBestBridge(APK_URL, APK_FILENAME);
  };

  return (
    <div className="lp-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="lp">
        <div className="topbar">
          <div className="brand">
            <CachedImage className="brand-logo" src={APP_LOGO} fallbackSrc={APP_LOGO_FALLBACK} cacheKey="app-logo-v2" alt={`${APP_NAME} logo`} />
            <div className="brand-txt">
              <span className="brand-name">{APP_NAME}</span>
              <span className="brand-sub">Earn Money Online</span>
            </div>
          </div>
          <a className="top-download" href={APK_URL} download={APK_FILENAME} onClick={handleDownload}>
            <span className="top-download-txt">Download</span>
          </a>
        </div>

        <div className="hero">
          <div className="hero-title">
            <span className="hero-title-line">TO GET RUPEE</span>
            <span className="hero-title-line">BY EASY TASK</span>
          </div>
          <div className="hero-ill-wrap">
            <img className="hero-ill" src="/landing/hero.png" alt="" />
          </div>
          <a className="btn-primary" href={APK_URL} download={APK_FILENAME} onClick={handleDownload}>
            <span className="btn-primary-txt">Download</span>
          </a>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-head-inner">
              <span className="panel-head-txt">Earn Money Online</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <img className="feature-icon" src="/landing/easy.png" alt="" />
              </div>
              <span className="feature-title">Easy task</span>
              <span className="feature-sub">To get Rupee</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <img className="feature-icon" src="/landing/zap-fast.png" alt="" />
              </div>
              <span className="feature-title">Super-fast</span>
              <span className="feature-sub">Withdrawal</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <img className="feature-icon" src="/landing/referer.png" alt="" />
              </div>
              <span className="feature-title">Refer</span>
              <span className="feature-sub">And Earn</span>
            </div>
          </div>
        </div>

        <a className="mid-download" href={APK_URL} download={APK_FILENAME} onClick={handleDownload}>
          <span className="mid-download-txt">Download</span>
        </a>

        <div className="section-card">
          <div className="section-title-pill">
            <span className="section-title">Why choose our platform?</span>
          </div>
          <div className="section-body">
            <div className="p-block">
              <span className="p-title">Trusted Protection:</span>
              <span className="p-text">
                Backed by industry-recognized partners, delivering a stable and reliable earning
                environment.
              </span>
            </div>
            <div className="p-block">
              <span className="p-title">Quick experience:</span>
              <span className="p-text">Smooth task flow, easy money earning.</span>
            </div>
            <div className="p-block">
              <span className="p-title">Massive orders:</span>
              <span className="p-text">
                Diverse tasks, suitable for both part-time and full-time work!
              </span>
            </div>
          </div>
          <div className="section-foot">
            <span className="section-foot-txt">
              Join us and earn money efficiently. Safer, faster, more reliable!
            </span>
          </div>
        </div>

        <div className="section-card" style={{ paddingBottom: 20 }}>
          <div className="section-title-pill">
            <span className="section-title">Recharge rebate</span>
          </div>
          <div className="level-row">
            <div className="level-item level-a">
              <span className="level-name">level A</span>
              <div className="level-badge">
                <span className="level-rate">1.5%</span>
              </div>
              <span className="level-sub">Profit Ratio</span>
            </div>
            <div className="level-item level-b">
              <span className="level-name">level B</span>
              <div className="level-badge">
                <span className="level-rate">0.5%</span>
              </div>
              <span className="level-sub">Profit Ratio</span>
            </div>
            <div className="level-item level-c">
              <span className="level-name">level C</span>
              <div className="level-badge">
                <span className="level-rate">0.3%</span>
              </div>
              <span className="level-sub">Profit Ratio</span>
            </div>
          </div>
        </div>

        <div className="safe-gap" />
      </div>
    </div>
  );
}
