export const css = `.tool-add-scope {
      --green: #0F8A5F;
      --background: #F5F7FC;
      --surface: #FFFFFF;
      --text: #111827;
      --muted: #4B5563;
      --blue: #60A5FA;
      --selected: #E8F2EC;
      --border: #DFEDE7;
      --yellow: #F4C52D;
      --app-width: 480px;
      --bottom-inset: max(18px, env(safe-area-inset-bottom, 0px));
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: var(--text);
      background: var(--background);
      color-scheme: light;
      -webkit-text-size-adjust: 100%;
    }.wallet-add-flow-active .bottom-nav { display: none; }.tool-add-scope *, .tool-add-scope *::before, .tool-add-scope *::after { box-sizing: border-box; }.tool-add-scope-body { margin: 0; min-width: 280px; }.tool-add-scope button { font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }.tool-add-scope button, .tool-add-scope h1, .tool-add-scope h2, .tool-add-scope p { margin: 0; }.tool-add-scope button { border: 0; }.tool-add-scope img { display: block; max-width: 100%; }.tool-add-scope .noscript-message { padding: 20px; text-align: center; }.tool-add-scope button:focus-visible, .tool-add-scope [role="radio"]:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 4px;
    }.tool-add-scope h1:focus { outline: none; }.tool-add-scope .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }.tool-add-scope .app {
      position: relative;
      width: 100%;
      max-width: var(--app-width);
      min-height: 100vh;
      min-height: 100dvh;
      margin-inline: auto;
      background: var(--background);
    }.tool-add-scope .screen { min-height: 100vh; min-height: 100dvh; }.tool-add-scope .main-title {
      color: var(--green);
      font-size: 18px;
      font-weight: 700;
      line-height: 26px;
      text-align: center;
    }.tool-add-scope .primary-button {
      display: block;
      width: 100%;
      min-height: 44px;
      padding: 10px 20px;
      border-radius: 999px;
      background: var(--green);
      color: var(--surface);
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
      text-align: center;
      transition: filter 160ms ease, transform 160ms ease;
    }.tool-add-scope .primary-button:active { transform: scale(.985); filter: brightness(.94); }.tool-add-scope .primary-button:disabled { cursor: wait; }.tool-add-scope #empty-state { display: block; padding-bottom: calc(90px + var(--bottom-inset)); }.tool-add-scope .empty-header { padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 0; }.tool-add-scope .empty-content { padding: 22px 10% 0; text-align: center; }.tool-add-scope .empty-message {
      color: var(--green);
      font-size: 15px;
      font-weight: 500;
      line-height: 22px;
    }.tool-add-scope .add-button { margin-top: 20px; box-shadow: 0 7px 12px rgba(15, 138, 95, .15); }.tool-add-scope #loading-state { display: none; position: fixed; z-index: 20; inset: 0; }.tool-add-scope .loading-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 128px;
      height: 112px;
      border-radius: 10px;
      background: rgba(50, 50, 50, .9);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }.tool-add-scope .spinner {
      width: 26px;
      height: 26px;
      border: 1.5px solid rgba(255, 255, 255, .28);
      border-right-color: rgba(255, 255, 255, .65);
      border-bottom-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 800ms linear infinite;
    }@keyframes spin {to { transform: rotate(360deg); }}.tool-add-scope #payment-state { display: none; }.tool-add-scope .payment-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(52px + env(safe-area-inset-top, 0px));
      padding-top: env(safe-area-inset-top, 0px);
      background: var(--surface);
    }.tool-add-scope .back-button {
      position: absolute;
      bottom: 4px;
      left: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      background: transparent;
      color: var(--green);
    }.tool-add-scope .back-button svg { width: 25px; height: 25px; }.tool-add-scope .selection-content { padding: 26px 12px calc(100px + var(--bottom-inset)); }.tool-add-scope .selection-title {
      margin-bottom: 20px;
      color: var(--green);
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
    }.tool-add-scope .segmented-control {
      display: flex;
      height: 44px;
      margin-bottom: 20px;
      padding: 3px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface);
    }.tool-add-scope .tab {
      flex: 1 1 0;
      min-width: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--muted);
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
    }.tool-add-scope .tab.active {
      background: var(--green);
      color: var(--surface);
      box-shadow: 0 4px 8px rgba(15, 138, 95, .12);
    }.tool-add-scope #payment-list { display: flex; flex-direction: column; gap: 12px; }.tool-add-scope .payment-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 60px;
      padding: 8.5px 11px;
      border: 1.5px solid var(--border);
      border-radius: 11px;
      background: var(--surface);
      text-align: left;
      box-shadow: 0 8px 14px rgba(25, 48, 39, .07);
      transition: border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
    }.tool-add-scope .payment-item.active {
      border: 1.5px solid var(--green);
      background: var(--selected);
      box-shadow: 0 8px 14px rgba(25, 48, 39, .06);
    }.tool-add-scope .payment-logo { flex: 0 0 40px; width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }.tool-add-scope .payment-details { display: flex; flex: 1 1 0; flex-direction: column; gap: 5px; min-width: 0; align-self: stretch; }.tool-add-scope .payment-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 20px; }.tool-add-scope .payment-name { color: #111827; font-size: 15px; font-weight: 600; line-height: 20px; }.tool-add-scope .payment-bottom { display: flex; align-items: center; justify-content: space-between; gap: 5px; min-height: 15px; }.tool-add-scope .payment-limit { color: #60A5FA; font-size: 12px; font-weight: 400; line-height: 15px; }.tool-add-scope .payment-payout { margin-left: auto; flex-shrink: 0; color: var(--green); font-size: 12px; font-weight: 400; line-height: 15px; }.tool-add-scope .bonus-badge {
      flex-shrink: 0;
      display: inline-block;
      padding: 3px 6px;
      border-radius: 999px;
      background: linear-gradient(100deg, #FF9100, #FFB03E);
      box-shadow: 0 3px 7px rgba(255, 145, 0, .14);
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 600;
      line-height: 12px;
      white-space: nowrap;
    }.tool-add-scope .confirm-footer {
      position: fixed;
      z-index: 5;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: var(--app-width);
      padding: 12px 20px 14px;
      background: var(--background);
    }.tool-add-scope .sure-button { box-shadow: 0 3px 0 rgba(17, 24, 39, .08); }.tool-add-scope .selection-error { display: none; margin-bottom: 8px; color: var(--muted); font-size: 12px; line-height: 18px; text-align: center; }@media (max-width: 340px) {.tool-add-scope .payment-item { gap: 8px; padding-inline: 8px; }.tool-add-scope .payment-bottom { flex-wrap: wrap; }.tool-add-scope .nav-item { font-size: 9px; letter-spacing: .3px; }}@media (prefers-reduced-motion: reduce) {.tool-add-scope *, .tool-add-scope *::before, .tool-add-scope *::after { transition: none !important; }.tool-add-scope .spinner { animation-duration: 1800ms; }}
  
`;
