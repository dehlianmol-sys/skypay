import { createFileRoute } from "@tanstack/react-router";

import OrdersV2 from "@/pages/v2/OrdersV2";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment History — Skypay" },
      { name: "description", content: "See every Skypay top-up, order and payment in one place." },
      { property: "og:title", content: "Payment History — Skypay" },
      { property: "og:description", content: "See every Skypay top-up, order and payment in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <OrdersV2 />
    </RequireUser>
  ),
});
