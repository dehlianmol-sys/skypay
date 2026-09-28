import { createFileRoute } from '@tanstack/react-router';
import ResetPassword from '@/pages/ResetPassword';
import { RedirectIfAuthed } from '@/components/Guards';

export const Route = createFileRoute('/reset-password')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Reset Password — Skypay' },
      { name: 'description', content: 'Reset your Skypay account password.' },
      { property: 'og:title', content: 'Reset Password — Skypay' },
      { property: 'og:description', content: 'Reset your Skypay account password.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: () => <RedirectIfAuthed><ResetPassword /></RedirectIfAuthed>,
});