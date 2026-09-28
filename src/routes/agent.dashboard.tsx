import { createFileRoute } from "@tanstack/react-router";

import AgentDashboard from "@/pages/agent/AgentDashboard";

export const Route = createFileRoute("/agent/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Agent Dashboard — Skypay" },
      { name: "description", content: "Agent Dashboard for Skypay partner agents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentDashboard,
});
