export const css = `
    :root {
      --app-width: 430px;
      --nav-height: 86px;
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      --nav-green: #099D68;
      --wallet-yellow: #F3C62C;
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      min-width: 280px;
      min-height: 100vh;
      min-height: 100dvh;
      background: #F4F7FA;
      color: #1C1C1E;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    .svg-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
    .bottom-nav {
      position: fixed;
      z-index: 10;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: min(100%, var(--app-width));
      height: calc(var(--nav-height) + var(--safe-bottom));
      padding: 13px 8px calc(12px + var(--safe-bottom));
      background: #FFFFFF;
    }
    .nav-items { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; height: 100%; }
    .bottom-nav button, .bottom-nav a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    .bottom-nav button:focus-visible, .bottom-nav a:focus-visible { outline: 3px solid var(--nav-green); outline-offset: 2px; border-radius: 14px; }
    .nav-item {
      position: relative;
      isolation: isolate;
      display: flex;
      min-width: 0;
      min-height: 56px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: #737373;
      text-decoration: none;
      font-size: 12px;
      line-height: 16px;
      font-weight: 700;
      letter-spacing: .6px;
      transition: color 240ms ease;
    }
    .nav-item::before {
      content: none;
    }
    .nav-item > svg {
      display: block;
      width: 29px;
      height: 29px;
      color: #C9C9C9;
      transform: scale(1);
      transform-origin: center;
      transition: color 240ms ease, transform 380ms cubic-bezier(.34, 1.56, .64, 1);
    }
    .nav-item[aria-current="page"], .nav-item[aria-current="page"] > svg { color: var(--nav-green); }
    .nav-item[aria-current="page"] > svg { transform: scale(1.12); }
    .wallet-link { display: grid; place-items: center; min-width: 0; padding: 0; border: 0; background: transparent; cursor: pointer; font: inherit; }
    .wallet-circle {
      display: grid;
      place-items: center;
      width: 58px;
      height: 58px;
      margin-top: -5px;
      border-radius: 50%;
      background: var(--wallet-yellow);
      transition: transform 220ms cubic-bezier(.34, 1.56, .64, 1);
    }
    .wallet-link:active .wallet-circle { transform: scale(.94); }
    /* Original optical alignment and artwork colors are preserved. */
    .wallet-circle svg { display: block; width: 36px; height: 38px; transform: translateX(-1px); color: #505048; }
    @media (max-width: 374px) { .nav-item { font-size: 10px; letter-spacing: .3px; } }
    @media (prefers-reduced-motion: reduce) {
      .nav-item, .nav-item > svg, .nav-item::before, .wallet-circle { transition: none; }
    }
  `;
