import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import AppLoading from '@/components/AppLoading';

/**
 * Only appears when a page genuinely stalls (slow connection), never on a
 * normal tap — so buttons keep feeling instant.
 */
export default function NavLoading() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' || s.isLoading });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  if (!visible) return null;

  return <AppLoading />;
}
