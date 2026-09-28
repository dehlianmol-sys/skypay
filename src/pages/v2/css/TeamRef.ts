export const css = `
    :root {
      --canvas: #F4F7FA;
      --green: #059669;
      --emerald: #10B981;
      --folder: #0D8D63;
      --ink: #1F2937;
      --muted: #6B7280;
      --mint: #EAF8F2;
      --radius: 16px;
      --shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    }
    * { box-sizing: border-box; }
    html { min-height: 100%; background: var(--canvas); -webkit-text-size-adjust: 100%; }
    body { margin: 0; color: var(--ink); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 14px; line-height: 1.4; }
    button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    button { font: inherit; cursor: pointer; border: 0; color: inherit; }
    button:disabled { cursor: wait; }
    button:focus-visible, a:focus-visible { outline: 2px solid #2563EB; outline-offset: 4px; }
    h1, h2, h3, p, dl, dd { margin: 0; }
    [hidden] { display: none !important; }
    .app { max-width: 430px; min-height: 100vh; min-height: 100dvh; margin: 0 auto; background: var(--canvas); }
    /* Preserve the reference's upper safe-area spacing without drawing phone chrome. */
    .app-header { padding-top: env(safe-area-inset-top, 0px); background: #FFF; }
    .topbar { position: relative; display: flex; align-items: center; justify-content: center; height: 49px; }
    .topbar h1 { color: var(--green); font-size: 22px; font-weight: 700; line-height: 30px; }
    .topbar h1:focus { outline: none; }
    .back-button { position: absolute; left: 7px; top: 2px; width: 44px; height: 44px; display: grid; place-items: center; padding: 0; background: transparent; color: var(--green); }
    .back-button svg { width: 27px; height: 27px; fill: none; stroke: currentColor; stroke-width: 2.3; stroke-linecap: round; stroke-linejoin: round; }
    .team-content { display: grid; gap: 14.5px; padding: 20.5px 12px max(120px, env(safe-area-inset-bottom, 0px)); }
    .card { border: 1px solid #E5F0EB; border-radius: var(--radius); background: #FFF; box-shadow: var(--shadow); }
    .commissions-summary { padding: 20px 14px 18px; border-radius: var(--radius); background: linear-gradient(120deg, var(--green), var(--emerald)); box-shadow: 0 8px 18px rgba(31, 41, 55, 0.12); text-align: center; }
    .summary-title { font-size: 15px; font-weight: 500; line-height: 22px; color: rgba(255, 255, 255, 0.86); }
    .summary-total { font-size: 32px; font-weight: 750; line-height: 42px; color: #FFF; }
    .summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin-top: 2px; }
    .summary-stat { min-height: 59px; padding: 6px 3px 8px; border: 1px solid #DAECE3; border-radius: 10px; background: #FFF; }
    .summary-stat dt { color: var(--muted); font-size: 11px; font-weight: 400; line-height: 16px; white-space: nowrap; }
    .summary-stat dd { margin-top: 4px; color: var(--green); font-size: 16px; font-weight: 700; line-height: 23px; }
    .folder { position: relative; padding-top: 19px; filter: drop-shadow(0 6px 7px rgba(0, 0, 0, 0.055)); }
    .folder::before { content: ""; position: absolute; top: 0; left: 0; width: var(--tab-width, 132px); height: 39px; border-top-left-radius: 16px; background: var(--folder); clip-path: polygon(0 0, calc(100% - 25px) 0, calc(100% - 21px) 2px, 100% 21px, 100% 100%, 0 100%); }
    .folder-title { position: absolute; z-index: 1; top: 6px; left: 18px; color: #FFF; font-size: 18px; font-weight: 600; line-height: 25px; white-space: nowrap; }
    .folder-shell { position: relative; border-radius: 0 16px 16px 16px; background: var(--folder); padding-top: 14px; }
    .invitation-link { display: flex; align-items: center; justify-content: space-between; min-height: 41px; margin: 0 16px 13px; padding: 0 16px; border-radius: 999px; color: #FFF; background: linear-gradient(105deg, #079B62, #0CB777 55%, #079B62); }
    .invitation-link strong { font-size: 24px; font-weight: 750; line-height: 32px; }
    .copy-code { display: flex; align-items: center; gap: 6px; min-height: 41px; padding: 0; background: transparent; color: #FFF; font-size: 18px; line-height: 24px; }
    .copy-code svg { width: 17px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linejoin: round; }
    .members-body { padding: 12px 20px 21px; border: 1px solid #E0EEE7; border-radius: var(--radius); background: #FFF; }
    .members-body h3 { text-align: center; font-size: 14px; font-weight: 600; line-height: 20px; }
    .member-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
    .member-box { position: relative; height: 73px; padding: 17px 12px 12px; border: 1px solid #D0E9DD; border-radius: 10px; background: var(--mint); }
    .member-box h4 { position: absolute; top: -15px; left: 0; width: 100%; margin: 0; text-align: center; font-size: 22px; font-weight: 750; line-height: 29px; letter-spacing: 1px; color: var(--green); }
    .member-box dl { display: grid; gap: 7px; }
    .member-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11px; line-height: 16px; }
    .member-row dt { color: var(--muted); }
    .member-row dd { color: var(--green); font-weight: 700; }
    .share-card { padding: 16px 12px 11px; }
    .share-card h2 { font-size: 22px; font-weight: 750; line-height: 29px; }
    .share-options { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-top: 8px; }
    .share-option { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-width: 0; height: 91px; padding: 9px 2px 7px; border: 1px solid #EDEFF4; border-radius: 11px; background: #F8F9FC; }
    .share-option img { display: block; flex-shrink: 0; object-fit: contain; }
    .share-option span { font-size: 13px; font-weight: 400; line-height: 18px; white-space: nowrap; }
    .share-option:active { background: #EDF3F1; }
    .deposit-card { --tab-width: 230px; }
    .deposit-card .folder-shell { padding-top: 19px; }
    .deposit-body { padding: 12px 26px 3px; border: 1px solid #E0EEE7; border-radius: var(--radius); background: #FFF; }
    .deposit-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 28px; }
    .deposit-row dt { color: var(--green); font-size: 18px; font-weight: 700; line-height: 28px; }
    .deposit-row dd { color: var(--muted); font-size: 16px; font-weight: 600; line-height: 28px; font-variant-numeric: tabular-nums; }
    #viewDetailsBtn { display: inline-block; margin-top: 5px; font-size: 14px; line-height: 22px; text-underline-offset: 1px; }
    .performance-card { padding: 11px 6px 32px 13px; }
    .performance-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 33px; margin-right: 7px; }
    .performance-header h2 { font-size: 16px; font-weight: 700; line-height: 24px; }
    .period-switch { display: flex; flex-shrink: 0; padding: 3px; border-radius: 999px; background: #F5F5F5; }
    .period-switch button { padding: 4px 9px; border-radius: 999px; background: transparent; color: var(--muted); font-size: 12px; line-height: 19px; }
    .period-switch button[aria-pressed="true"] { background: #FFF; color: var(--green); font-weight: 700; box-shadow: 0 4px 7px rgba(31, 41, 55, 0.09); }
    .chart { margin-top: 13px; padding-left: 7px; }
    .chart-row { display: grid; grid-template-columns: 45px 1fr; align-items: center; height: 21.3px; color: #7C8492; font-size: 10px; line-height: 14px; }
    .chart-row i { height: 1px; background: #E7E9EC; }
    .level-content { padding-top: 7px; }
    .level-tabs { display: flex; margin: 0 36px; padding: 3px 5px; border: 1px solid #CAE9DD; border-radius: 999px; background: var(--mint); }
    .level-tab { flex: 1; min-width: 0; min-height: 25px; padding: 0 8px; border-radius: 999px; background: transparent; color: var(--green); font-size: 16px; font-weight: 600; line-height: 25px; }
    .level-tab[aria-selected="true"] { background: #FFF; box-shadow: 0 4px 10px rgba(31, 41, 55, 0.12); }
    .level-panel { margin-top: 25px; text-align: center; color: #66686D; font-size: 13px; line-height: 20px; }
    .inline-loading { display: inline-flex; align-items: center; gap: 8px; }
    .small-spinner { width: 13px; height: 13px; border: 3px dotted #C4C6C9; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .loading-overlay { position: fixed; z-index: 10; inset: 0; display: grid; place-items: center; }
    .loading-modal { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; width: 144px; height: 116px; border-radius: 10px; background: rgba(36, 37, 39, 0.82); color: #FFF; font-size: 16px; line-height: 23px; }
    .spinner { width: 28px; height: 28px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #FFF; border-left-color: rgba(255, 255, 255, 0.85); border-right-color: rgba(255, 255, 255, 0.55); border-radius: 50%; animation: spin 0.85s linear infinite; }
    .toast { position: fixed; z-index: 20; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(360px, calc(100vw - 48px)); padding: 12px 18px; border-radius: 10px; background: rgba(31, 41, 55, 0.93); color: #FFF; text-align: center; font-size: 13px; line-height: 1.45; box-shadow: var(--shadow); }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 360px) {
      .summary-stat dt { font-size: 9.5px; }
      .member-box { padding-right: 9px; padding-left: 9px; }
      .share-options { gap: 6px; }
      .share-option span { font-size: 11px; }
      .performance-header { gap: 3px; }
      .performance-header h2 { font-size: 14px; }
      .period-switch button { padding-right: 7px; padding-left: 7px; font-size: 11px; }
      .deposit-body { padding-right: 20px; padding-left: 20px; }
    }
    @media (min-width: 600px) {
      .app { box-shadow: 0 0 35px rgba(31, 41, 55, 0.06); }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner, .small-spinner { animation-duration: 1.8s; }
    }
  `;
