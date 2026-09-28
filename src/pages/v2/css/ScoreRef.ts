/* Score / balance details screen — supplied design, scoped to .score-app. */
export const css = `
.score-app {
  --green: #0F8A5F;
  --muted: #9CA3AF;
  --divider: #E5EFEB;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  color: #1F2937;
  background: #F4F7FA;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}
.score-app *, .score-app *::before, .score-app *::after { box-sizing: border-box; }
.score-app button { font: inherit; cursor: pointer; }
.score-app [hidden] { display: none !important; }
.score-app .header { padding-top: env(safe-area-inset-top, 0px); background: #FFFFFF; }
.score-app .navigation { position: relative; display: grid; place-items: center; height: 48px; }
.score-app .page-title { margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 20px; line-height: 28px; font-weight: 700; }
.score-app .back-button {
  position: absolute; inset-inline-start: 4px; top: 2px; display: grid; place-items: center;
  width: 44px; height: 44px; padding: 10px; border: 0; border-radius: 12px; color: var(--green); background: transparent;
}
.score-app .back-button svg { width: 24px; height: 24px; }
.score-app .back-button:active { background: #ECF8F2; }
.score-app main { display: grid; gap: 16px; padding: 12px 22px max(90px, env(safe-area-inset-bottom, 0px)); }
.score-app .card { min-width: 0; border: 1px solid #E7F2EC; border-radius: 16px; background: #FFFFFF; box-shadow: 0 4px 16px rgba(15,138,95,0.06); }
.score-app .score-card { padding: 14px 20px 20px; border-color: #D5EFE3; }
.score-app .score-overview { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.score-app .score-label { margin: 0; color: #4B5563; font-size: 14px; line-height: 24px; }
.score-app .score-balance {
  margin: 6px 0 0; color: var(--green); font-size: 32px; line-height: 42px; font-weight: 800;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-variant-numeric: tabular-nums; letter-spacing: 0.2px;
}
.score-app .score-change { display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; gap: 8px; }
.score-app .change-label { color: var(--green); font-size: 18px; line-height: 24px; font-weight: 700; }
.score-app .coin-bags { display: block; width: 64px; height: 36px; }
.score-app .score-tabs {
  display: flex; align-items: stretch; justify-content: space-between; gap: 12px; height: 60px; margin-top: 8px;
  padding: 5px 14px; border-radius: 13px;
  background: linear-gradient(135deg, #12A06E 0%, #0F8A5F 100%);
  box-shadow: 0 6px 16px rgba(15,138,95,0.22);
}
.score-app .score-tab {
  min-height: 44px; padding: 0 20px; border: 0; border-radius: 10px; color: #FFFFFF; background: transparent;
  font-size: 19px; line-height: 28px; font-weight: 700; white-space: nowrap; transition: background-color 150ms ease;
}
.score-app .score-tab[aria-selected="true"] { background: #076C48; box-shadow: inset 0 1px 3px rgba(0,0,0,0.12); }
.score-app .history-card { padding: 14px; }
.score-app .history-month { margin: 0; padding: 0 0 12px; border-bottom: 1px solid var(--divider); color: var(--green); font-size: 15px; line-height: 24px; font-weight: 700; }
.score-app .transaction { padding: 8px 0 10px; border-bottom: 1px solid var(--divider); }
.score-app .transaction-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.score-app .transaction-title { margin: 0; color: var(--green); font-size: 15px; line-height: 22px; font-weight: 700; }
.score-app .transaction-amount { font-size: 16px; line-height: 22px; font-weight: 800; }
.score-app .transaction-amount.credit { color: #0F8A5F; }
.score-app .transaction-amount.debit { color: #D9534F; }
.score-app .transaction-meta { display: flex; flex-wrap: wrap; gap: 2px 6px; margin: 7px 0 0; color: var(--muted); font-size: 11px; line-height: 16px; }
.score-app .transaction-meta span { white-space: nowrap; }
.score-app .history-footer { margin: 0; padding-top: 4px; color: var(--muted); text-align: center; font-size: 13px; line-height: 22px; }
.score-app .history-empty { padding-block: 14px; }
.score-app .history-empty .history-footer { padding: 0; }
@media (max-width: 359px) {
  .score-app main { padding-inline: 16px; }
  .score-app .score-card { padding-inline: 16px; }
  .score-app .score-tabs { padding-inline: 10px; gap: 8px; }
  .score-app .score-tab { padding-inline: 16px; font-size: 18px; }
}
`;
