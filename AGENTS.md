<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Show the two-step Skypay splash (spinner logo, then card reveal) only once per app open, never again when returning to Home; data preloads during it.
- Keep launch-splash ownership in the root route so internal navigation cannot remount it; warm Home and Payment modules during its fixed 3.5-second window.
- Keep the first splash phase at 1 second with an immediate bundled logo, then hold the card reveal for 2.5 seconds.
- Use AppLoading as the single full-screen loading and success treatment across authentication, user, and admin flows so feedback stays visually consistent.
- Mount sign-in success feedback at the root for one second so authentication redirects cannot remove it early.
