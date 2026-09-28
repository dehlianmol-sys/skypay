import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/v2/HomeV2";
import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import { isInstallHost } from "@/lib/brand";
import { captureRefFromUrl } from "@/lib/referral";
import UserLayout from "@/components/UserLayout";
import { Navigate } from "@/lib/router-compat";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Skypay — Earn Money Online With Easy Tasks" },
      {
        name: "description",
        content:
          "Download Skypay, complete simple tasks, get fast withdrawals and earn referral rebates every day.",
      },
      { property: "og:title", content: "Skypay — Earn Money Online With Easy Tasks" },
      {
        property: "og:description",
        content: "Download Skypay, complete simple tasks and earn referral rebates every day.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
    ],
  }),
  component: RootEntry,
});

function RootEntry() {
  // install.skypaytop.cyou always shows the APK download page.
  if (isInstallHost()) {
    captureRefFromUrl();
    return <Landing />;
  }
  return <AppEntry />;
}

function AppEntry() {
  const { currentUser, loading } = useStore();
  if (loading) return null;



  if (!currentUser) {
    const ref =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("ref");
    if (ref) return <Navigate to={`/download?ref=${encodeURIComponent(ref)}`} replace />;
    return <Login />;
  }
  if (currentUser.role !== "user") return <Navigate to="/admin" />;

  return (
    <UserLayout>
      <Home />
    </UserLayout>
  );
}
