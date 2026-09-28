export const css = `
    :root {
      color-scheme: light;
      --green: #0f8a5f;
      --page: #f5f7fc;
      --pill: #d8eae7;
      --gutter: clamp(9px, 2.8vw, 14px);
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { min-height: 100%; background: var(--page); }
    body {
      margin: 0;
      min-height: 100vh;
      min-height: 100dvh;
      color: #202d3c;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
    }
    button { font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    button:focus-visible { outline: 2px solid #126ca8; outline-offset: 3px; }
    [hidden] { display: none !important; }
    .wallet-page {
      width: 100%;
      max-width: 462px;
      min-height: 100vh;
      min-height: 100dvh;
      margin-inline: auto;
      background: var(--page);
      padding-bottom: max(24px, env(safe-area-inset-bottom, 0px));
    }
    .page-header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      height: max(78px, calc(56px + env(safe-area-inset-top, 0px)));
      padding-top: env(safe-area-inset-top, 0px);
      background: #fff;
    }
    .page-title { grid-column: 2; margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 21px; line-height: 26px; font-weight: 800; white-space: nowrap; }
    .back-button {
      grid-column: 1;
      justify-self: start;
      margin-left: 6px;
      width: 46px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--green);
      font-size: 34px;
      line-height: 1;
      font-weight: 700;
    }
    main {
      max-width: 380px;
      width: 100%;
      margin-inline: auto;
      padding: 10px var(--gutter) 0;
    }
    .main-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      height: 47px;
      padding: 5px;
      border: 1px solid #c9e0db;
      border-radius: 28px;
      background: var(--pill);
    }
    .main-tab {
      min-width: 0;
      padding: 0 10px;
      border: 0;
      border-radius: 24px;
      background: transparent;
      color: #389a7b;
      font-size: 18px;
      line-height: 24px;
      font-weight: 800;
    }
    .main-tab[aria-selected="true"] {
      color: white;
      background: var(--green);
      box-shadow: 0 3px 9px #0f8a5f26;
    }
    .balance-card {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      height: 95px;
      margin-top: 13px;
      padding: 14px 18px;
      border-radius: 16px;
      color: #fff;
      background: linear-gradient(110deg, #0caf73 0%, #0f8a5f 100%);
      box-shadow: 0 8px 20px #183d3120;
    }
    .balance-card::before, .balance-card::after {
      content: "";
      position: absolute;
      z-index: -1;
      pointer-events: none;
      border-radius: 50%;
    }
    .balance-card::before {
      width: 190px;
      height: 190px;
      right: -99px;
      top: -97px;
      background: linear-gradient(135deg, #ffcb51, #f7da76);
    }
    .balance-card::after {
      width: 160px;
      height: 160px;
      right: -95px;
      top: 24px;
      background: linear-gradient(135deg, #578be9, #8fb4ff);
      transform: rotate(30deg);
    }
    .balance-label { margin: 0 0 5px; font-size: 20px; line-height: 24px; color: #e2f2e9; }
    .balance-value { margin: 0; font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 25px; line-height: 29px; font-weight: 700; }
    .balance-details { display: grid; gap: 12px; margin: 0; padding-left: 9px; padding-right: 26px; }
    .balance-details > div { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .balance-details dt { color: #def0e5; font-size: 16px; }
    .balance-details dd { margin: 0; white-space: nowrap; font-size: 18px; font-weight: 700; }
    .currency-tabs {
      position: relative;
      isolation: isolate;
      display: flex;
      gap: 16px;
      margin: 15px 0 0;
    }
    .currency-tabs::before {
      content: "";
      position: absolute;
      z-index: -1;
      inset: 0 auto 0 0;
      width: calc((100% - 16px) / 2);
      border: 1px solid #a9d2c3;
      border-radius: 999px;
      background: #d9e9e1;
      transform: translateX(0);
      transition: transform 280ms cubic-bezier(.22, 1, .36, 1);
      will-change: transform;
    }
    .currency-tabs:has(#usdt-tab[aria-selected="true"])::before {
      transform: translateX(calc(100% + 16px));
    }
    .currency-tab {
      flex: 1;
      min-height: 42px;
      padding: 0 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      border-radius: 999px;
      background: #fff;
      color: #15803d;
      font-size: 16px;
      font-weight: 800;
      box-shadow: 0 2px 6px rgba(28, 77, 58, 0.08);
      transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }
    .currency-tab:active {
      background: #f2f8f5;
    }
    .currency-tab[aria-selected="true"] {
      background: transparent;
      border-color: transparent;
      color: #15803d;
      box-shadow: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .currency-tabs::before { transition: none; }
    }
    .orders-container { position: relative; display: flow-root; min-width: 0; }
    .empty-state { margin: 8px 0 0; text-align: center; color: #82868c; font-size: 14px; line-height: 20px; font-weight: 400; }
    .history-order { margin-top:10px; padding:13px 14px; border:1px solid #dbe7e3; border-radius:10px; background:#fff; box-shadow:0 3px 10px #29483b0b; }
    .history-order>div { display:flex; align-items:center; justify-content:space-between; gap:10px; }
    .history-order strong { color:#202d3c; font-size:17px; }
    .history-order p,.history-order time { display:block; margin:6px 0 0; color:#82868c; font-size:12px; }
    .history-status { padding:4px 9px; border-radius:999px; color:#8b6900; background:#fff4c9; font-size:11px; font-weight:700; }
    .status-success { color:#08764f; background:#e1f6ed; }
    .status-rejected { color:#b42318; background:#fee4e2; }
    @media (max-width: 374px) {
      .balance-card { padding-inline: 14px; }
      .balance-details { padding-left: 0; padding-right: 12px; }
      .balance-details > div { gap: 7px; }
      .balance-details dt { font-size: 14px; }
    }
  `;
