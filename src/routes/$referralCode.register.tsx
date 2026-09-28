import { createFileRoute } from "@tanstack/react-router";

import { Navigate } from "@/lib/router-compat";
import { REF_CODE_KEY } from "@/lib/agents";

/**
 * Legacy agent invitation links now lead straight to the APK download page.
 */
export const Route = createFileRoute("/$referralCode/register")({
  ssr: false,
  beforeLoad: ({ params }) => {
    const code = (params.referralCode ?? "").trim();
    if (code && typeof window !== "undefined") {
      try {
        localStorage.setItem(REF_CODE_KEY, code);
      } catch {
        /* storage unavailable — the URL param below still applies the code */
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Download Skypay With Your Invite" },
      {
        name: "description",
        content:
          "Download the Skypay app from your invitation link and register inside the app.",
      },
      { property: "og:title", content: "Download Skypay With Your Invite" },
      {
        property: "og:description",
        content: "Download Skypay and use your invitation code when registering in the app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferralDownload,
});

function ReferralDownload() {
  return <Navigate to="/download" replace />;
}
