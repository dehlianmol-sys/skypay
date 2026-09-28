/* My Asset screen — supplied design, scoped to .my-app (bottom nav comes from the shared app nav). */
export const css = `
.my-app {
  --green: #0F8A5F;
  --ink: #1C1C1E;
  --label: #1F2937;
  --mint: #E6F4EA;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  padding: calc(14px + env(safe-area-inset-top, 0px)) 8px calc(110px + env(safe-area-inset-bottom, 0px));
  color: var(--ink);
  background: #F4F7FA;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}
.my-app *, .my-app *::before, .my-app *::after { box-sizing: border-box; }
.my-app button { font: inherit; cursor: pointer; touch-action: manipulation; }
.my-app svg { display: block; flex-shrink: 0; }
.my-app .svg-library { position: absolute; width: 0; height: 0; overflow: hidden; }
.my-app .icon { fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.my-app .page-header { display: grid; place-items: center; margin-bottom: 20px; }
.my-app h1 { margin: 0; color: var(--green); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 20px; line-height: 28px; font-weight: 700; }
.my-app .asset-summary, .my-app .actions {
  background: #FFFFFF; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15,138,95,.07), 0 0 0 1px rgba(15,138,95,.04);
}
.my-app .asset-summary { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 11px; margin: 0; padding: 14px; }
.my-app .asset-stat {
  min-height: 65px; display: grid; grid-template-columns: 34px minmax(0,1fr); align-content:center;
  column-gap:9px; padding: 10px; background: #F8FAFC; border-radius: 12px;
}
.my-app .summary-icon { width: 34px; height: 34px; align-self: center; display: grid; place-items: center; border-radius: 10px; background: var(--mint); }
.my-app .summary-icon svg { width: 23px; height: 23px; stroke-width: 2; }
.my-app .deposit { color: #6386DF; }
.my-app .withdraw { color: #8B5CF6; }
.my-app .commission { color: #EAB923; }
.my-app .asset-stat dl { margin: 0; min-width: 0; }
.my-app .asset-stat dt { color: #5D6362; font-size: 13px; line-height: 18px; font-weight: 600; }
.my-app .asset-stat dd { margin: 5px 0 0; font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 16px; line-height: 20px; font-weight: 800; color: var(--ink); overflow-wrap:anywhere; }
.my-app .actions { margin-top: 14px; padding: 16px; }
.my-app .action-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px 12px; }
.my-app .action-button {
  min-width: 0; min-height: 70px; display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 0; border: 0; border-radius: 12px; background: transparent; color: var(--label);
  font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: .5px; transition: transform 150ms ease;
}
.my-app .action-icon {
  display: grid; place-items: center; width: 44px; height: 44px; border-radius: 10px; color: #0F5F43;
  background: var(--mint); box-shadow: inset 0 1px 1px rgba(24,90,62,.12); transition: background 150ms ease;
}
.my-app .action-icon svg { width: 32px; height: 32px; }
.my-app .action-button:active { transform: scale(.96); }
.my-app .version { margin: 10px 0 0; color: #9CA3AF; text-align: right; font-size: 12px; line-height: 16px; }
.my-app .logout-button {
  display: block; width: 88%; height: 42px; margin: 18px auto 0; border: 0; border-radius: 24px;
  background: var(--green); color: #FFFFFF; font-size: 15px; line-height: 22px; font-weight: 600;
  box-shadow: 0 8px 18px rgba(15,138,95,.22); transition: transform 150ms ease, background 150ms ease;
}
.my-app .logout-button:active { transform: scale(.96); background: #087A51; }
.my-app .my-toast {
  position: fixed; z-index: 20; top: 50%; left: 50%;
  width: min(360px, calc(100vw - 48px)); padding: 12px 20px; border-radius: 10px;
  background: #253B31; color: #FFFFFF; font-size: 13px; line-height: 20px; font-weight: 600; text-align: center;
  opacity: 0; transform: translate(-50%, calc(-50% + 8px)); pointer-events: none; transition: opacity 180ms ease, transform 180ms ease;
}
.my-app .my-toast.is-visible { opacity: 1; transform: translate(-50%, -50%); }
.my-logout-backdrop {
  position: fixed; inset: 0; z-index: 60; display: grid; place-items: center;
  padding: 16px; background: rgba(0,0,0,.6);
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}
.my-logout-dialog {
  position: relative; width: calc(100% - 54px); max-width: 360px; padding: 46px 20px 28px;
  border: 1px solid #DDEFE7; border-radius: 20px; background: #FFFFFF; color: #1C1C1E;
  box-shadow: 0 18px 45px rgba(13,84,58,.16); text-align: center;
}
.my-logout-dialog h2 { margin: 0; color: #0F8A5F; font-size: 22px; line-height: 29px; font-weight: 800; letter-spacing: .4px; }
.my-logout-dialog p { margin: 18px 0 0; color: #4B5563; font-size: 14px; line-height: 22px; }
.my-logout-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 30px; }
.my-logout-actions button {
  min-height: 46px; padding: 8px 12px; border: 1px solid #CFE7DB; border-radius: 30px; background: #FFFFFF;
  color: #0F8A5F; font: inherit; font-size: 17px; font-weight: 800; cursor: pointer;
  box-shadow: 0 6px 13px rgba(15,138,95,.13);
}
.my-logout-actions .confirm { border-color: #0F8A5F; background: #0F8A5F; color: #FFFFFF; }
@media (max-width: 359px) {
  .my-app .asset-summary { gap: 9px; }
  .my-app .asset-stat { grid-template-columns: 28px minmax(0,1fr); column-gap: 7px; padding: 8px 6px; }
  .my-app .asset-stat dt { font-size: 12px; }
}
`;
