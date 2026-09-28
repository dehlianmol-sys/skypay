export const css = `
    :root {
      --page: #F4F6F9;
      --surface: #ffffff;
      --mint: #EAF8F2;
      --green: #119566;
      --green-deep: #08724e;
      --ink: #101827;
      --muted: #6B7280;
      --line: #F0F0F0;
      --gold: #c9ab73;
    }

    * { box-sizing: border-box; }
    html { min-width: 320px; background: var(--page); }
    body {
      min-width: 320px;
      min-height: 100dvh;
      margin: 0;
      color: var(--ink);
      background: var(--page);
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    body.is-locked { overflow: hidden; }
    button, input { font: inherit; }
    button { -webkit-tap-highlight-color: transparent; }
    [hidden] { display: none !important; }

    .app-shell {
      width: min(100%, 480px);
      min-height: 100dvh;
      margin: 0 auto;
      background: var(--page);
    }

    .topbar {
      height: 48px;
      display: grid;
      grid-template-columns: 44px 1fr 44px;
      align-items: center;
      padding: 0 10px;
      background: var(--surface);
    }
    .topbar h1 {
      margin: 0;
      color: var(--green-deep);
      font-size: 23px;
      font-weight: 800;
      letter-spacing: 0;
      text-align: center;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
        .back-button, .topbar-spacer {
      width: 34px;
      height: 34px;
    }
    .back-button {
      display: grid;
      place-items: center;
      padding: 0;
      border: 0;
      color: var(--green);
      background: transparent;
      cursor: pointer;
    }
    .back-button svg { width: 29px; height: 29px; }

    .page-content { padding: 12px 8px 28px; }
    .amount-panel {
      width: min(100%, 464px);
      margin: 0 auto;
      padding-top: 14px;
      border-radius: 20px 20px 0 0;
      background: var(--mint);
    }
    .amount-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 0 12px 10px;
    }
    .amount {
      margin: 0;
      color: var(--ink);
      font-size: clamp(30px, 7.6vw, 40px);
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1.05;
      text-align: center;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .amount .currency { color: var(--green); }
    .expiry-badge {
      width: max-content;
      min-width: 0;
      margin: 0;
      padding: 7px 14px;
      white-space: nowrap;
      border: 1px solid #eadcbe;
      border-radius: 999px;
      background: #FFF8E7;
      color: var(--gold);
      font-size: 15px;
      font-weight: 750;
      line-height: 1;
      text-align: center;
    }
    .expiry-badge strong { color: var(--ink); font-weight: 800; }

    .details-card {
      margin: 0;
      padding: 8px 18px 11px;
      border-radius: 20px;
      background: var(--surface);
      box-shadow: 0 7px 0 rgba(25, 57, 77, .06), 0 12px 25px rgba(28, 56, 83, .05);
    }
    .detail-row {
      min-height: 47px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 10px 0;
      border-bottom: 1px solid var(--line);
    }
    .detail-row:last-of-type { border-bottom: 0; }
    .detail-label {
      flex: 0 0 auto;
      color: var(--muted);
      font-size: 17px;
      font-weight: 400;
      line-height: 1.1;
      white-space: nowrap;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .detail-value {
      min-width: 0;
      color: var(--ink);
      font-size: 17px;
      font-weight: 500;
      line-height: 1.1;
      text-align: right;
      flex: 1 1 auto;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .copy-line {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
    /* Show every character of the account number, IFSC and names — never truncate. */
    .copy-line > span:first-child {
      min-width: 0;
      overflow: visible;
      text-overflow: clip;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
      line-height: 1.3;
    }
    .copy-line > span:first-child:not(.wallet-mark):not(.status-text) {
      font-variant-numeric: tabular-nums;
    }
    .account-value > span:first-child,
    .order-number-value > span:first-child {
      white-space: nowrap;
      overflow-wrap: normal;
      word-break: normal;
    }
    .order-number-value { gap: 7px; }
    .order-number-value > span:first-child { font-size: 13px; }
    .copy-button {
      flex: 0 0 auto;
      display: inline-grid;
      place-items: center;
      width: 21px;
      height: 21px;
      padding: 0;
      border: 0;
      color: var(--green);
      background: transparent;
      cursor: pointer;
    }
    .copy-button svg { width: 21px; height: 21px; }
    .ifsc-row { align-items: start; }
    .ifsc-row .detail-label { padding-top: 3px; }
    .value-stack { min-width: 0; flex: 1 1 auto; text-align: right; }
    .warning-note {
      margin-top: 4px;
      color: var(--gold);
      font-size: 11px;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
    }
    .wallet-value { gap: 10px; padding-left: 0; }
    .wallet-mark {
      width: 28px;
      height: 28px;
      padding: 2px;
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 7px;
      color: var(--ink);
      background: #fff;
      font-size: 15px;
      font-weight: 700;
      line-height: 1;
    }
    /* Whole logo must fit inside the tile, no cropping and no colour bleeding out. */
    .wallet-mark img {
      display: block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
      border-radius: 4px;
      background: transparent;
    }
    .change-button, .status-cancel {
      flex: 0 0 auto;
      min-height: 29px;
      padding: 4px 12px;
      border: 1px solid #b9ded2;
      border-radius: 999px;
      color: var(--green);
      background: #e5f5ef;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
    .status-value { gap: 12px; }
    .status-text {
      display: inline-flex;
      align-items: center;
      gap: 0;
      font-weight: 500;
      white-space: nowrap;
    }
    .status-pending { color: var(--ink); }
    .status-submitted { color: #b48842; }
    .status-success { color: var(--green); }
    .status-failed { color: #d45559; }
    .status-cancel { min-height: 29px; padding-right: 12px; padding-left: 12px; }
    .voucher-button {
      width: 100%;
      min-height: 44px;
      margin-top: 8px;
      border: 1.5px solid #acdacc;
      border-radius: 999px;
      color: var(--green);
      background: #fff;
      font-size: 17px;
      font-weight: 800;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      cursor: pointer;
    }
    .voucher-button .arrow { padding-left: 5px; font-size: 24px; line-height: 0; vertical-align: -2px; }
    .go-pay-wrap { padding: 14px 0 0; }
    .go-pay {
  width: min(100%, 280px); /* 360px को घटाकर 280px किया (Length/Width कम करने के लिए) */
  margin: 0 auto;
  min-height: 46px;         /* 58px को घटाकर 46px किया (Height कम करने के लिए) */
  padding: 8px 16px;        /* 12px 20px को घटाकर 8px 16px किया */
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: var(--green);
  box-shadow: 0 4px 0 rgba(7, 96, 66, .08), 0 8px 18px rgba(17, 149, 102, .14);
  font-size: 19px;          /* 24px से घटाकर 19px किया ताकि टेक्स्ट छोटे बटन में फिट दिखे */
  font-weight: 800;
  letter-spacing: 0;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  cursor: pointer;
}

    button:disabled { opacity: .55; cursor: not-allowed; }
    .go-pay:active, .voucher-button:active, .modal-button:active { transform: translateY(1px); }

    .submitted-section {
      display: none !important;
      margin-top: 12px;
      padding: 14px;
      border: 1px solid #d9eee7;
      border-radius: 18px;
      background: var(--surface);
      box-shadow: 0 8px 20px rgba(28, 56, 83, .05);
    }
    .submitted-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .submitted-kicker {
      margin: 0 0 3px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .submitted-heading h2 {
      margin: 0;
      color: var(--green-deep);
      font-size: 20px;
      line-height: 1.1;
    }
    .submitted-heading .status-text { font-size: 15px; }
    .view-order-button {
      width: 100%;
      min-height: 43px;
      margin-top: 12px;
      border: 1px solid #acdacc;
      border-radius: 15px;
      color: var(--green);
      background: #fff;
      font-size: 16px;
      font-weight: 750;
      cursor: pointer;
    }
    .view-order-button .arrow { padding-left: 5px; font-size: 22px; vertical-align: -2px; }

    .modal-layer {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: grid;
      place-items: center;
      padding: 18px 26px;
      background: rgba(23, 31, 32, .59);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
    .modal-card {
      position: relative;
      width: min(100%, 420px);
      max-height: calc(100dvh - 36px);
      overflow: auto;
      padding: 30px 22px 24px;
      border: 1px solid #d4ece4;
      border-radius: 26px;
      background: rgba(255, 255, 255, .98);
      box-shadow: 0 20px 60px rgba(5, 40, 30, .25);
      text-align: center;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .modal-title {
      margin: 4px 0 16px;
      color: var(--green-deep);
      font-size: 33px;
      font-weight: 800;
      letter-spacing: -.04em;
      line-height: 1.1;
    }
    .modal-copy span { font-weight: 700; color: var(--green); margin-left: 2px; }
    .modal-copy {
      max-width: 360px;
      margin: 0 auto 22px;
      color: #4e5d70;
      font-size: 18px;
      line-height: 1.5;
    }
    .modal-button {
      white-space: nowrap;
      width: 100%;
      min-height: 52px;
      padding: 8px 20px;
      border: 1px solid #b8ded2;
      border-radius: 18px;
      color: var(--green-deep);
      background: #fff;
      box-shadow: 0 12px 24px rgba(17, 149, 102, .12);
      font-size: 21px;
      font-weight: 800;
      cursor: pointer;
    }
    .modal-button.primary { border-color: var(--green); color: #fff; background: var(--green); }
    .modal-button:disabled { border-color: #b9b9b9; color: #fff; background: #b5b5b5; box-shadow: none; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 -4px; }
    .modal-actions.single { grid-template-columns: 1fr; }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 43px;
      height: 43px;
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid #d0eade;
      border-radius: 50%;
      color: #63706e;
      background: #eef9f4;
      cursor: pointer;
    }
    .modal-close svg { width: 23px; height: 23px; }
    .preview-layer { z-index: 70; }
    .preview-card {
      width: min(100%, 420px);
      padding: 25px 18px 18px;
      border: 1px solid #d4ece4;
      border-radius: 23px;
      background: var(--surface);
      box-shadow: 0 20px 60px rgba(5, 40, 30, .25);
    }
    .preview-card h2 {
      margin: 0 0 14px;
      color: var(--green-deep);
      font-size: 24px;
      text-align: center;
    }
    .preview-frame {
      min-height: 160px;
      display: grid;
      place-items: center;
      overflow: auto;
      border-radius: 14px;
      background: #edf3f1;
    }
    .preview-frame img {
      display: block;
      width: 100%;
      max-height: 62dvh;
      object-fit: contain;
    }
    .preview-close-button {
      width: 100%;
      min-height: 46px;
      margin-top: 14px;
      border: 1px solid #b8ded2;
      border-radius: 16px;
      color: var(--green-deep);
      background: #fff;
      font-size: 18px;
      font-weight: 750;
      cursor: pointer;
    }
    .cancel-question { margin-bottom: 18px; font-size: 22px; }
    .reason-input {
      width: 100%;
      height: 55px;
      padding: 0 16px;
      border: 1px solid #cce8df;
      border-radius: 16px;
      outline: 0;
      color: var(--ink);
      background: #fff;
      font-size: 18px;
      text-align: left;
    }
    .reason-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(17, 149, 102, .12); }
    .reason-input::placeholder { color: #8a8a8a; }
    .counter { margin: 6px 0 23px; color: #91a1b5; font-size: 14px; text-align: right; }

    .loading-layer {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, .08);
    }
    .loading-box {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 14px;
      color: #fff;
      background: rgba(43, 43, 43, .94);
      box-shadow: 0 12px 28px rgba(0, 0, 0, .18);
      font-size: 20px;
      font-weight: 500;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .spinner {
      width: 22px;
      height: 22px;
      flex: 0 0 22px;
      border: 3px solid rgba(255, 255, 255, .33);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }
    .submitted-icon {
      width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
      flex: 0 0 22px;
      border: 2px solid #fff;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .toast {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 90;
      width: min(360px, calc(100vw - 48px));
      padding: 15px 20px;
      border-radius: 10px;
      color: #fff;
      background: rgba(55, 55, 55, .92);
      box-shadow: 0 12px 30px rgba(0, 0, 0, .2);
      font-size: 19px;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-weight: 500;
      line-height: 1.25;
      text-align: center;
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, calc(-50% + 12px));
      transition: opacity .2s ease, transform .2s ease;
    }
    .toast.is-visible { opacity: 1; transform: translate(-50%, -50%); }

    @media (max-width: 370px) {
      .page-content { padding-right: 6px; padding-left: 6px; }
      .details-card { padding-right: 14px; padding-left: 14px; }
      .detail-row { gap: 12px; }
      .detail-label, .detail-value { font-size: 16px; }
      .order-number-value > span:first-child { font-size: 12px; }
      .warning-note { font-size: 11px; }
      .change-button, .status-cancel { padding-right: 10px; padding-left: 10px; font-size: 14px; }
      .go-pay-wrap { padding-right: 24px; padding-left: 24px; }
    }
  `;
