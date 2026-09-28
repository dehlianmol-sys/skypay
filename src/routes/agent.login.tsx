import { createFileRoute } from "@tanstack/react-router";

import AgentLogin from "@/pages/agent/AgentLogin";

export const Route = createFileRoute("/agent/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Agent Login — Skypay" },
      { name: "description", content: "Agent Login for Skypay partner agents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentLogin,
});
