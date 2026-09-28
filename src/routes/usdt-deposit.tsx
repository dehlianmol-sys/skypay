import { createFileRoute } from "@tanstack/react-router";

import UsdtDepositV2 from "@/pages/v2/UsdtDepositV2";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/usdt-deposit")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "USDT Deposit — Skypay" },
      { name: "description", content: "Deposit USDT on the Tron network and top up your Skypay balance." },
      { property: "og:title", content: "USDT Deposit — Skypay" },
      { property: "og:description", content: "Deposit USDT on the Tron network and top up your Skypay balance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UsdtDepositV2 />
    </RequireUser>
  ),
});
