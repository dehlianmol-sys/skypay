import { createFileRoute } from "@tanstack/react-router";

import TaskV2 from "@/pages/v2/TaskV2";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/task")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Task Rewards — Skypay" },
      { name: "description", content: "Complete newbie, invite and daily purchase tasks to earn extra Skypay star rewards." },
      { property: "og:title", content: "Task Rewards — Skypay" },
      { property: "og:description", content: "Complete newbie, invite and daily tasks to earn extra star rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <TaskV2 />
    </RequireUser>
  ),
});
