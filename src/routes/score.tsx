import { createFileRoute } from "@tanstack/react-router";

import ScoreV2 from "@/pages/v2/ScoreV2";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/score")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Score Details — Skypay" },
      { name: "description", content: "See your Skypay score balance with every incoming and outgoing entry." },
      { property: "og:title", content: "Score Details — Skypay" },
      { property: "og:description", content: "See your Skypay score balance with every incoming and outgoing entry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout>
        <ScoreV2 />
      </UserLayout>
    </RequireUser>
  ),
});
