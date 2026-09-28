export const css = `.wallet-steps-scope {
      --green: #0F8A5F;
      --green-soft: #E8F2EC;
      --green-border: #BCDCD1;
      --background: #F5F7FC;
      --surface: #FFFFFF;
      --text: #111827;
      --text-secondary: #414958;
      --text-muted: #587768;
      --border: #D1E4DD;
      --app-width: 480px;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: var(--text);
      background: var(--background);
      color-scheme: light;
      -webkit-text-size-adjust: 100%;
    }.wallet-steps-scope *, .wallet-steps-scope *::before, .wallet-steps-scope *::after { box-sizing: border-box; }.wallet-steps-scope { margin: 0; }.wallet-steps-scope h1, .wallet-steps-scope h2, .wallet-steps-scope h3, .wallet-steps-scope p { margin: 0; }.wallet-steps-scope button, .wallet-steps-scope input { font: inherit; }.wallet-steps-scope button, .wallet-steps-scope a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }.wallet-steps-scope button { cursor: pointer; }.wallet-steps-scope a:focus-visible, .wallet-steps-scope button:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 5px;
    }.wallet-steps-scope [hidden] { display: none !important; }.wallet-steps-scope .wallet-app {
      width: 100%;
      max-width: var(--app-width);
      margin-inline: auto;
      padding-bottom: 28px;
      background: var(--background);
    }.wallet-steps-scope .page-header { padding-top: 14px; }/* Header Styles */.wallet-steps-scope .page-header {
      padding-top: env(safe-area-inset-top, 0px);
      background: var(--surface);
    }.wallet-steps-scope .header-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 45px;
      padding-inline: 56px;
    }.wallet-steps-scope .page-title {
      color: var(--green);
      font-size: 18px;
      font-weight: 700;
      line-height: 26px;
      text-align: center;
    }.wallet-steps-scope .back-link {
      position: absolute;
      left: 4px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: var(--green);
      text-decoration: none;
      border-radius: 8px;
    }.wallet-steps-scope .back-link svg { width: 25px; height: 25px; }.wallet-steps-scope .page-content { padding: 16px 9.1% calc(110px + env(safe-area-inset-bottom, 0px)); }/* Progress Bar */.wallet-steps-scope .progress { margin-bottom: 24px; }.wallet-steps-scope .steps {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 0;
      margin: 0;
      list-style: none;
    }.wallet-steps-scope .steps::before {
      position: absolute;
      top: 20px;
      right: 21px;
      left: 21px;
      height: 3px;
      background: var(--green-border);
      content: "";
    }.wallet-steps-scope .step {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 42px;
      flex: 0 0 42px;
    }.wallet-steps-scope .step-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border: 2px solid var(--green-border);
      border-radius: 50%;
      background: var(--green-soft);
      color: var(--text-muted);
      font-size: 25px;
      font-weight: 600;
      line-height: 1;
    }.wallet-steps-scope .step-label {
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
    }.wallet-steps-scope .step[aria-current="step"] .step-circle {
      border-color: var(--green);
      background: var(--green);
      color: var(--surface);
      box-shadow: 0 0 0 5px rgba(15, 138, 95, .13);
      font-weight: 700;
    }.wallet-steps-scope .step[aria-current="step"] .step-label {
      color: var(--green);
      font-weight: 700;
    }/* Verification Card Styles (Imported from File 1) */.wallet-steps-scope .verification-card {
      width: 100%;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 13px;
      background: linear-gradient(100deg, #ECF9F1 0%, #D9F2E6 54%, #0F8A5F 100%);
    }.wallet-steps-scope .v-card-heading {
      margin: 0;
      padding: 16px 20px 22px;
      color: #0B6849;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -.02em;
      line-height: 1.12;
    }.wallet-steps-scope .v-card-body {
      position: relative;
      margin-top: -10px;
      padding: 24px 22px 32px;
      border: 1px solid rgba(15, 138, 95, .08);
      border-radius: 13px;
      background: var(--surface);
      box-shadow: 0 12px 22px rgba(31, 60, 47, .09);
    }.wallet-steps-scope .wallet-details {
      display: grid;
      gap: 14px;
    }.wallet-steps-scope .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.2;
    }.wallet-steps-scope .detail-value {
      color: var(--text-secondary);
      font-weight: 500;
      text-align: right;
      white-space: nowrap;
    }.wallet-steps-scope .upi-title {
      margin: 28px 0 16px;
      color: var(--green);
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -.02em;
      line-height: 1;
    }.wallet-steps-scope .upi-options {
      min-width: 0;
      display: grid;
      gap: 14px;
    }.wallet-steps-scope .upi-option {
      width: 100%;
      min-width: 0;
      min-height: 60px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 0 16px;
      border: 2px solid var(--green-border);
      border-radius: 12px;
      color: var(--text);
      background: #fff;
      box-shadow: 0 4px 12px rgba(34, 78, 63, .03);
      cursor: pointer;
      text-align: left;
      transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
    }.wallet-steps-scope .upi-option:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(34, 78, 63, .06); }.wallet-steps-scope .upi-option.is-selected {
      border-color: var(--green);
      color: #0B6849;
      background: var(--green-soft);
      box-shadow: 0 6px 16px rgba(15, 138, 95, .1);
    }.wallet-steps-scope .upi-option-label {
      min-width: 0;
      overflow: hidden;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -.01em;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }.wallet-steps-scope .selection-control {
      width: 26px;
      height: 26px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 2px solid var(--green-border);
      border-radius: 50%;
      background: #fff;
      transition: all .18s ease;
    }.wallet-steps-scope .selection-control svg { width: 14px; height: 14px; opacity: 0; }.wallet-steps-scope .upi-option.is-selected .selection-control {
      border-color: var(--green);
      background: var(--green);
    }.wallet-steps-scope .upi-option.is-selected .selection-control svg { opacity: 1; }/* Finish Button Styles */.wallet-steps-scope .finish-button {
      display: block;
      width: 74%;
      min-height: 46px;
      margin: 24px auto 0;
      padding: 11px 20px;
      border: 0;
      border-radius: 999px;
      background: var(--green);
      color: var(--surface);
      box-shadow: 0 8px 13px rgba(15, 138, 95, .18);
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      transition: background-color 160ms ease, transform 160ms ease;
    }.wallet-steps-scope .finish-button:active { transform: scale(.985); background: #0C7651; }/* Toast Notification */.wallet-steps-scope .toast {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 10;
      width: min(360px, calc(100vw - 48px));
      padding: 14px 20px;
      border-radius: 10px;
      color: #fff;
      background: rgba(17, 36, 29, .92);
      box-shadow: 0 12px 28px rgba(17, 36, 29, .18);
      font-size: 15px;
      font-weight: 500;
      opacity: 0;
      pointer-events: none;
      text-align: center;
      transform: translate(-50%, calc(-50% + 12px));
      transition: opacity .2s ease, transform .2s ease;
    }.wallet-steps-scope .toast.is-visible { opacity: 1; transform: translate(-50%, -50%); }.wallet-steps-scope .system-bottom {
      position: fixed;
      bottom: 0;
      left: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: var(--app-width);
      height: max(16px, env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);
      background: var(--surface);
      pointer-events: none;
    }.wallet-steps-scope .system-bottom::after {
      width: 40%;
      max-width: 144px;
      height: 3px;
      border-radius: 999px;
      background: #686868;
      content: "";
    }.wallet-steps-scope .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }@media (max-width: 359px) {.wallet-steps-scope .page-content { padding-inline: 7%; }.wallet-steps-scope .v-card-body { padding-inline: 16px; }.wallet-steps-scope .detail-row { font-size: 15px; }}@media (prefers-reduced-motion: reduce) {.wallet-steps-scope *, .wallet-steps-scope *::before, .wallet-steps-scope *::after { transition: none !important; }}/* phone step */.wallet-steps-scope .wallet-card { border-radius: 13px; }.wallet-steps-scope .card-heading {
      padding: 13px 16px 20px;
      border-radius: 13px 13px 0 0;
      background: linear-gradient(100deg, #ECF9F1 0%, #D9F2E6 54%, #0F8A5F 100%);
    }.wallet-steps-scope .card-title {
      color: #0B6849;
      font-size: 17px;
      font-weight: 700;
      line-height: 25px;
      overflow-wrap: anywhere;
    }.wallet-steps-scope .card-body {
      position: relative;
      margin-top: -9px;
      padding: 11px 22px 28px;
      border: 1px solid rgba(15, 138, 95, .08);
      border-radius: 13px;
      background: var(--surface);
      box-shadow: 0 12px 22px rgba(31, 60, 47, .09);
    }.wallet-steps-scope .intro-title {
      font-size: 18px;
      font-weight: 700;
      line-height: 27px;
    }.wallet-steps-scope .description-steps {
      margin: 10px 0 0;
      padding: 0;
      list-style: none;
      counter-reset: wstep;
      color: var(--text-secondary);
      font-size: 14.5px;
      line-height: 1.6;
    }.wallet-steps-scope .description-steps li {
      counter-increment: wstep;
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 6px;
      margin-top: 6px;
    }.wallet-steps-scope .description-steps li::before {
      content: counter(wstep) ".";
      color: var(--green, #0f8a5f);
      font-weight: 700;
    }.wallet-steps-scope .description {
      margin-top: 7px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.55;
    }.wallet-steps-scope .phone-field { margin-top: 18px; }.wallet-steps-scope .phone-label {
      display: block;
      margin-bottom: 3px;
      color: var(--green);
      font-size: 16px;
      font-weight: 700;
      line-height: 23px;
    }.wallet-steps-scope .phone-input {
      display: flex;
      align-items: stretch;
      min-height: 46px;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 11px;
      background: var(--surface);
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }.wallet-steps-scope .phone-input:focus-within {
      border-color: var(--green);
      box-shadow: 0 0 0 3px rgba(15, 138, 95, .1);
    }.wallet-steps-scope .country-code {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 48px;
      border-right: 1px solid #DCE2DF;
      color: #0B6849;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
    }.wallet-steps-scope .phone-input input {
      width: 100%;
      min-width: 0;
      padding: 11px 12px;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--text);
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      caret-color: var(--green);
    }.wallet-steps-scope .phone-input input::placeholder { color: #858585; opacity: 1; }.wallet-steps-scope .phone-input.invalid { border-color: var(--error); }.wallet-steps-scope .field-error {
      margin-top: 7px;
      color: var(--error);
      font-size: 12px;
      line-height: 18px;
    }.wallet-steps-scope .submit-button {
      display: block;
      width: 74%;
      min-height: 46px;
      margin: 8px auto 0;
      padding: 11px 20px;
      border: 0;
      border-radius: 999px;
      background: var(--green);
      color: var(--surface);
      box-shadow: 0 8px 13px rgba(15, 138, 95, .18);
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      transition: background-color 160ms ease, transform 160ms ease;
    }.wallet-steps-scope .submit-button:active { transform: scale(.985); background: #0C7651; }.wallet-steps-scope .form-status {
      margin-top: 16px;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 20px;
      text-align: center;
    }.wallet-steps-scope .form-status:empty { display: none; }.wallet-steps-scope .noscript-message { margin-top: 14px; color: var(--text-secondary); font-size: 13px; line-height: 20px; }.wallet-steps-scope .card-body { padding-inline: 16px; }.wallet-steps-scope .phone-input input { padding-inline: 9px; }.wallet-steps-scope .country-code { flex-basis: 43px; }


.wallet-steps-scope .phone-page .progress { margin-bottom: 10px; }
`;
