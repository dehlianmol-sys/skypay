import { createFileRoute } from "@tanstack/react-router";

import Deposit from "@/pages/Deposit";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/deposit")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Deposit — Skypay" },
      { name: "description", content: "Add funds to your Skypay wallet with UPI in seconds." },
      { property: "og:title", content: "Deposit — Skypay" },
      { property: "og:description", content: "Add funds to your Skypay wallet with UPI in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><Deposit /></UserLayout>
    </RequireUser>
  ),
});
