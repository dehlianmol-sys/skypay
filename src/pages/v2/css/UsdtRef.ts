export const css = `
    :root {
      color-scheme: light;
      --green: #0aa060;
      --deep-green: #108e63;
      --background: #f7f8fc;
      --mint: #ebfcf4;
      --selected: #f2fff8;
      --border: #bbe3d3;
      --muted: #686868;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      /* Scale the reference's mobile proportions, then cap the desktop column. */
      font-size: min(4.2666667vw, 18.773333px);
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    * { box-sizing: border-box; }
    body { margin: 0; color: #303030; background: var(--background); }
    button, input { font: inherit; }
    button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
    button, input, label { touch-action: manipulation; }
    button:focus-visible, input:focus-visible, label:has(input:focus-visible) {
      outline: 2px solid var(--deep-green); outline-offset: 4px;
    }
    [hidden] { display: none !important; }
    .svg-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
    .icon { display: block; width: 1.25rem; height: 1.25rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .wallet { width: 100%; max-width: 440px; min-height: 100vh; min-height: 100dvh; margin: 0 auto; }
    .header { padding-top: env(safe-area-inset-top, 0px); background: #fff; }
    .nav { position: relative; display: flex; align-items: center; justify-content: center; height: 2.75rem; }
    .page-title { margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 1.3125rem; line-height: 1; font-weight: 700; letter-spacing: .015em; }
    .page-title:focus { outline: none; }
    .back { position: absolute; left: .3125rem; top: 0; display: grid; place-items: center; width: 2.4375rem; height: 100%; padding: 0; border: 0; background: none; color: var(--deep-green); }
    .back .icon { width: 1.5rem; height: 1.5rem; stroke-width: 2.1; }
    .deposit-page { padding: 1.125rem .75rem 3rem; }
    .instructions { padding: 1.25rem 1.5rem 1.75rem; border-radius: 0 1rem 0 0; background: var(--mint); }
    .instructions ol { margin: 0; padding: 0; list-style: none; counter-reset: step; font-size: .8375rem; line-height: 1.03125rem; }
    .instructions li { counter-increment: step; }
    .instructions li::before { content: counter(step) "."; margin-right: .375rem; color: var(--green); font-weight: 700; }
    .deposit-form { margin: 0; }
    .form-card { position: relative; margin-top: -.75rem; padding: 1.333333rem; background: #fff; border-radius: .75rem; box-shadow: 0 1px 2px rgb(22 72 48 / 1%); }
    .calculator { padding: .375rem .5625rem .4375rem; border: .125rem solid var(--border); border-radius: .5625rem; }
    .calculator-heading { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin: 0 0 .1875rem .125rem; }
    .calculator-heading h2 { margin: 0; color: var(--muted); font-size: .78125rem; line-height: 1.0625rem; font-weight: 700; }
    .ratio { color: var(--green); font-size: .6875rem; line-height: 1.0625rem; white-space: nowrap; }
    .amount-field { display: flex; align-items: center; gap: .5625rem; }
    .currency { flex: 0 0 4.1875rem; display: grid; place-items: center; height: 1.75rem; border-radius: .375rem; background: var(--green); color: #fff; font-size: .875rem; font-weight: 700; }
    .amount-input { display: block; width: 100%; min-width: 0; height: 1.75rem; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; color: #353535; font-size: 1rem; line-height: 1.75rem; caret-color: #353535; appearance: textfield; }
    .amount-input::placeholder { color: #ddd; opacity: 1; }
    .amount-input:focus { outline: none; }
    .calculator:has(.amount-input:focus-visible) { border-color: #a8d9c5; }
    .amount-input::-webkit-inner-spin-button, .amount-input::-webkit-outer-spin-button { margin: 0; -webkit-appearance: none; }
    .estimates { display: grid; grid-template-columns: 1fr 1fr; gap: .375rem; margin-top: .375rem; }
    .estimate { display: flex; min-width: 0; min-height: 3.5rem; flex-direction: column; justify-content: center; align-items: center; padding: .5rem .25rem; border: .125rem solid var(--border); border-radius: .5625rem; font-size: .78125rem; line-height: 1.0625rem; font-weight: 700; text-align: center; }
    .estimate-label { color: var(--muted); }
    .estimate output { max-width: 100%; color: var(--green); overflow-wrap: anywhere; }
    .chains { min-width: 0; margin: .875rem 0 0; padding: 0; border: 0; }
    .chains legend { width: 100%; margin-bottom: .5625rem; padding: 0; color: var(--muted); font-size: .84375rem; line-height: 1rem; font-weight: 700; }
    .chain-option { display: flex; position: relative; align-items: center; gap: .5625rem; min-height: 3.4375rem; padding: .5625rem .6875rem; border: .125rem solid #cfece0; border-radius: .5625rem; background: #fff; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .chain-option + .chain-option { margin-top: .5rem; }
    .chain-option:has(input:checked) { border-color: var(--green); background: var(--selected); }
    .chain-icon-frame { flex: 0 0 auto; width: 1.6875rem; height: 1.6875rem; overflow: hidden; }
    .chain-icon { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.13); }
    .chain-text { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: .125rem; }
    .chain-name { font-size: .9375rem; line-height: 1.0625rem; font-weight: 700; }
    .chain-description { color: #919191; font-size: .6875rem; line-height: .875rem; }
    .chain-radio { display: grid; flex: 0 0 auto; place-content: center; width: 1.0625rem; height: 1.0625rem; margin: 0; border: .125rem solid #a5dcc6; border-radius: 50%; background: transparent; appearance: none; -webkit-appearance: none; cursor: pointer; }
    .chain-radio::before { content: ""; width: .5rem; height: .5rem; border-radius: 50%; background: var(--green); transform: scale(0); }
    .chain-radio:checked { border-color: var(--green); }
    .chain-radio:checked::before { transform: scale(1); }
    .deposit-footer { margin: 1.5rem 1.125rem 0; }
    .warning { margin: 0; color: var(--green); font-size: .84375rem; line-height: 1.4375rem; }
    .warning .icon { display: inline-block; width: .8125rem; height: .8125rem; margin-right: .125rem; vertical-align: -.0625rem; stroke-width: 1.5; }
    .deposit-button { display: block; width: 100%; min-height: 3rem; margin-top: .875rem; padding: .625rem 1rem; border: 0; border-radius: 999px; background: var(--green); color: #fff; font-size: 1.1875rem; line-height: 1.75rem; font-weight: 700; }
    .deposit-button.is-muted, .deposit-button:disabled { opacity: .5; }
    .deposit-button:disabled { cursor: wait; }
    .deposit-button:active:not(:disabled) { background: #098d55; }
    .order-page { padding: .875rem 1.6875rem 3rem; }
    .order-card { overflow: hidden; border: 1px solid #d2ece1; border-radius: .9375rem; background: #eaf8f2; box-shadow: 0 .375rem 1rem rgb(26 63 48 / 7%); }
    .order-amount { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: .5rem; min-height: 3.9375rem; margin: 0; padding: .9375rem .625rem .5rem; color: var(--deep-green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 2rem; line-height: 2.5rem; font-weight: 800; letter-spacing: .0125em; }
    .order-amount span { min-width: 0; color: #0b6c48; overflow-wrap: anywhere; }
    .order-details { margin: 0; padding: .875rem 1.0625rem .375rem; border-radius: .875rem .875rem 0 0; background: #fff; }
    .order-row { display: flex; align-items: center; gap: .4375rem; min-height: 3.4375rem; border-bottom: 1px solid #d4e9e3; }
    .order-row dt { flex: 0 0 auto; color: #65768e; font-size: 1rem; line-height: 1.25rem; }
    .order-row dd { display: flex; align-items: center; justify-content: flex-end; gap: .5rem; flex: 1; min-width: 0; margin: 0; color: #151d2c; font-size: 1rem; line-height: 1.25rem; }
    .order-row dd > span, .order-row time { min-width: 0; overflow-wrap: anywhere; }
    .order-row:last-child { min-height: 2.9375rem; border: 0; }
    .address-row { position: relative; display: block; min-height: 4.6875rem; padding: .375rem 0; }
    .address-row dt { padding-right: 1.5rem; }
    .address-row dd { display: block; margin-top: .25rem; font-size: .9375rem; line-height: 1.1875rem; text-align: center; overflow-wrap: anywhere; }
    .address-row .copy-button { position: absolute; top: .375rem; right: 0; }
    .copy-button { display: grid; flex: 0 0 1.125rem; place-items: center; position: relative; width: 1.125rem; height: 1.25rem; padding: 0; border: 0; color: var(--deep-green); background: none; }
    .copy-button::after { content: ""; position: absolute; inset: -.5rem -.1875rem; }
    .copy-button .icon { width: .9375rem; height: .9375rem; stroke-width: 1.7; }
    .type-value { display: inline-flex; align-items: center; gap: .3125rem; }
    .type-value img { width: 1.0625rem; height: 1.0625rem; object-fit: contain; }
    .chain-badge { display: inline-block; padding: .25rem .6875rem; border-radius: 999px; background: var(--deep-green); color: #fff; font-size: .9375rem; line-height: 1rem; font-weight: 700; white-space: nowrap; }
    .chain-badge.bsc { background: #f1b000; }
    .order-number dd { justify-content: space-between; }
    .order-number dd > span { flex: 1; text-align: center; font-size: .75rem; line-height: 1rem; font-weight: 700; overflow-wrap: anywhere; }
    .order-row time { white-space: nowrap; }
    .toast { position: fixed; z-index: 40; top: 50%; left: 50%; width: max-content; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); padding: .625rem; border-radius: .625rem; background: rgb(0 0 0 / 70%); color: #fff; font-size: .975rem; line-height: 1.3; text-align: center; pointer-events: none; }
    .loading-layer { position: fixed; z-index: 30; inset: 0; display: grid; place-items: center; }
    .loading-layer:focus { outline: none; }
    .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.0625rem; width: 8.5rem; height: 6.875rem; transform: translateY(.875rem); border-radius: .625rem; background: rgb(0 0 0 / 70%); color: #fff; font-size: 1rem; line-height: 1.3125rem; }
    .spinner { width: 1.6875rem; height: 1.6875rem; border: .1rem solid rgb(255 255 255 / 30%); border-right-color: #fff; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 1.8s; } }
    @media (min-width: 441px) { body { background: #eef1f5; } .wallet { background: var(--background); box-shadow: 0 0 2rem rgb(23 50 38 / 4%); } }
  `;
