import { createFileRoute } from "@tanstack/react-router";

import MessageV2 from "@/pages/v2/MessageV2";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/message")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Messages — Skypay" },
      { name: "description", content: "Read your Skypay announcements, alerts and account messages." },
      { property: "og:title", content: "Messages — Skypay" },
      { property: "og:description", content: "Read your Skypay announcements, alerts and account messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <MessageV2 />
    </RequireUser>
  ),
});
