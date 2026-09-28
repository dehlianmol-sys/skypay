# Fix app launch ordering

## What will change
- Keep the existing one-time, root-owned 3.5-second Skypay splash unchanged: 1 second logo spinner, then 2.5 seconds card reveal.
- During that splash, keep account data, Home, Payment, and relevant images loading in the background.
- Do not mount the Home/login/admin screen until the splash has fully finished, preventing daily notices and full-screen loading feedback from appearing above or behind it.
- After the splash closes, render the resolved signed-in or signed-out screen normally; daily notice can then open on the complete Home screen.
- Preserve internal navigation behavior so returning Home never replays the splash.

## Validation
- Check a cold launch at mobile size through the full splash timeline.
- Confirm no notice or loading overlay appears during the splash, and the complete next screen appears afterward.
- Confirm navigation away from and back to Home does not replay the splash.
- Confirm the preview build remains clean.

## Technical details
- Add a root-level startup gate inside the existing data provider, rather than changing page-specific business logic.
- Keep the data provider mounted during the gate so network loading continues while page rendering is deferred.
