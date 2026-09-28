export const SIGN_IN_SUCCESS_EVENT = 'skypay:sign-in-success';

/** Keeps sign-in feedback mounted at app root while the login page redirects. */
export function showSignInSuccess(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SIGN_IN_SUCCESS_EVENT));
}