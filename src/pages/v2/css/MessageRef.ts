export const css = `
  :root {
    --bg: #F4F7FC;
    --header-bg: #FFFFFF;
    --brand-green: #0AA060;
    --toggle-bg: #EBF8F1;
    --toggle-border: #C3E3D7;
    --toggle-active-text: #0B6C43;
    --toggle-inactive-text: #3C8969;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    width: 100%;
    min-height: 100vh;
  }

  .page {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }

  /*
    ==========================================================================
    APP ARCHITECTURE NOTE
    ==========================================================================
    hkwalletmessage.html is the central notification / message hub.
    It is reachable from TWO distinct entry points in the app:

      1. hkwallethome.html -> tapping the top-right Notification Bell icon.
      2. hkwalletmy.html   -> tapping the "Message" grid button.

    Because both entry points push this page onto the navigation stack,
    the back arrow simply calls window.history.back() so the user always
    returns to whichever screen they came from (home or my-asset).
    ==========================================================================
  */

  /* Fixed Top Header */
  .header {
    position: sticky;
    top: 0;
    z-index: 10;
    height: max(56px, calc(52px + env(safe-area-inset-top, 0px)));
    padding-top: env(safe-area-inset-top, 0px);
    background: var(--header-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }

  .back-btn {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--brand-green);
  }

  .back-btn:active {
    opacity: 0.6;
  }

  .back-btn svg {
    width: 24px;
    height: 24px;
  }

  .header-title {
    color: var(--brand-green);
    font-size: 18px;
    font-weight: 700;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    letter-spacing: 0.2px;
  }

  /* Segmented Control / Toggle Switch */
  .toggle-wrapper {
    margin: 12px clamp(16px, 8vw, 36px);
    display: flex;
    padding: 3px;
    background: var(--toggle-bg);
    border: 1px solid var(--toggle-border);
    border-radius: 30px;
    position: relative;
  }

  .toggle-btn {
    width: 50%;
    text-align: center;
    padding: 10px 0;
    border-radius: 26px;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--toggle-inactive-text);
    background: transparent;
    box-shadow: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    position: relative;
    z-index: 1;
  }

  .toggle-btn.active {
    background: #FFFFFF;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    color: var(--toggle-active-text);
    font-weight: 700;
  }

  /* Content Area (Empty State) */
  /* Backend developers: inject message list items / cards into #messageContent */
  .content-area {
    flex: 1;
    padding: 0 20px;
  }
`;
