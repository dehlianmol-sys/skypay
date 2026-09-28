export const css = `
    :root {
      --background: #f4f6f9;
      --green: #079f65;
      --yellow: #f5c52c;
      --ink: #111111;
      --muted: #738094;
      --radius: 12px;
      --nav-height: 88px;
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-weight: 400;
      color: var(--ink);
      background: #e9edf2;
      font-synthesis: none;
      -webkit-text-size-adjust: 100%;
    }
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; }
    body.modal-open { overflow: hidden; }
    button { font: inherit; font-weight: 700; color: inherit; border: 0; padding: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    button:focus-visible { outline: 3px solid #2469dc; outline-offset: 4px; }
    button:disabled { cursor: not-allowed; }
    img, svg { display: block; }
    svg { flex-shrink: 0; }
    h1, h2, p { margin: 0; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
    .svg-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
    .app-shell { width: 100%; max-width: 430px; margin: 0 auto; min-height: 100vh; background: #f4f6f9; }
    .header { display: flex; align-items: center; gap: 10px; padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px; min-height: 86px; }
    .avatar-button, .avatar { width: 48px; height: 48px; border-radius: 50%; }
    .profile { flex: 1; min-width: 0; }
    .profile h1 { font-size: 25px; font-weight: 700; line-height: 1.22; letter-spacing: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .identity { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 19px; font-weight: 400; font-variant-numeric: tabular-nums; line-height: 1.35; white-space: nowrap; color: #292929; }
    .copy-button { width: 34px; height: 28px; display: grid; place-items: center; border-radius: 18px; background: #e4e5e8; color: #138d68; position: relative; }
    .copy-button::before { content: ""; position: absolute; inset: -8px -5px; }
    .copy-button svg { width: 17px; height: 17px; }
    .bell-button { width: 44px; height: 48px; display: grid; place-items: center; color: #4b4b4b; }
    .bell-button svg { width: 30px; height: 34px; }
    .dashboard { display: flex; flex-direction: column; gap: 14px; padding: 0 16px calc(var(--nav-height) + var(--safe-bottom) + 20px); }
    .carousel { position: relative; overflow: hidden; border-radius: var(--radius); aspect-ratio: 640 / 353; background: transparent; touch-action: pan-y pinch-zoom; }
    .carousel:empty, .carousel:not(:has(.slide img[src])) { visibility: hidden; }
    .carousel-track { display: flex; height: 100%; transition: transform 450ms ease; }
    .slide { flex: 0 0 100%; min-width: 0; height: 100%; }
    .slide img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius); }
    .carousel-dots { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); display: flex; }
    .carousel-dot { width: 24px; height: 24px; display: grid; place-items: center; }
    .carousel-dot::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.5); box-shadow: 0 1px 3px #0005; }
    .carousel-dot[aria-pressed="true"]::after { background: #fff; }
    .carousel-pause:focus-visible { clip-path: none; width: auto; height: auto; margin: 0; z-index: 2; top: 10px; left: 10px; padding: 8px 12px; border-radius: 6px; color: #fff; background: #193c30; }
    .image-card { position: relative; width: 100%; overflow: hidden; border-radius: var(--radius); box-shadow: 0 7px 18px rgba(38,62,87,.05); container-type: inline-size; }
    /* Crop the transparent square export canvases, not the artwork. */
    .image-card > img { position: absolute; max-width: none; height: auto; pointer-events: none; user-select: none; }
    .balance-card { aspect-ratio: 590 / 260; background: #059962; }
    .balance-card > img { width: 108.474576%; left: -4.237288%; top: -73.076923%; }
    .balance-value { position: absolute; left: 12.2%; top: 31.5%; color: #fff; font-size: 46px; font-size: 11.9cqw; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.2; }
    .detail-button { position: absolute; left: 63.55%; top: 62.65%; width: 30.8%; height: 23%; border-radius: 999px; opacity: 0; background: transparent; }
    .balance-card:has(.detail-button:focus-visible) { outline: 3px solid #2469dc; outline-offset: 4px; }
    .stats-card { aspect-ratio: 516 / 110; background: #079b63; }
    .stats-card > img { width: 124.031008%; left: -12.015504%; top: -240.909091%; }
    .stat-value { position: absolute; top: 58%; color: #fff; font-weight: 700; font-variant-numeric: tabular-nums; font-size: 20px; font-size: 5.3cqw; line-height: 1.2; }
    .deposit-value { left: 25.6%; }
    .withdrawal-value { left: 78%; }
    .actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0 0 1px; }
    .action-button { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 9px; font-size: 17px; font-weight: 700; line-height: 1.4; }
    .action-icon { position: relative; display: grid; place-items: center; width: 64px; height: 58px; border-radius: var(--radius); background: #edfbf6; box-shadow: 0 7px 18px rgba(36,75,62,.04); color: #4b514f; }
    .action-icon svg { width: 44px; height: 44px; }
    .usdt-badge { position: absolute; left: 0; top: -6px; z-index: 1; padding: 2px 6px 3px; border-radius: 20px; background: linear-gradient(110deg,#1fc65b,#10a34d); color: #fff; box-shadow: 0 4px 9px #10a34d26; font-size: 10px; font-weight: 700; line-height: 1.3; white-space: nowrap; }
    .rewards-card { display: block; aspect-ratio: 530 / 157; background: #d6dee8; text-align: left; }
    .rewards-card > img { width: 120.754717%; left: -10.377358%; top: -161.146497%; image-rendering:auto; }
    .rank { width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:#fff;font-style:normal; }
    .silver{background:#cfd7e2}.gold{background:#ffc720}.bronze{background:#e99a59}
    .rank-avatar { width:40px;height:40px;display:grid;place-items:center;border:2px solid #d5dce7;border-radius:50%;background:#edf1f5;color:#475569;font-weight:700; }
    .transactions { border-radius: var(--radius); background: #fff; padding: 14px 14px 20px; box-shadow: 0 10px 24px rgba(38,62,87,.06); }
    .section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .section-heading h2 { font-size: 20px; line-height: 1.35; font-weight: 700; letter-spacing: -.25px; }
    .see-all { color: #3270ee; min-height: 44px; font-size: 16px; font-weight: 700; white-space: nowrap; }
    .empty-state { text-align: center; padding-top: 22px; }
    .empty-title { font-size: 17px; line-height: 1.4; font-weight: 700; }
    .empty-subtitle { margin-top: 7px; color: var(--muted); font-size: 15px; line-height: 1.5; }
    .primary-button { min-height: 44px; padding: 9px 17px; border-radius: 999px; background: var(--green); color: #fff; font-size: 17px; font-weight: 700; line-height: 1.4; box-shadow: 0 7px 15px rgba(0,153,96,.17); }
    .top-up-button { margin-top: 11px; }
    .support-button { position: fixed; z-index: 25; right: max(6px, calc((100% - 480px) / 2 + 6px)); bottom: calc(var(--nav-height) + var(--safe-bottom) + 26px); width: 72px; height: 72px; display: grid; place-items: center; overflow: hidden; border-radius: 50%; }
    /* Enlarge the artwork inside its transparent export margins. */
    .support-button img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; transform: scale(2); transform-origin: 55% 43%; }
    .toast { position: fixed; z-index: 50; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(360px, calc(100vw - 48px)); padding: 12px 18px; border-radius: 10px; background: #173e30; color: #fff; text-align: center; font-size: 14px; line-height: 1.45; box-shadow: 0 5px 20px #0002; }
    .toast:empty { display: none; }
    .app-dialog { position: fixed; inset: 0; margin: auto; padding: 20px 16px 18px; width: calc(100% - 40px); max-width: 430px; max-height: calc(100dvh - 40px); border: 0; border-radius: 16px; background: #fff; color: var(--ink); box-shadow: 0 16px 50px #14281d26; overflow-y: auto; overscroll-behavior: contain; }
    .app-dialog::backdrop { background: rgba(0,0,0,.52); }
    .dialog-title { padding-right: 36px; font-size: 22px; font-weight: 700; line-height: 1.35; }
    .dialog-title:focus { outline: none; }
    .dialog-close { position: absolute; top: 10px; right: 10px; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: #ededed; }
    .dialog-close::before { content: ""; position: absolute; inset: -5px; }
    .dialog-close svg { width: 22px; height: 22px; }
    .dialog-message { margin: 23px 0 24px; font-size: 16px; line-height: 1.7; color: #475569; white-space: pre-line; overflow-wrap: anywhere; }
    .dialog-confirm { display: block; min-width: 174px; width: 52%; margin: 0 auto; min-height: 44px; }
    .app-dialog[data-kind="reward"] { max-width: 416px; width: calc(100% - 56px); padding: 44px 28px 30px; border: 1px solid #dbece4; text-align: center; }
    .app-dialog[data-kind="reward"] .dialog-title { padding: 0; color: #0c704d; font-size: 26px; }
    .app-dialog[data-kind="reward"] .dialog-close { top: 13px; right: 13px; background: #eaf8f1; color: #68736c; border: 1px solid #d6eee3; }
    .app-dialog[data-kind="reward"] .dialog-message { margin: 18px 0 20px; }
    .app-dialog[data-kind="reward"] .dialog-confirm { width: 100%; min-width: 0; min-height: 52px; background: #0d9065; font-size: 20px; }
    .notice-dialog { width: calc(100% - 40px); max-width: 430px; max-height: calc(100dvh - 40px); padding: 20px 12px 16px; overflow: hidden; }
    .notice-dialog[open] { display: flex; flex-direction: column; gap: 14px; }
    .notice-dialog #notice-title:not(.sr-only) { flex-shrink: 0; margin: 0 42px 4px 4px; font-size: 22px; font-weight: 700; line-height: 1.3; letter-spacing: 0; }
    .notice-dialog #notice-title:focus { outline: none; }
    .notice-dialog .dialog-close { top: 10px; right: 10px; width: 36px; height: 36px; }
    .notice-image { flex: 1 1 auto; width: 100%; min-height: 0; height: auto; object-fit: contain; object-position: center; border-radius: var(--radius); }
    .notice-body-text { flex-shrink: 0; margin: -4px 6px 0; color: #33413b; font-size: 14px; font-weight: 400; line-height: 1.5; text-align: center; }
    .notice-confirm { flex-shrink: 0; width: 52%; min-width: 174px; min-height: 46px; margin-top: 0; }
    .notice-error { padding: 24px 12px; color: #475569; text-align: center; font-size: 15px; line-height: 1.6; }
    [hidden] { display: none !important; }
    @media (max-width: 359px) {
      .profile h1 { font-size: 22px; }
      .identity { font-size: 17px; gap: 6px; }
      .action-icon { width: 56px; height: 54px; }
      .action-button { font-size: 15px; }
      .section-heading h2 { font-size: 18px; }
      .empty-subtitle { font-size: 13px; }
      .dialog-title { font-size: 20px; }
    }
    @media (prefers-reduced-motion: reduce) { .carousel-track { transition: none; } }
  `;
