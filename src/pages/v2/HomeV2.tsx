import { useEffect, useMemo, useRef } from 'react';
import { REMOTE_IMAGES } from "@/lib/remoteImages";
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { useBanners, walletUserId } from '@/lib/v2data';
import { copyText, onClick, setText } from '@/lib/v2dom';
import HomeRef from './HomeRef';
import HomeTransactions from '@/components/v2/HomeTransactions';
import type { Deposit } from '@/lib/types';
import { preloadImages } from '@/lib/preload';

const NOTICE_SEEN_KEY = 'hkwallet_notice_seen_v2';

/** Home screen — the uploaded design wired to the live account and banners. */
export default function HomeV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentUser, deposits } = useStore();
  const { normal, notice, notices } = useBanners();

  const userId = walletUserId(currentUser?.phone);

  useEffect(() => {
    void preloadImages([
      ...normal.map((banner) => banner.imageUrl),
      ...(notices ?? []).map((banner) => banner.imageUrl),
      REMOTE_IMAGES["https://i.ibb.co/hxbNq00C/Picsart-26-09-14-16-16-00-015.png"],
      REMOTE_IMAGES["https://i.ibb.co/d4Q6VFrf/Picsart-26-09-14-16-12-00-574.png"],
      REMOTE_IMAGES["https://i.ibb.co/VcfHLwhv/Picsart-26-09-14-16-18-46-405.png"],
    ]);
  }, [normal, notices]);

  // Profile, balance and totals
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setText(root, '.profile h1', currentUser?.name ?? 'Guest');
    setText(root, '#user-id', userId);
    const mine = deposits.filter((d) => d.userId === currentUser?.id && d.status === 'Success');
    const totalDeposit = mine.reduce((sum, d) => sum + d.amount, 0);
    setText(root, '.balance-value', String(Math.round(currentUser?.wallet ?? 0)));
    setText(root, '.deposit-value', String(Math.round(totalDeposit)));
      setText(root, '.withdrawal-value', '0');
  }, [currentUser, deposits, userId]);

  // Promotion carousel fed by the banners the admin uploads
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('#carousel-track');
    const dots = root.querySelector<HTMLElement>('.carousel-dots');
    if (!track || !dots) return;
    if (!normal.length) return;

    track.innerHTML = '';
    dots.innerHTML = '';
    normal.forEach((banner, i) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${normal.length}`);
      const img = document.createElement('img');
      img.src = banner.imageUrl;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      if (i === 0) img.fetchPriority = 'high';
      img.alt = `Promotion ${i + 1}`;
      img.draggable = false;
      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show promotion ${i + 1}`);
      dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => show(i));
      dots.appendChild(dot);
    });

    let index = 0;
    const show = (next: number) => {
      index = (next + normal.length) % normal.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      Array.from(dots.children).forEach((d, i) =>
        d.setAttribute('aria-pressed', i === index ? 'true' : 'false'),
      );
    };
    show(0);
    const timer = normal.length > 1 ? setInterval(() => show(index + 1), 4000) : null;
    return () => { if (timer) clearInterval(timer); };
  }, [normal]);

  // Daily notices: shown once per session; "Next" steps through each, last one says "I know"
  useEffect(() => {
    const root = rootRef.current;
    const list = notices ?? [];
    if (!root || !list.length) return;
    const dialog = root.querySelector<HTMLDialogElement>('#notice-dialog');
    const image = root.querySelector<HTMLImageElement>('#notice-image');
    const next = root.querySelector<HTMLButtonElement>('#notice-next');
    const title = root.querySelector<HTMLElement>('#notice-title');
    if (!dialog || !image || !next) return;
    image.decoding = 'async';
    list.slice(1).forEach((n) => { const i = new Image(); i.src = n.imageUrl; });

    let index = 0;
    const render = () => {
      const n = list[index];
      image.hidden = false;
      image.src = n.imageUrl;
      image.alt = n.title || 'Notice';
      if (title) {
        if (n.title) { title.classList.remove('sr-only'); title.textContent = n.title; }
        else { title.classList.add('sr-only'); title.textContent = 'Admin announcement'; }
      }
      let textEl = root.querySelector<HTMLElement>('#notice-body-text');
      if (n.text) {
        if (!textEl) {
          textEl = document.createElement('p');
          textEl.id = 'notice-body-text';
          textEl.className = 'notice-body-text';
          image.insertAdjacentElement('afterend', textEl);
        }
        textEl.hidden = false;
        textEl.textContent = n.text;
      } else if (textEl) textEl.hidden = true;
      next.textContent = index < list.length - 1 ? 'Next' : 'I know';
    };
    render();

    const key = list.map((n) => n.id).join(',');
    let seen = false;
    try { seen = sessionStorage.getItem(NOTICE_SEEN_KEY) === key; } catch { /* ignore */ }
    if (!seen && typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
      try { sessionStorage.setItem(NOTICE_SEEN_KEY, key); } catch { /* ignore */ }
    }
    const onNext = () => {
      if (index < list.length - 1) { index += 1; render(); }
      else dialog.close();
    };
    const closers = Array.from(dialog.querySelectorAll<HTMLElement>('[data-close-dialog]'));
    const close = () => dialog.close();
    next.addEventListener('click', onNext);
    closers.forEach((c) => c.addEventListener('click', close));
    return () => {
      next.removeEventListener('click', onNext);
      closers.forEach((c) => c.removeEventListener('click', close));
    };
  }, [notices]);

  // Buttons
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups = [
      onClick(root, '#copy-id', () => { void copyText(userId); }),
      onClick(root, '#notifications', () => navigate('/message')),
      onClick(root, '[data-action="my"]', () => navigate('/mine')),
      onClick(root, '[data-action="usdt"]', () => navigate('/usdt-deposit')),
      onClick(root, '[data-action="task"]', () => navigate('/task')),
      onClick(root, '[data-action="team"]', () => navigate('/team')),
      onClick(root, '[data-action="order"]', () => navigate('/orders')),
      onClick(root, '#newcomer-rewards', () => navigate('/task')),
      onClick(root, '.detail-button', (e) => { e.stopPropagation(); navigate('/score'); }),
      onClick(root, '.see-all[data-action="transactions"]', () => navigate('/orders')),
      onClick(root, '[data-action="top-up"]', () => navigate('/deposit')),
      onClick(root, '[data-action="support"]', () => navigate('/customer-service')),
      onClick(root, '#notice-dialog [data-close-dialog]', () => {}),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [navigate, userId, notice]);

  const myTransactions = useMemo(
    () =>
      deposits
        .filter((d) => d.userId === currentUser?.id)
        .slice()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .slice(0, 5),
    [deposits, currentUser?.id],
  );

  const openProcessing = (order: Deposit) => {
    try { sessionStorage.setItem('hkwallet_selected_order', order.id); } catch { /* ignore */ }
    navigate(order.transactionType.toLowerCase().includes('usdt') ? '/usdt-deposit' : '/order');
  };

  return (
    <div ref={rootRef}>
      <HomeRef
        transactions={
          myTransactions.length > 0 ? (
            <HomeTransactions deposits={myTransactions} onOpenProcessing={openProcessing} />
          ) : undefined
        }
      />
    </div>
  );
}
