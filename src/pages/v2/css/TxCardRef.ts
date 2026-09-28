export const css = `
    .transaction-list {
      width: calc(100% + 4px);
      display: grid;
      gap: 12px;
      margin: 12px -2px 0;
    }
    .transaction-card {
      position: relative;
      width: 100%;
      isolation: isolate;
      overflow: hidden;
      background-repeat: no-repeat;
      cursor: default;
    }
    /* Hide the 1px source-image edge on the far-left of the cropped art. */
    .transaction-card::before {
      content: "";
      position: absolute;
      z-index: 4;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #fff;
      pointer-events: none;
    }
    .dynamic-field {
      position: absolute;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      z-index: 1;
      margin: 0;
      transform: translateY(-50%);
      white-space: nowrap;
      pointer-events: none;
      font-variant-numeric: tabular-nums;
    }
    .transaction-card .amount {
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #07896d;
      font-size: clamp(25px, 5vw, 32px);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.55px;
      max-width: 58%;
      overflow: visible;
    }
    .transaction-card .reward {
      color: #2864b4;
      font-size: clamp(15px, 2.8vw, 18px);
      font-weight: 500;
      line-height: 1.15;
    }
    .transaction-card .order-code {
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      color: #17292e;
      font-size: clamp(13px, 3.2vw, 16px);
      font-weight: 750;
      line-height: 1.15;
      letter-spacing: -0.15px;
      overflow: visible;
      white-space: nowrap;
    }
    .transaction-card .timestamp {
      transform: translate(-100%, -50%);
      color: #7b858d;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: clamp(14px, 2.55vw, 17px);
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: 0;
      text-align: right;
    }
    .payment-hitbox,
    .copy-hitbox {
      position: absolute;
      appearance: none;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: transparent;
      touch-action: manipulation;
    }
    .payment-hitbox {
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .copy-hitbox { z-index: 3; cursor: pointer; }
    .payment-hitbox:focus-visible,
    .copy-hitbox:focus-visible { outline: 2px solid #137bdb; outline-offset: 2px; }
    .tx-toast {
      position: fixed;
      z-index: 100;
      left: 50%;
      top: 50%;
      width: min(360px, calc(100vw - 48px));
      padding: 12px 20px;
      border-radius: 10px;
      background: #143c31;
      color: #fff;
      box-shadow: 0 6px 24px rgb(0 0 0 / 16%);
      font-size: 14px;
      text-align: center;
      pointer-events: none;
      transform: translate(-50%, -50%);
    }
    @media (max-width: 374px) {
      .transaction-card .order-code { font-size: 12px; }
    }
  `;
