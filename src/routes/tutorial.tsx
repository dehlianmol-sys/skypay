import { createFileRoute } from '@tanstack/react-router';
import { RequireUser } from '@/components/Guards';
import TutorialV2 from '@/pages/v2/TutorialV2';

export const Route = createFileRoute('/tutorial')({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Tutorial — Skypay' },
    { name: 'description', content: 'Open Skypay video guides for deposits and USDT.' },
    { property: 'og:title', content: 'Tutorial — Skypay' },
    { property: 'og:description', content: 'Open Skypay video guides for deposits and USDT.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <RequireUser><TutorialV2 /></RequireUser>,
});