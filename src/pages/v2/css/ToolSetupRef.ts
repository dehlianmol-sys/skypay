export const css = `.tool-setup-scope {
      --green: #0f8a5f;
      --green-dark: #08734e;
      --green-light: #e3f2ed;
      --text: #202725;
      --muted: #909895;
      --background: #f5f6fa;
      --divider: #edf2f0;
      --shadow: 0 3px 9px rgba(28, 48, 40, 0.12);
    }.tool-setup-scope * {
      box-sizing: border-box;
    }.tool-setup-scope .tool-setup-html {
      min-height: 100%;
      background: var(--background);
    }.tool-setup-scope .tool-setup-body {
      margin: 0;
      color: var(--text);
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }.tool-setup-scope button, .tool-setup-scope a {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }.tool-setup-scope button {
      font: inherit;
      cursor: pointer;
    }.tool-setup-scope button:focus-visible, .tool-setup-scope a:focus-visible {
      outline: 3px solid #49af91;
      outline-offset: 4px;
    }.tool-setup-scope [hidden] {
      display: none !important;
    }.tool-setup-scope .app {
      min-height: 100vh;
      min-height: 100dvh;
      max-width: 420px;
      margin: 0 auto;
      background: var(--background);
    }.tool-setup-scope .header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 64px;
      padding: calc(6px + env(safe-area-inset-top, 0px)) 54px 10px;
      background: #fff;
    }.tool-setup-scope .header h1 {
      margin: 0;
      color: var(--green);
      font-size: 19px;
      font-weight: 650;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }.tool-setup-scope .back-button {
      position: absolute;
      left: 5px;
      bottom: 10px;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--green);
      font-size: 31px;
      line-height: 1;
    }.tool-setup-scope main {
      padding: 12px 20px calc(200px + env(safe-area-inset-bottom, 0px));
    }.tool-setup-scope .info-card {
      display: flex;
      align-items: center;
      gap: 11px;
      min-height: 76px;
      padding: 13px;
      border: 1px solid #e4f3ec;
      border-radius: 15px;
      background: linear-gradient(115deg, #e1f5ec 0%, #f0faf5 100%);
      box-shadow: var(--shadow);
    }.tool-setup-scope .app-icon {
      display: grid;
      flex: 0 0 46px;
      place-items: center;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: linear-gradient(145deg, #10936c, #05704e);
      color: white;
      font-size: 27px;
      font-weight: 600;
      box-shadow: 0 3px 7px rgba(15, 138, 95, 0.18);
    }.tool-setup-scope .info-copy {
      min-width: 0;
    }.tool-setup-scope .info-copy h2 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.35;
    }.tool-setup-scope .info-copy p {
      margin: 0;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.5;
    }.tool-setup-scope .info-copy .setup-mode {
      margin-bottom: 2px;
      color: var(--green);
      font-size: 11px;
      font-weight: 650;
    }.tool-setup-scope .steps-card {
      margin-top: 13px;
      padding: 7px 15px;
      border: 1px solid #f0f2f1;
      border-radius: 15px;
      background: #fff;
      box-shadow: var(--shadow);
    }.tool-setup-scope .steps-list {
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: setup-step;
    }.tool-setup-scope .step {
      position: relative;
      min-height: 48px;
      padding: 15px 0 13px 32px;
      counter-increment: setup-step;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.55;
    }.tool-setup-scope .step::before {
      content: counter(setup-step);
      position: absolute;
      top: 14px;
      left: 0;
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border: 1px solid #d4e9e1;
      border-radius: 50%;
      background: var(--green-light);
      color: #5a9582;
      font-size: 10px;
      font-weight: 600;
    }.tool-setup-scope .step:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      left: 32px;
      height: 1px;
      background: var(--divider);
    }.tool-setup-scope .text-link {
      color: var(--green);
      font-style: italic;
      text-decoration: underline;
      text-underline-offset: 2px;
    }.tool-setup-scope .download-text-link {
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--green-dark);
      font-weight: 800;
    }.tool-setup-scope .teaching-link {
      display: inline-block;
      margin-top: 3px;
    }.tool-setup-scope .download-panel {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition: grid-template-rows 280ms ease, opacity 220ms ease;
    }.tool-setup-scope .download-panel.is-open {
      grid-template-rows: 1fr;
      opacity: 1;
    }.tool-setup-scope .download-panel-inner {
      min-height: 0;
      overflow: hidden;
    }.tool-setup-scope .download-heading {
      margin-top: 5px;
      line-height: 1.6;
    }.tool-setup-scope .download-percentage {
      display: block;
      color: var(--green);
      font-style: italic;
      text-decoration: underline;
    }.tool-setup-scope .download-percentage.is-complete {
      color: #7e8783;
      font-size: 10px;
      font-style: normal;
      text-decoration: none;
    }.tool-setup-scope .download-product {
      display: block;
    }.tool-setup-scope .progress-box {
      margin: 8px 0 2px;
      padding: 9px 9px 10px;
      border: 1px solid #e1eee8;
      border-radius: 4px;
      background: linear-gradient(180deg, #fcfefd, #f1f8f5);
    }.tool-setup-scope .status-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 11px;
      font-size: 9px;
      line-height: 1.5;
    }.tool-setup-scope .status-label {
      color: var(--green);
    }.tool-setup-scope .status-value {
      text-align: right;
    }.tool-setup-scope .progress-track {
      height: 6px;
      overflow: hidden;
      border-radius: 8px;
      background: #dce9e3;
    }.tool-setup-scope .progress-fill {
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background: var(--green);
      transition: width 80ms linear;
    }.tool-setup-scope .progress-fill.is-complete {
      background: var(--green-dark);
    }.tool-setup-scope .install-button, .tool-setup-scope .submit-button {
      border: 0;
      border-radius: 999px;
      background: var(--green);
      color: #fff;
      font-weight: 600;
      transition: background 160ms ease, transform 160ms ease;
    }.tool-setup-scope .install-button:hover, .tool-setup-scope .submit-button:hover {
      background: var(--green-dark);
    }.tool-setup-scope .install-button:active, .tool-setup-scope .submit-button:active {
      transform: scale(0.985);
    }.tool-setup-scope .install-button {
      width: 100%;
      min-height: 35px;
      margin-top: 12px;
      font-size: 12px;
    }.tool-setup-scope .install-button:disabled {
      cursor: not-allowed;
      background: #a9bdb5;
      opacity: 0.72;
      transform: none;
    }.tool-setup-scope .tutorial-overlay {
      position: fixed;
      z-index: 80;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(15, 25, 20, 0.72);
    }.tool-setup-scope .tutorial-dialog {
      display: flex;
      flex-direction: column;
      width: min(390px, 100%);
      max-height: min(760px, calc(100dvh - 32px));
      overflow: hidden;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
    }.tool-setup-scope .tutorial-header {
      display: grid;
      grid-template-columns: 42px 1fr 42px;
      align-items: center;
      min-height: 68px;
      padding: 8px 10px;
      border-bottom: 1px solid var(--divider);
      text-align: center;
    }.tool-setup-scope .tutorial-header h2 {
      margin: 0;
      color: var(--green-dark);
      font-size: 17px;
      line-height: 1.3;
    }.tool-setup-scope .tutorial-header p {
      margin: 3px 0 0;
      color: var(--muted);
      font-size: 11px;
    }.tool-setup-scope .tutorial-icon-button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--green-light);
      color: var(--green-dark);
    }.tool-setup-scope .tutorial-header-spacer {
      width: 38px;
    }.tool-setup-scope .tutorial-image-wrap {
      display: grid;
      flex: 1 1 auto;
      place-items: center;
      min-height: 260px;
      overflow: auto;
      padding: 12px;
      background: #f3f6f4;
    }.tool-setup-scope .tutorial-image {
      display: block;
      width: 100%;
      height: auto;
      max-height: calc(100dvh - 210px);
      object-fit: contain;
    }.tool-setup-scope .tutorial-empty {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      padding: 32px 20px;
      color: var(--text);
      text-align: center;
    }.tool-setup-scope .tutorial-empty strong {
      color: var(--green-dark);
      font-size: 18px;
    }.tool-setup-scope .tutorial-empty span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }.tool-setup-scope .tutorial-dots {
      display: flex;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px 0;
      background: #fff;
    }.tool-setup-scope .tutorial-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #cbd8d2;
    }.tool-setup-scope .tutorial-dots span.is-active {
      width: 20px;
      border-radius: 5px;
      background: var(--green);
    }.tool-setup-scope .tutorial-footer {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 10px;
      padding: 12px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      background: #fff;
    }.tool-setup-scope .tutorial-back, .tool-setup-scope .tutorial-next {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-height: 46px;
      border-radius: 23px;
      font-size: 13px;
      font-weight: 650;
    }.tool-setup-scope .tutorial-back {
      border: 1px solid #dbe6e1;
      background: #fff;
      color: var(--green-dark);
    }.tool-setup-scope .tutorial-next {
      border: 0;
      background: var(--green);
      color: #fff;
    }.tool-setup-scope .tutorial-back:disabled, .tool-setup-scope .tutorial-next:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }.tool-setup-scope .notice-card {
      margin-top: 13px;
      padding: 13px 14px;
      border: 1px solid #ecefed;
      border-radius: 13px;
      background: #fafbfb;
      box-shadow: var(--shadow);
    }.tool-setup-scope .notice-card h2 {
      margin: 0 0 5px;
      color: #7d8883;
      font-size: 12px;
      font-weight: 650;
    }.tool-setup-scope .notice-card p {
      margin: 0;
      color: #969d99;
      font-size: 10px;
      line-height: 1.65;
    }.tool-setup-scope .bottom-bar {
      position: fixed;
      z-index: 11;
      bottom: calc(86px + env(safe-area-inset-bottom, 0px));
      left: 50%;
      width: 100%;
      max-width: 420px;
      padding: 18px 42px calc(20px + env(safe-area-inset-bottom, 0px));
      transform: translateX(-50%);
      background: linear-gradient(
        180deg,
        rgba(245, 246, 250, 0),
        var(--background) 20%
      );
    }.tool-setup-scope .submit-button {
      width: 100%;
      min-height: 47px;
      font-size: 16px;
    }.tool-setup-scope .toast {
      position: fixed;
      z-index: 20;
      top: 50%;
      left: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: min(360px, calc(100vw - 48px));
      padding: 15px 20px;
      border-radius: 10px;
      background: rgba(22, 29, 26, 0.88);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
      color: #fff;
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, -45%) scale(0.96);
      transition: opacity 220ms ease, transform 220ms ease;
    }.tool-setup-scope .toast.is-visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }.tool-setup-scope .toast-check {
      font-size: 49px;
      line-height: 1;
    }.tool-setup-scope .toast-label {
      font-size: 14px;
      font-weight: 500;
    }.tool-setup-scope .message-dialog {
      width: min(330px, calc(100% - 40px));
      padding: 24px;
      border: 0;
      border-radius: 18px;
      color: var(--text);
      box-shadow: 0 12px 50px rgba(0, 0, 0, 0.2);
    }.tool-setup-scope .message-dialog::backdrop {
      background: rgba(15, 25, 20, 0.4);
    }.tool-setup-scope .message-dialog h2 {
      margin: 0 0 10px;
      font-size: 18px;
    }.tool-setup-scope .message-dialog p {
      margin: 0 0 20px;
      color: #68726d;
      font-size: 13px;
      line-height: 1.65;
    }.tool-setup-scope .message-dialog button {
      width: 100%;
      min-height: 42px;
      border: 0;
      border-radius: 22px;
      background: var(--green);
      color: #fff;
      font-weight: 600;
    }@media (min-width: 480px) {.tool-setup-scope .tool-setup-html {
        background: #e9edea;
      }.tool-setup-scope .app {
        box-shadow: 0 0 35px rgba(25, 45, 35, 0.08);
      }}@media (max-width: 350px) {.tool-setup-scope main {
        padding-right: 14px;
        padding-left: 14px;
      }.tool-setup-scope .info-card {
        gap: 9px;
      }.tool-setup-scope .info-copy h2 {
        font-size: 13px;
      }.tool-setup-scope .info-copy p {
        font-size: 9px;
      }.tool-setup-scope .step {
        font-size: 11px;
      }}@media (prefers-reduced-motion: reduce) {.tool-setup-scope *, .tool-setup-scope *::before, .tool-setup-scope *::after {
        transition: none !important;
      }}
  
`;
