import { useNavigate } from '@/lib/router-compat';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

const css = `
.hk-support-fab{position:fixed;z-index:40;right:max(3px,calc((100vw - 430px)/2 + 3px));bottom:calc(var(--nav-height, 62px) + var(--safe-bottom, 0px) + 34px);width:66px;height:58px;display:grid;place-items:center;padding:0;border:0;background:transparent;cursor:grab;touch-action:none;-webkit-tap-highlight-color:transparent;transition:opacity .18s ease,transform .18s ease}
.hk-support-fab img{display:block;width:66px;height:auto;filter:drop-shadow(0 6px 12px rgba(15,138,95,.2));pointer-events:none}
.hk-support-fab:active{transform:scale(.95)}
.hk-support-fab.is-folded{right:0;width:24px;overflow:hidden;opacity:.72;cursor:pointer}
.hk-support-fab.is-folded img{width:66px;max-width:none;transform:translateX(-2px)}
`;

/**
 * Single floating customer-service button used on every signed-in screen
 * except My (which has its own Service row). The supplied artwork is stored
 * locally and the control can be moved vertically or folded at the bottom.
 */
export default function SupportFab() {
  const navigate = useNavigate();
  const [top, setTop] = useState<number | null>(null);
  const [folded, setFolded] = useState(false);
  const drag = useRef<{ startY: number; startTop: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const pointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (folded) return;
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = { startY: event.clientY, startTop: rect.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state) return;
    const delta = event.clientY - state.startY;
    if (Math.abs(delta) > 4) state.moved = true;
    const maxTop = Math.max(8, window.innerHeight - 70);
    setTop(Math.min(maxTop, Math.max(8, state.startTop + delta)));
  };

  const pointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    suppressClick.current = state.moved;
    if (state.moved && event.clientY > window.innerHeight - 90) setFolded(true);
  };

  const activate = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (folded) {
      setFolded(false);
      setTop(null);
      return;
    }
    navigate('/customer-service');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <button
        className={`hk-support-fab${folded ? ' is-folded' : ''}`}
        type="button"
        aria-label={folded ? 'Show customer service' : 'Customer service'}
        title={folded ? 'Show customer service' : 'Customer service'}
        style={top === null ? undefined : { top, bottom: 'auto' }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => { drag.current = null; }}
        onClick={activate}
      >
        <img src="/ui/customer-support.png" alt="" draggable={false} />
      </button>
    </>
  );
}
