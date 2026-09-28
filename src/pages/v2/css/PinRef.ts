/* PIN code screen — supplied design, scoped to .pin-app. */
export const css = `
.pin-app {
  --brand: #0F8A5F;
  --box-border: #BFE0D0;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  position: relative;
  background: #F6F9F8;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}
.pin-app *, .pin-app *::before, .pin-app *::after { box-sizing: border-box; }
.pin-app .pin-header {
  position: sticky; top: 0; z-index: 10; height: 58px; background: #FFFFFF;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.pin-app .back-btn {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  display: grid; place-items: center; width: 44px; height: 44px; background: none; border: none; padding: 0; font-size: 32px; line-height: 1; color: #0f8a5f; cursor: pointer;
}
.pin-app .header-title { color: var(--brand); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 20px; font-weight: 700; }
.pin-app .content { padding: 0 24px 48px; display: flex; flex-direction: column; align-items: center; }
.pin-app .icon-wrap { margin-top: 32px; width: 88px; height: 88px; display: grid; place-items: center; }
.pin-app .icon-wrap svg { width: 88px; height: 88px; }
.pin-app .main-title { margin-top: 12px; color: var(--brand); font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 20px; font-weight: 700; text-align: center; }
.pin-app .pin-hint { margin: 8px 0 0; color: #5D6362; font-size: 13px; line-height: 20px; text-align: center; }
.pin-app .pin-section { width: 100%; margin-top: 24px; margin-bottom:20px; display: flex; flex-direction: column; align-items: center; }
.pin-app .pin-section + .pin-section { margin-top:0; }
.pin-app .pin-label { color: var(--brand); font-size: 15px; font-weight: 700; margin-bottom: 12px; text-align: center; }
.pin-app .otp-row { display: flex; gap: 6px; width: 100%; justify-content: center; }
.pin-app .otp-input {
  width: 42px; height: 42px; border-radius: 8px; border: 1px solid var(--box-border); background: #FFFFFF;
  text-align: center; font-size: 24px; color: #000; padding: 0; outline: none; caret-color: var(--brand); font-family: inherit;
}
.pin-app .otp-input:focus { border-color: var(--brand); box-shadow: 0 0 0 2px rgba(15,138,95,0.15); }
.pin-app .btn-row { width: 100%; display: flex; gap: 16px; margin-top: 30px; }
.pin-app .btn-cancel, .pin-app .btn-confirm {
  flex: 1 1 50%; padding: 12px 0; border-radius: 25px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit;
}
.pin-app .btn-cancel { background: #EEF2F6; color: #374151; }
.pin-app .btn-confirm { background: var(--brand); color: #FFFFFF; }
.pin-app .btn-cancel:active, .pin-app .btn-confirm:active { opacity: .85; }
.pin-app .pin-toast {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(.96); max-width: 85%;
  padding: 16px 20px; border-radius: 8px; color: #FFF; font-size: 15px; font-weight: 500; text-align: center;
  line-height: 1.4; z-index: 100; opacity: 0; visibility: hidden; background: rgba(45,45,45,.95);
  transition: opacity .2s ease, transform .2s ease;
}
.pin-app .pin-toast.show { opacity: 1; visibility: visible; transform: translate(-50%,-50%) scale(1); }
.pin-app .pin-toast.success { background: var(--brand); }
`;
