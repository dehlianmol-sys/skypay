# Critical UI, performance, and splash fixes

## What will change
- Keep the loading and signed-in states in the same centered 128px dark-grey square, with the exact thin spinner/checkmark treatment and a one-second success state.
- Move the launch splash ownership to the root app shell so it runs once per full app load for 3.5 seconds and never reappears during internal navigation.
- Warm the Home and Payment screens plus their static images while the splash is visible, then reuse the browser’s in-memory module and image caches.
- Restore the full-screen notice dialog to match the supplied reference: centered artwork, exact title/body hierarchy, close control, and bottom-aligned green “I Know” button.
- Reduce navigation stalls by preventing avoidable shared-layout rerenders and keeping data refreshes in the background.

## Verification
- Open the app at mobile size and capture the splash, loading, signed-in, Home notice, and Payment navigation states.
- Navigate Payment → Home → Payment and confirm the splash does not return.
- Confirm the latest preview build and browser console have no errors.

## Scope
No new feature or business-rule changes; only the requested loading, notice, navigation performance, and splash behavior.
