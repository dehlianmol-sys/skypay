import { createFileRoute } from "@tanstack/react-router";

import Gateways from "@/pages/admin/Gateways";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/gateways")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment Gateways — Skypay Admin" },
      { name: "description", content: "Payment Gateways in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><Gateways /></RequireSuperAdmin>),
});
