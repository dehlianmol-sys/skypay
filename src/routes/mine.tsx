import { createFileRoute } from "@tanstack/react-router";

import MyV2 from "@/pages/v2/MyV2";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/mine")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Asset — Skypay" },
      { name: "description", content: "View your Skypay balance, deposits, commission and account settings." },
      { property: "og:title", content: "My Asset — Skypay" },
      { property: "og:description", content: "View your Skypay balance, deposits, commission and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><MyV2 /></UserLayout>
    </RequireUser>
  ),
});
