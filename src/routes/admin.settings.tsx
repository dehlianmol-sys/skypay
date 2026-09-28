import { createFileRoute } from "@tanstack/react-router";

import Settings from "@/pages/admin/Settings";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Global Settings — Skypay Admin" },
      { name: "description", content: "Global Settings in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><Settings /></RequireSuperAdmin>),
});
