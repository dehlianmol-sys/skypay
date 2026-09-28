export const css = `
    :root {
      color-scheme: light;
      --background: #F4F7FA;
      --green: #059669;
      --text: #111827;
      --muted: #6B7280;
      --red: #EF4444;
      --page-width: 480px;
      --nav-height: 82px;
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--background); color: var(--text); }
    button { font: inherit; cursor: pointer; border: 0; }
    button:focus-visible { outline: 3px solid #3B82F6; outline-offset: 4px; }
    button:disabled { cursor: default; }
    svg { display: block; }
    [hidden] { display: none !important; }
    .app { width: 100%; max-width: var(--page-width); margin: 0 auto; }
    .page-header { height: 86px; display: grid; place-items: center; padding-top: env(safe-area-inset-top, 0px); }
    .page-header h1 { margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 18px; font-weight: 750; line-height: 24px; }
    main { padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 18px); }
    .hero {
      position: relative;
      isolation: isolate;
      margin: 0 14px;
      aspect-ratio: 842 / 548;
      overflow: hidden;
      border-radius: 16px;
      color: #FFF;
      background: linear-gradient(110deg, #0C8D62 0%, #0DA66F 100%);
      box-shadow: 0 8px 20px rgba(0, 0, 0, .07);
    }
    .hero-art { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; }
    .cashback { position: absolute; top: 11.8%; left: 9.2%; margin: 0; font-size: clamp(17px, 4.8vw, 23px); font-weight: 400; line-height: 1.3; color: #E9FFF5; }
    .cashback strong { display: block; margin-top: 2px; color: #FFF; font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: clamp(38px, 10.6vw, 51px); line-height: 1.13; font-weight: 800; letter-spacing: -.9px; }
    .wallet-grid { position: absolute; inset: 46% 6.65% 10.6%; display: grid; grid-template-columns: 1.02fr 1fr; grid-template-rows: 1fr 1fr; gap: 7px; margin: 0; }
    .wallet-stat { position: relative; min-width: 0; display: grid; place-items: center; border: 1px solid rgba(255, 255, 255, .29); border-radius: 6px; background: rgba(255, 255, 255, .16); }
    .wallet-stat.balance { grid-row: span 2; }
    .wallet-stat dt { position: absolute; left: 6px; top: 2px; font-size: clamp(9px, 2.55vw, 12px); line-height: 14px; font-weight: 500; color: #EEFFF7; }
    .wallet-stat dd { margin: 4px 0 0; font-size: clamp(16px, 4.55vw, 22px); line-height: 1.25; font-weight: 800; }
    .filters { position: sticky; top: 0; z-index: 10; background: var(--background); padding-top: 12px; }
    .notice { margin: 0 22px 18px; min-height: 38px; text-align: center; font-size: 12px; font-weight: 500; line-height: 19px; color: var(--green); }
    .notice svg { width: 13px; height: 13px; display: inline-block; vertical-align: -1.5px; margin-right: 3px; }
    .notice-tail { display: block; }
    .tabs-wrap { position: relative; }
    .tabs-wrap::after { content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 15px; background: linear-gradient(90deg, transparent, var(--background)); pointer-events: none; }
    .tabs { display: flex; gap: 8px; padding: 0 14px; overflow-x: auto; scrollbar-width: none; scroll-padding-inline: 14px; }
    .tabs::-webkit-scrollbar { display: none; }
    .tab { flex: 0 0 auto; white-space: nowrap; min-height: 33px; padding: 5px 0 6px; border-radius: 999px; background: #E5E7EB; color: #555; font-size: 16px; font-weight: 500; line-height: 22px; }
    .tab:nth-child(1) { width: 98px; }
    .tab:nth-child(2) { width: 87px; }
    .tab:nth-child(3) { width: 96px; }
    .tab:nth-child(4) { width: 123px; }
    .tab[aria-selected="true"] { color: #FFF; background: var(--green); font-weight: 600; box-shadow: 0 4px 9px rgba(117, 101, 244, .12); }
    .claims { display: grid; align-content: start; gap: 14px; margin: 17px 14px 0; min-height: calc(100svh - 112px - var(--nav-height) - var(--safe-bottom)); }
    .claim-card { position: relative; min-width: 0; padding: 11px 19px 12px; border-radius: 14px; background: #FFF; box-shadow: 0 4px 12px rgba(0, 0, 0, .04); border: 1px solid #F0F0F0; }
    .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; min-height: 27px; }
    .currency { margin: 0; font-size: 22px; line-height: 27px; font-weight: 750; letter-spacing: .3px; color: var(--green); }
    .code { display: inline-flex; align-items: center; gap: 6px; margin-top: 2px; white-space: nowrap; font-size: 13px; line-height: 17px; font-weight: 600; }
    .code-label { padding: 0 6px; border-radius: 5px; color: var(--green); background: #E2F1EB; font-size: 11px; font-weight: 800; }
    .amount { margin: 0; font-size: 13px; line-height: 21px; color: var(--muted); font-weight: 500; }
    .amount strong { color: var(--green); font-size: 14px; font-weight: 800; margin-left: 6px; }
    .card-bottom { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 23px; }
    .income-group { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .income { margin: 0; white-space: nowrap; font-size: 13px; line-height: 20px; }
    .income strong { color: var(--red); font-weight: 800; }
    .special { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; border: 1px solid #BED0FA; border-radius: 999px; background: #EEF2FF; color: #3B82F6; padding: 2px 5px; font-size: 9px; line-height: 14px; font-weight: 700; box-shadow: 0 5px 9px rgba(59, 130, 246, .15); }
    .special strong { font-size: 12px; font-weight: 800; }
    .claim-button { flex: 0 0 auto; width: 55px; min-height: 23px; padding: 3px 0; transform: translateY(-5px); border-radius: 999px; color: #FFF; background: var(--green); font-size: 13px; line-height: 17px; font-weight: 750; box-shadow: 0 4px 10px rgba(5, 150, 105, .19); }
    .claim-button:active { background: #047857; }
    .claim-button:disabled { background: #DDF4EA; color: #047857; box-shadow: none; }
    .no-more-data { margin: 0; padding: 22px 0; text-align: center; color: #6B7280; font-size: 13px; font-weight: 400; line-height: 20px; }
    .support-button { position: fixed; z-index: 25; right: max(6px, calc((100% - 480px) / 2 + 6px)); bottom: calc(var(--nav-height) + var(--safe-bottom) + 26px); width: 72px; height: 72px; display: grid; place-items: center; padding: 0; border: 0; background: transparent; overflow: hidden; border-radius: 50%; }
    .support-button img { display: block; width: 50px; height: 50px; border-radius: 50%; object-fit: cover; transform: scale(2); transform-origin: 55% 43%; }
    .loading-layer { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; }
    .loading-box { width: 144px; height: 116px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 17px; color: #FFF; background: rgba(0, 0, 0, .70); font-size: 16px; line-height: 20px; }
    .spinner { width: 28px; height: 28px; border: 2px solid rgba(255, 255, 255, .25); border-right-color: rgba(255, 255, 255, .93); border-bottom-color: rgba(255, 255, 255, .65); border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .toast { position: fixed; z-index: 110; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(360px, calc(100vw - 48px)); padding: 14px 18px; border-radius: 10px; color: #FFF; background: rgba(17, 24, 39, .93); box-shadow: 0 4px 12px rgba(0, 0, 0, .12); font-size: 14px; line-height: 20px; text-align: center; }
    .support-panel { position: fixed; z-index: 40; right: max(14px, calc((100vw - var(--page-width)) / 2 + 14px)); bottom: calc(var(--nav-height) + var(--safe-bottom) + 106px); width: min(290px, calc(100vw - 28px)); padding: 19px; background: #FFF; border-radius: 14px; box-shadow: 0 8px 30px rgba(0, 0, 0, .14); }
    .support-panel h2 { font-size: 16px; color: var(--green); margin: 0 25px 10px 0; }
    .support-panel p { margin: 0; color: var(--muted); font-size: 13px; line-height: 20px; }
    .close-support { position: absolute; top: 10px; right: 10px; padding: 4px; background: transparent; color: var(--muted); }
    .close-support svg { width: 18px; height: 18px; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    @media (min-width: 600px) {
      .app { min-height: 100svh; box-shadow: 0 0 40px rgba(23, 53, 67, .06); }
    }
    @media (max-width: 359px) {
      .claim-card { padding-left: 14px; padding-right: 14px; }
      .income-group { gap: 4px; }
      .special { gap: 3px; font-size: 9px; padding-inline: 5px; }
      .special strong { font-size: 11px; }
      .claim-button { width: 51px; }
      .notice { margin-inline: 14px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: 1.6s; }
    }
  `;
