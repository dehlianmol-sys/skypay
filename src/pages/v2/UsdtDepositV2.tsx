import { useEffect, useRef } from 'react';
import { REMOTE_IMAGES } from "@/lib/remoteImages";
import { useNavigate } from '@/lib/router-compat';
import { copyText, wireBack } from '@/lib/v2dom';
import UsdtRef from './UsdtRef';
import { useStore } from '@/lib/store';
import { orderCode } from '@/lib/orderStatus';

const RATE = 110.5;
const CHAIN_ICONS = {
  trc20: REMOTE_IMAGES["https://i.ibb.co/yB42zJcb/Picsart-26-09-14-17-45-04-471.png"],
  bep20: REMOTE_IMAGES["https://i.ibb.co/b541WkpL/Picsart-26-09-14-17-43-14-913.png"],
} as const;

/** USDT deposit screen — design as uploaded, no admin approval flow attached. */
export default function UsdtDepositV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { appSettings, createUsdtDepositIntent, deposits, currentUser, refreshData } = useStore();
  const rewardPercentage = appSettings?.rewardPercentage ?? 4;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const amount = root.querySelector<HTMLInputElement>('#amount');
    const form = root.querySelector<HTMLFormElement>('#deposit-form');
    const button = root.querySelector<HTMLButtonElement>('#deposit-button');
    const depositPage = root.querySelector<HTMLElement>('#deposit-page');
    const orderPage = root.querySelector<HTMLElement>('#order-page');
    const title = root.querySelector<HTMLElement>('#page-title');
    const bonus = root.querySelector<HTMLOutputElement>('#bonus');
    const received = root.querySelector<HTMLOutputElement>('#received');
    const toast = root.querySelector<HTMLElement>('#toast');
    let toastTimer: number | undefined;
    let statusTimer: number | undefined;
    const showToast = (text: string) => {
      if (!toast) return;
      toast.textContent = text;
      toast.hidden = false;
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2200);
    };
    const update = () => {
      const value = amount?.valueAsNumber ?? Number.NaN;
      const converted = Number.isFinite(value) && value > 0 ? value * RATE : 0;
      const reward = converted * rewardPercentage / 100;
      if (bonus) bonus.textContent = `${reward.toFixed(2)} Score`;
      if (received) received.textContent = `${(converted + reward).toFixed(2)} Score`;
      const valid = Number.isFinite(value) && value >= 10 && Boolean(form?.querySelector<HTMLInputElement>('input[name="chain"]:checked'));
      if (button) { button.disabled = !valid; button.classList.toggle('is-muted', !valid); }
    };
    const showOrder = (deposit: (typeof deposits)[number]) => {
      const isBep = deposit.transactionType.toLowerCase().includes('bep20');
      const created = new Date(deposit.createdAt);
      const values: Record<string, string> = {
        '#order-amount': deposit.amount.toFixed(2),
        '#order-address': deposit.paymentMethod?.upiId ?? '',
        '#order-type': isBep ? 'BSC-USDT' : 'TRC20-USDT',
        '#order-created': created.toLocaleString('en-CA', { hour12: false }).replace(',', ''),
        '#order-number': orderCode(deposit),
      };
      Object.entries(values).forEach(([selector, text]) => { const el = root.querySelector<HTMLElement>(selector); if (el) el.textContent = text; });
      const status = root.querySelector<HTMLElement>('#order-status');
      const refreshStatus = () => {
        const expired = deposit.status === 'Pending' && new Date(deposit.expiresAt).getTime() <= Date.now();
        if (status) status.textContent = expired || deposit.status === 'Rejected' ? 'Failed' : deposit.status;
      };
      refreshStatus();
      window.clearInterval(statusTimer);
      statusTimer = window.setInterval(refreshStatus, 1000);
      const chainIcon = root.querySelector<HTMLImageElement>('#order-chain-icon');
      if (chainIcon) { chainIcon.src = CHAIN_ICONS[isBep ? 'bep20' : 'trc20']; chainIcon.alt = isBep ? 'BEP20' : 'TRC20'; }
      root.querySelector('#order-type')?.classList.toggle('bsc', isBep);
      if (depositPage) depositPage.hidden = true;
      if (orderPage) orderPage.hidden = false;
      if (title) title.textContent = 'Order';
    };
    const submit = async (event: SubmitEvent) => {
      event.preventDefault();
      const value = amount?.valueAsNumber ?? Number.NaN;
      const selectedChain = form?.querySelector<HTMLInputElement>('input[name="chain"]:checked')?.value;
      if (!Number.isFinite(value) || value < 10) return showToast('Minimum USDT deposit amount is 10');
      if (selectedChain !== 'trc20' && selectedChain !== 'bep20') return showToast('Please select a network');
      const chain = selectedChain;
      const isBep = chain === 'bep20';
      if (button) button.disabled = true;
      const result = await createUsdtDepositIntent(value, chain);
      if (!result.ok || !result.deposit) {
        showToast(result.message);
        update();
        return;
      }
       try { sessionStorage.setItem('hkwallet_selected_order', result.deposit.id); } catch { /* ignore */ }
       showOrder(result.deposit);
      window.scrollTo(0, 0);
    };
    const copyHandler = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const id = target.dataset.copy;
      const text = id ? root.querySelector<HTMLElement>(`#${id}`)?.textContent ?? '' : '';
      void copyText(text).then((ok) => showToast(ok ? 'Copied' : 'Unable to copy'));
    };
    const copyButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-copy]'));
    amount?.addEventListener('input', update);
    form?.querySelectorAll('input[name="chain"]').forEach((radio) => radio.addEventListener('change', update));
    form?.addEventListener('submit', submit);
    copyButtons.forEach((copyButton) => copyButton.addEventListener('click', copyHandler));
    update();
    let selectedId: string | null = null;
    try { selectedId = sessionStorage.getItem('hkwallet_selected_order'); } catch { /* ignore */ }
    const selected = deposits.find((deposit) =>
      deposit.id === selectedId
      && deposit.userId === currentUser?.id
      && deposit.transactionType.toLowerCase().includes('usdt'),
    );
    if (selected) showOrder(selected);
    const refreshOnReturn = () => void refreshData();
    window.addEventListener('focus', refreshOnReturn);
    window.addEventListener('pageshow', refreshOnReturn);
    const cleanups = [
      wireBack(root, () => {
        if (orderPage && !orderPage.hidden) {
          try { sessionStorage.removeItem('hkwallet_selected_order'); } catch { /* ignore */ }
          orderPage.hidden = true;
          if (depositPage) depositPage.hidden = false;
          if (title) title.textContent = 'Deposit';
          return;
        }
        if (window.history.length > 1) window.history.back();
        else navigate('/');
      }),
    ];
    return () => {
      window.clearTimeout(toastTimer);
      window.clearInterval(statusTimer);
      window.removeEventListener('focus', refreshOnReturn);
      window.removeEventListener('pageshow', refreshOnReturn);
      amount?.removeEventListener('input', update);
      form?.querySelectorAll('input[name="chain"]').forEach((radio) => radio.removeEventListener('change', update));
      form?.removeEventListener('submit', submit);
      copyButtons.forEach((copyButton) => copyButton.removeEventListener('click', copyHandler));
      cleanups.forEach((fn) => fn());
    };
  }, [navigate, rewardPercentage, createUsdtDepositIntent, deposits, currentUser?.id, refreshData]);

  return (
    <div ref={rootRef}>
      <UsdtRef />
    </div>
  );
}
