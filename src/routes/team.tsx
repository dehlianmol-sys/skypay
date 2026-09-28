import { createFileRoute } from "@tanstack/react-router";

import Team from "@/pages/v2/TeamV2";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/team")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Team — Skypay" },
      { name: "description", content: "Track your referrals, team size and commission earnings on Skypay." },
      { property: "og:title", content: "My Team — Skypay" },
      { property: "og:description", content: "Track your referrals, team size and commission earnings on Skypay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><Team /></UserLayout>
    </RequireUser>
  ),
});
