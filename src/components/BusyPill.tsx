import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import AppLoading from './AppLoading';

/**
 * Small dark square loader (same look as the OTP-sent message bubble).
 * Appears only when a page genuinely stalls, never blocks taps, and always
 * disappears on its own so the interface can never feel frozen.
 */
export default function BusyPill() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' || s.isLoading });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setVisible(false);
      return;
    }
    const show = window.setTimeout(() => setVisible(true), 600);
    // Safety valve: never let the indicator stay on screen.
    const hide = window.setTimeout(() => setVisible(false), 5000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [isLoading]);

  if (!visible) return null;

  return <AppLoading />;
}
