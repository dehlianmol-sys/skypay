import { createFileRoute } from "@tanstack/react-router";

import DepositLogs from "@/pages/admin/DepositLogs";


export const Route = createFileRoute("/admin/deposits")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Deposit Logs — Skypay Admin" },
      { name: "description", content: "Deposit Logs in the Skypay admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DepositLogs,
});
