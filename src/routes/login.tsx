import { createFileRoute } from "@tanstack/react-router";

import Login from "@/pages/Login";
import { RedirectIfAuthed } from "@/components/Guards";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login — Skypay" },
      { name: "description", content: "Sign in to your Skypay wallet to manage deposits and rewards." },
      { property: "og:title", content: "Login — Skypay" },
      { property: "og:description", content: "Sign in to your Skypay wallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RedirectIfAuthed>
      <Login />
    </RedirectIfAuthed>
  ),
});
