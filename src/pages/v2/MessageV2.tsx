import { useEffect, useRef } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { wireBack, wireTabs } from '@/lib/v2dom';
import MessageRef from './MessageRef';

/** Message / notification hub — used by the home bell and My → Message. */
export default function MessageV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups = [
      wireBack(root, () => {
        if (window.history.length > 1) window.history.back();
        else navigate('/');
      }),
      wireTabs(root),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [navigate]);

  return (
    <div ref={rootRef}>
      <MessageRef />
    </div>
  );
}
