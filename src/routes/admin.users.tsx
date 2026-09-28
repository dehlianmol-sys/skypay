import { createFileRoute } from "@tanstack/react-router";

import UserLedger from "@/pages/admin/UserLedger";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "User Ledger — Skypay Admin" },
      { name: "description", content: "User Ledger in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><UserLedger /></RequireSuperAdmin>),
});
