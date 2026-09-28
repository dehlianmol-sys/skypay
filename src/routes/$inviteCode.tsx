import { createFileRoute } from "@tanstack/react-router";

import Landing from "@/pages/Landing";
import { storeRefCode } from "@/lib/referral";

/** Invite links: https://install.skypaytop.cyou/<code> open the APK download page. */
export const Route = createFileRoute("/$inviteCode")({
  ssr: false,
  beforeLoad: ({ params }) => {
    if (typeof window !== "undefined") storeRefCode(params.inviteCode);
  },
  head: () => ({
    meta: [
      { title: "Download Skypay With Your Invite" },
      { name: "description", content: "You were invited to Skypay. Download the app and register with your invite code." },
      { property: "og:title", content: "Download Skypay With Your Invite" },
      { property: "og:description", content: "Download Skypay and register with your invite code." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
    ],
  }),
  component: Landing,
});
