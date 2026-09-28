import { createFileRoute } from "@tanstack/react-router";

import WalletEntry from "@/pages/v2/WalletEntry";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/upi")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "UPI Tools — Skypay" },
      { name: "description", content: "Manage your linked UPI accounts and buy or sell orders on Skypay." },
      { property: "og:title", content: "UPI Tools — Skypay" },
      { property: "og:description", content: "Manage your linked UPI accounts and buy or sell orders on Skypay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><WalletEntry /></UserLayout>
    </RequireUser>
  ),
});
