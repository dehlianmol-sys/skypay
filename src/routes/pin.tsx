import { createFileRoute } from "@tanstack/react-router";

import PinV2 from "@/pages/v2/PinV2";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/pin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Wallet PIN — Skypay" },
      { name: "description", content: "Create or change the six-digit PIN that protects your Skypay account actions." },
      { property: "og:title", content: "Wallet PIN — Skypay" },
      { property: "og:description", content: "Create or change the six-digit PIN that protects your Skypay account actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <PinV2 />
    </RequireUser>
  ),
});
