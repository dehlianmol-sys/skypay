export function isInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;
  const appWindow = window as Window & {
    WebToNativeInterface?: unknown;
    AppInterfaceFunction?: unknown;
  };
  const params = new URLSearchParams(window.location.search);
  return Boolean(
    appWindow.WebToNativeInterface ||
      appWindow.AppInterfaceFunction ||
      params.get('app') === '1' ||
      /;\s*wv\)/i.test(window.navigator.userAgent),
  );
}