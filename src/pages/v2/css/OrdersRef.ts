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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: max(78px, calc(56px + env(safe-area-inset-top, 0px)));
      padding-top: env(safe-area-inset-top, 0px);
      background: #fff;
    }
    .page-title { margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 21px; line-height: 26px; font-weight: 800; }
    .back-button {
      position: absolute;
      left: 6px;
      bottom: 6px;
      width: 46px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--green);
      font-size: 32px;
      line-height: 1;
      font-weight: 400;
    }
    main { padding: 10px var(--gutter) 0; }
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
    .currency-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 13px; }
    .currency-tab {
      min-height: 38px;
      padding: 7px 12px;
      border: 1px solid #c6ded8;
      border-radius: 22px;
      background: #e7f1ee;
      color: #6f9e90;
      font-size: 16px;
      line-height: 22px;
      font-weight: 800;
      box-shadow: inset 0 1px 3px #43886f0a;
      transition: background 160ms ease, color 160ms ease, box-shadow 160ms ease;
    }
    .currency-tab[aria-selected="true"] {
      border-color: var(--green);
      background: var(--green);
      color: #fff;
      box-shadow: 0 4px 14px #0f8a5f33;
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
      .currency-tabs { gap: 12px; }
    }
  `;
