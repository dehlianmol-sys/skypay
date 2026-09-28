import { createFileRoute } from "@tanstack/react-router";

import CustomerServiceAdmin from "@/pages/admin/CustomerService";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/customer-service")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Customer Service — Skypay Admin" },
      { name: "description", content: "Customer Service in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><CustomerServiceAdmin /></RequireSuperAdmin>),
});
