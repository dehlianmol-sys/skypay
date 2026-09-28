export const css = `
    :root {
      color-scheme: light;
      font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: min(calc(100vw / 22.5), 21.333333px);
      --background: #F4F7FA;
      --green: #209d60;
      --dark-green: #0d8e60;
      --muted-green: #94cdb9;
      --text: #141b2a;
      --secondary: #6b7280;
      --shadow: 0 .5rem .875rem rgba(31, 49, 43, .065);
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--background); color: var(--text); -webkit-font-smoothing: antialiased; }
    button { font: inherit; -webkit-tap-highlight-color: transparent; }
    button:not(:disabled) { cursor: pointer; }
    button:focus-visible, [tabindex="0"]:focus-visible { outline: 2px solid var(--dark-green); outline-offset: 4px; }
    button:disabled { cursor: default; opacity: 1; }
    [hidden] { display: none !important; }
    .app { width: 100%; max-width: 480px; min-height: 100svh; margin-inline: auto; background: var(--background); }
    .app-header { padding-top: env(safe-area-inset-top, 0px); background: #fff; }
    .navigation { height: 2.708333rem; position: relative; display: flex; align-items: center; justify-content: center; }
    h1 { margin: 0; color: #0a9e64; font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 1.25rem; line-height: 1.5; font-weight: 700; }
    .back { position: absolute; left: .5rem; top: 50%; transform: translateY(-50%); width: 1.875rem; height: 2.75rem; padding: 0; border: 0; background: none; color: var(--dark-green); display: grid; place-items: center; }
    .back svg { width: 1.5rem; height: 1.5rem; }
    main { padding: .625rem 1.75rem 2.75rem; }
    .subtitle { margin: 0; text-align: center; color: var(--secondary); font-size: .791667rem; line-height: 1.125rem; font-weight: 400; }
    .tabs { display: flex; height: 2.125rem; margin: 1.3125rem 0 1rem; padding: .208333rem .270833rem; gap: .333333rem; border: .041667rem solid #cce9dc; border-radius: 3rem; background: #EAF5EE; }
    .tab { flex: 1; min-width: 0; padding: 0; border: 0; border-radius: 2rem; position: relative; background: transparent; color: #168051; font-size: .6875rem; line-height: 1.1; font-weight: 600; white-space: nowrap; transition: color 150ms, background 150ms, box-shadow 150ms; }
    .tab[aria-selected="true"] { color: var(--green); background: #fff; box-shadow: 0 .25rem .6rem rgba(39, 71, 56, .12), 0 .04rem .04rem rgba(39, 71, 56, .04); }
    .task-list { display: grid; gap: .791667rem; }
    .task-card, .rules-panel { background: #fff; border: 0; border-radius: 12px; box-shadow: inset 0 0 0 .041667rem #e5f2ec, var(--shadow); }
    .task-card { padding: .854167rem 1.229167rem .791667rem; }
    .card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; min-height: 1.25rem; }
    .tag { display: inline-flex; align-items: center; gap: .25rem; padding-left: .1875rem; color: #8dcc69; font-size: .666667rem; line-height: 1.25rem; font-weight: 700; white-space: nowrap; transform: translateY(-.1875rem); }
    .tag::before { content: ""; width: .166667rem; height: .166667rem; flex-shrink: 0; background: currentColor; border-radius: 50%; }
    .tag-invite { color: #d8ceff; }
    .tag-daily { color: #ffc107; }
    .progress { display: flex; justify-content: flex-end; align-items: center; gap: .3125rem; color: var(--secondary); font-size: .625rem; white-space: nowrap; font-weight: 400; transform: translateY(-.125rem); }
    .progress-track { position: relative; overflow: hidden; width: 6.0625rem; height: .5625rem; border-radius: 1rem; background: #eaf7f1; box-shadow: inset 0 0 0 .041667rem #d0eadf; }
    .progress-fill { position: absolute; inset: 0 auto 0 0; width: 0; border-radius: 1rem; background: linear-gradient(90deg, #8dcc69, #0f9d6c); transition: width .35s ease; }
    .progress-fill.is-complete { background: linear-gradient(90deg, #0f9d6c, #0b7c55); }
    h2 { margin: .3125rem 0 0; font-size: .8rem; line-height: 1.0625rem; font-weight: 700; letter-spacing: .004em; }
    .description { margin: .125rem 0 0; color: var(--secondary); font-size: .75rem; line-height: 1.0625rem; letter-spacing: -.009em; font-weight: 400; }
    .card-bottom { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-top: .5625rem; min-height: 1.1875rem; }
    .reward { display: inline-flex; align-items: center; gap: .3125rem; font-size: .895833rem; font-weight: 600; line-height: 1.1875rem; }
    .coin { width: 1.041667rem; height: 1.041667rem; flex-shrink: 0; color: var(--dark-green); }
    .action { display: inline-grid; place-items: center; min-width: 4.270833rem; min-height: 1.1875rem; padding: .104167rem .5rem; border: 0; border-radius: 2rem; color: #fff; background: var(--dark-green); font-size: .625rem; line-height: .979167rem; font-weight: 700; white-space: nowrap; }
    .action-muted { background: var(--muted-green); }
    .action-bind { background: var(--green); }
    .action-raised { box-shadow: 0 .270833rem .5625rem rgba(13, 142, 96, .2); }
    .action:not(:disabled) { position: relative; }
    /* Enlarge touch targets without changing the compact reference geometry. */
    .back::after, .tab::after, .action:not(:disabled)::after { content: ""; position: absolute; top: 50%; left: 50%; width: max(100%, 44px); height: max(100%, 44px); transform: translate(-50%, -50%); }
    .action:not(:disabled):active { transform: translateY(1px); }
    .invite-description { margin-top: .3125rem; }
    .invite-card .card-bottom { margin-top: .4375rem; }
    .daily-card h2 { margin-top: -.125rem; }
    .daily-card .card-bottom { margin-top: .5625rem; }
    .rules-toggle { display: flex; align-items: center; justify-content: center; gap: .375rem; position: relative; margin: 0 auto; padding: 0; min-height: .958333rem; border: 0; background: none; color: var(--dark-green); font-size: .708333rem; line-height: .958333rem; font-weight: 600; }
    .rules-toggle::after { content: ""; position: absolute; top: 50%; left: -.375rem; right: -.375rem; height: max(100%, 44px); transform: translateY(-50%); }
    .chevron { width: .625rem; height: .625rem; color: #c9b895; transition: transform 280ms ease; }
    .rules-toggle[aria-expanded="true"] .chevron { transform: rotate(180deg); }
    /* Keep the rule panel separate, as in the references, while animating its height. */
    .rules-reveal { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms ease, opacity 200ms ease; filter: drop-shadow(0 .5rem .6rem rgba(31, 49, 43, .055)); }
    .rules-reveal.is-open { grid-template-rows: 1fr; opacity: 1; }
    .rules-clip { min-height: 0; overflow: hidden; }
    .rules-panel { margin-top: .208333rem; padding: .854167rem 1.041667rem 1.041667rem; box-shadow: inset 0 0 0 .041667rem #e5f2ec; }
    .rules-panel h3 { margin: 0 0 .75rem; color: #087d50; font-size: .625rem; line-height: .875rem; font-weight: 700; }
    .timeline { display: grid; grid-template-columns: 4.4375rem minmax(0, 1fr); row-gap: .375rem; font-size: .625rem; line-height: .8125rem; }
    .timeline-row { display: contents; }
    .timeline-label { color: var(--secondary); }
    .timeline-values { display: flex; justify-content: space-between; white-space: nowrap; letter-spacing: -.018em; }
    .timeline-rail { grid-column: 2; height: .625rem; display: flex; align-items: center; justify-content: space-between; position: relative; }
    .timeline-rail::before { content: ""; position: absolute; left: 0; right: 0; height: .0625rem; background: #a3d4c3; }
    .timeline-dot { position: relative; z-index: 1; width: .645833rem; height: .645833rem; margin-inline: -.322917rem; border-radius: 50%; background: var(--dark-green); box-shadow: 0 .25rem .416667rem rgba(13, 142, 96, .18); }
    .timeline .bonus-label, .timeline .bonuses { margin-top: -.25rem; }
    .home-indicator { position: fixed; z-index: 5; left: 50%; bottom: 0; transform: translateX(-50%); width: min(100%, 480px); height: max(.9375rem, env(safe-area-inset-bottom)); background: #fff; pointer-events: none; }
    .home-indicator::after { content: ""; position: absolute; width: 39.7%; height: .208333rem; top: .375rem; left: 30.15%; background: #696969; border-radius: 1rem; }
    .toast { position: fixed; z-index: 10; top: 50%; left: 50%; width: min(360px, calc(100vw - 48px)); transform: translate(-50%, calc(-50% + .5rem)); padding: .75rem 1rem; border-radius: .625rem; background: #183c2e; color: white; font-size: .75rem; line-height: 1.4; text-align: center; box-shadow: 0 .25rem 1rem #0002; opacity: 0; visibility: hidden; transition: opacity 180ms, transform 180ms, visibility 180ms; }
    .toast.is-visible { opacity: 1; visibility: visible; transform: translate(-50%, -50%); }
    .svg-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
    @media (min-width: 600px) { .app { box-shadow: 0 0 3rem rgba(40, 58, 51, .045); } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; scroll-behavior: auto !important; } }
  `;
