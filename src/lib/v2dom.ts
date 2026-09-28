/**
 * Small DOM helpers that bring the uploaded static HTML designs to life without
 * altering their markup: back buttons, tab panels, expandable rule panels and
 * copy-to-clipboard buttons.
 */
export function setText(root: ParentNode, selector: string, value: string) {
  const el = root.querySelector(selector);
  if (el) el.textContent = value;
}

export function wireBack(root: ParentNode, goBack: () => void): () => void {
  const buttons = Array.from(
    root.querySelectorAll<HTMLElement>('[data-action="back"], #backBtn, .back-button, .back'),
  );
  const handler = (e: Event) => { e.preventDefault(); goBack(); };
  buttons.forEach((b) => b.addEventListener('click', handler));
  return () => buttons.forEach((b) => b.removeEventListener('click', handler));
}

/** Wires any `role="tablist"` group whose tabs use `aria-controls`. */
export function wireTabs(root: ParentNode): () => void {
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((list) => {
    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
    const select = (active: HTMLElement) => {
      tabs.forEach((tab) => {
        const on = tab === active;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        tab.classList.toggle('is-active', on);
        const panelId = tab.getAttribute('aria-controls');
        if (!panelId) return;
        const panel = root.querySelector<HTMLElement>(`#${panelId}`);
        if (panel && tabs.every((t) => t.getAttribute('aria-controls') !== panelId || t === tab)) {
          panel.hidden = !on;
        }
      });
    };
    tabs.forEach((tab) => {
      const handler = () => select(tab);
      tab.addEventListener('click', handler);
      cleanups.push(() => tab.removeEventListener('click', handler));
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

/** Wires `.rules-toggle` buttons that reveal an `aria-controls` panel. */
export function wireReveals(root: ParentNode): () => void {
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>('.rules-toggle').forEach((btn) => {
    const id = btn.getAttribute('aria-controls');
    const panel = id ? root.querySelector<HTMLElement>(`#${id}`) : null;
    const handler = () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) {
        panel.setAttribute('aria-hidden', open ? 'true' : 'false');
        if (open) panel.setAttribute('inert', '');
        else panel.removeAttribute('inert');
        panel.classList.toggle('is-open', !open);
      }
    };
    btn.addEventListener('click', handler);
    cleanups.push(() => btn.removeEventListener('click', handler));
  });
  return () => cleanups.forEach((fn) => fn());
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function onClick(
  root: ParentNode,
  selector: string,
  handler: (e: Event) => void,
): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
  els.forEach((el) => el.addEventListener('click', handler));
  return () => els.forEach((el) => el.removeEventListener('click', handler));
}
