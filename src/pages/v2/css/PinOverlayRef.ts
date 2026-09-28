export const css = `.pin-overlay-scope {
      color-scheme: light;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      --green: #0F8A5F;
      --gray: #4B5563;
    }.pin-overlay-scope * { box-sizing: border-box; }.pin-overlay-scope .overlay {
      position: fixed;
      z-index: 60;
      inset: 0;
      display: flex;
      overflow-y: auto;
      padding: 16px;
      background: rgba(0, 0, 0, 0.4);
    }.pin-overlay-scope .modal {
      width: 100%;
      max-width: 380px;
      margin: auto;
      padding: 24px;
      border: 0;
      border-radius: 16px;
      background: #FFFFFF;
    }.pin-overlay-scope .modal:focus { outline: none; }.pin-overlay-scope .modal[hidden] { display: none; }.pin-overlay-scope .modal-header {
      position: relative;
      display: flex;
      align-items: center;
      min-height: 24px;
      margin-bottom: 12px;
    }.pin-overlay-scope h1 {
      margin: 0;
      padding-right: 28px;
      color: var(--green);
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
    }.pin-overlay-scope button { font-family: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }.pin-overlay-scope .close {
      position: absolute;
      top: 50%;
      right: -12px;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: #6B7280;
    }.pin-overlay-scope .close::before, .pin-overlay-scope .close::after {
      content: "";
      position: absolute;
      top: 21px;
      left: 14px;
      width: 16px;
      height: 1.5px;
      background: currentColor;
      transform: rotate(45deg);
    }.pin-overlay-scope .close::after { transform: rotate(-45deg); }.pin-overlay-scope .subtitle {
      margin: 0 0 16px;
      color: var(--gray);
      font-size: 14px;
      line-height: 21px;
    }.pin-overlay-scope .pin-inputs {
      display: flex;
      justify-content: space-between;
      gap: 4px;
      direction: ltr;
    }.pin-overlay-scope .pin-inputs input {
      appearance: none;
      width: 40px;
      height: 40px;
      min-width: 0;
      padding: 0;
      border: 1.5px solid var(--green);
      border-radius: 8px;
      background: #FFFFFF;
      color: var(--gray);
      text-align: center;
      font-family: inherit;
      font-size: 20px;
      font-weight: 700;
      caret-color: var(--green);
    }.pin-overlay-scope .pin-inputs input:focus { outline: 2px solid var(--green); outline-offset: 2px; }.pin-overlay-scope button:focus-visible { outline: 2px solid var(--green); outline-offset: 3px; }.pin-overlay-scope .cancel {
      display: block;
      width: 100%;
      min-height: 44px;
      margin-top: 24px;
      padding: 12px 16px;
      border: 0;
      border-radius: 999px;
      background: #F3F4F6;
      color: var(--gray);
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
    }.pin-overlay-scope .cancel:hover { background: #E5E7EB; }@media (max-width: 339px) {.pin-overlay-scope .overlay { padding: 8px; }.pin-overlay-scope .pin-inputs { gap: 2px; }}
  
`;
