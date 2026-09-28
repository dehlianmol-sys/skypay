import { createFileRoute } from "@tanstack/react-router";

import SellOrders from "@/pages/admin/SellOrders";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/sell-orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "User Sell Orders — Skypay Admin" },
      { name: "description", content: "Create and manage user sell orders in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><SellOrders /></RequireSuperAdmin>),
});
