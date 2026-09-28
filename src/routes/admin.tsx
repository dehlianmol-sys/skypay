import { createFileRoute, Outlet } from "@tanstack/react-router";

import AdminLayout from "@/pages/admin/AdminLayout";
import { RequireAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Console — Skypay" },
      { name: "description", content: "Skypay administration console for deposits, agents and settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  ),
});
