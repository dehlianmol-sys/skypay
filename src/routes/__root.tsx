import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { StoreProvider } from '@/lib/store';
import { ToastProvider } from "../lib/toast";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureRefFromUrl } from "../lib/referral";
import { openExternalUrl } from "../lib/nativeBridge";
import AppLoading from "../components/AppLoading";
import { SIGN_IN_SUCCESS_EVENT } from "../lib/authFeedback";
import { isInstallHost } from "../lib/brand";
import AppSplash from "../components/AppSplash";

let launchSplashCompleted = false;

/**
 * Any unknown URL (old website links, /register variants, typos) goes straight
 * to the landing page instead of showing a "Page not found" error.
 */
function NotFoundComponent() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.replace("/");
    }
  }, []);
  return null;
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skypay" },
      { name: "description", content: "Skypay — earn money online with easy tasks." },
      { name: "author", content: "Skypay" },
      { property: "og:title", content: "Skypay" },
      { property: "og:description", content: "Skypay — earn money online with easy tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png?v=3" },
      { rel: "apple-touch-icon", sizes: "192x192", href: "/app-icon-192.png?v=3" },
      { rel: "manifest", href: "/manifest.webmanifest?v=3" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [showLaunchSplash, setShowLaunchSplash] = useState(
    () => !launchSplashCompleted && !isInstallHost(),
  );
  const [showSignInSuccess, setShowSignInSuccess] = useState(false);

  const finishLaunchSplash = useCallback(() => {
    launchSplashCompleted = true;
    setShowLaunchSplash(false);
  }, []);

  // Capture ?ref=CODE on ANY page and keep it on the device so the referral
  // survives the SMS/OTP registration steps.
  useEffect(() => {
    captureRefFromUrl();
    return router.subscribe('onResolved', () => {
      captureRefFromUrl();
    });
  }, [router]);

  useEffect(() => {
    let timer: number | undefined;
    const showSuccess = () => {
      setShowSignInSuccess(true);
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(() => setShowSignInSuccess(false), 1000);
    };
    window.addEventListener(SIGN_IN_SUCCESS_EVENT, showSuccess);
    return () => {
      window.removeEventListener(SIGN_IN_SUCCESS_EVENT, showSuccess);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  // App-wide safety net: ANY link that points outside this site is handed to
  // the real browser (Chrome on Android) instead of opening a tab inside the
  // wrapper app, which used to relaunch the app when the user pressed back.
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      if (anchor.hasAttribute('download')) return;
      let external = false;
      try {
        external = new URL(href, window.location.href).origin !== window.location.origin;
      } catch {
        return;
      }
      if (!external) return;
      event.preventDefault();
      openExternalUrl(anchor.href);
    };
    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StoreProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          {showLaunchSplash && <AppSplash onFinish={finishLaunchSplash} />}
           {showSignInSuccess && <AppLoading label="Signed in" success />}
        </StoreProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
