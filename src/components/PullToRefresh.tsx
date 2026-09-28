import { RefreshCw } from 'lucide-react';
import { useRef, useState, type ReactNode, type TouchEvent } from 'react';

const MAX_PULL = 84;
const REFRESH_AT = 58;
/** Finger travel before the gesture counts as a pull instead of a scroll. */
const ENGAGE_AT = 12;

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

/**
 * Pull-to-refresh that never re-renders the page while the finger moves:
 * the offset is written straight to the DOM, so normal scrolling stays smooth.
 */
export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const startY = useRef<number | null>(null);
  const distance = useRef(0);
  const engaged = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  const paint = (value: number) => {
    distance.current = value;
    if (contentRef.current) contentRef.current.style.transform = value ? `translateY(${value}px)` : '';
    if (indicatorRef.current) {
      indicatorRef.current.style.height = `${value}px`;
      indicatorRef.current.style.opacity = value > 4 ? '1' : '0';
    }
    if (labelRef.current) {
      labelRef.current.textContent = value >= REFRESH_AT ? 'Release to refresh' : 'Pull to refresh';
    }
  };

  const reset = () => {
    startY.current = null;
    engaged.current = false;
    paint(0);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    engaged.current = false;
    startY.current =
      !refreshing && (scrollRef.current?.scrollTop ?? 0) <= 0
        ? (event.touches[0]?.clientY ?? null)
        : null;
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (startY.current === null || refreshing) return;
    if ((scrollRef.current?.scrollTop ?? 0) > 0) { reset(); return; }
    const currentY = event.touches[0]?.clientY;
    if (currentY === undefined) return;
    const pull = currentY - startY.current;
    if (!engaged.current) {
      if (pull < ENGAGE_AT) return;
      engaged.current = true;
    }
    paint(Math.min(MAX_PULL, Math.max(0, pull - ENGAGE_AT) * 0.55));
  };

  const finishPull = async () => {
    const pulled = distance.current;
    startY.current = null;
    engaged.current = false;
    if (pulled < REFRESH_AT || refreshing) {
      paint(0);
      return;
    }
    setRefreshing(true);
    paint(48);
    if (labelRef.current) labelRef.current.textContent = 'Refreshing';
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      paint(0);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="vp-scroll pull-refresh-scroll"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => { void finishPull(); }}
      onTouchCancel={reset}
    >
      <div ref={indicatorRef} className="pull-refresh-indicator" aria-live="polite" style={{ height: 0, opacity: 0 }}>
        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} aria-hidden="true" />
        <span ref={labelRef}>Pull to refresh</span>
      </div>
      <div ref={contentRef} className="pull-refresh-content">{children}</div>
    </div>
  );
}
