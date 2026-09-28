import { createFileRoute } from "@tanstack/react-router";

import Landing from "@/pages/Landing";

export const Route = createFileRoute("/download")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Download Skypay APK — Start Earning Today" },
      {
        name: "description",
        content:
          "Download the Skypay Android app, complete easy tasks and withdraw your earnings quickly.",
      },
      { property: "og:title", content: "Download Skypay APK — Start Earning Today" },
      {
        property: "og:description",
        content: "Get the Skypay app and start earning with simple daily tasks.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
    ],
  }),
  component: Landing,
});
