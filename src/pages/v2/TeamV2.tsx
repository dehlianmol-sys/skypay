import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';
import { getUserTeam, getTeamLevels, type TeamStats, type TeamLevels } from '@/lib/team';
import { copyText, onClick, setText, wireBack, wireTabs } from '@/lib/v2dom';
import TeamRef from './TeamRef';
import { openExternalUrl } from '@/lib/nativeBridge';
import AppLoading from '@/components/AppLoading';

const EMPTY_STATS: TeamStats = {
  todayMembers: 0,
  todayCommission: 0,
  totalMembers: 0,
  totalCommission: 0,
};

const EMPTY_LEVELS: TeamLevels = { B: [], C: [] };

const money = (n: number) => `+${n.toFixed(2)}`;

/** Team screen — uploaded design wired to the live referral link and stats. */
export default function TeamV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useStore();
  const [stats, setStats] = useState<TeamStats>(EMPTY_STATS);
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [levels, setLevels] = useState<TeamLevels>(EMPTY_LEVELS);
  const [levelOpen, setLevelOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<'B' | 'C'>('B');
  const [loading, setLoading] = useState(true);

  const userId = currentUser?.id ?? '';

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getUserTeam(userId)
      .then((t) => {
        if (!active) return;
        setStats(t.stats);
        setLink(t.link);
        setCode(t.code);
        return getTeamLevels(userId, t.code);
      })
      .then((lv) => { if (active && lv) setLevels(lv); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  // Fill the design with live values
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setText(root, '.summary-total', money(stats.totalCommission));
    const cells = Array.from(root.querySelectorAll<HTMLElement>('.summary-stat dd'));
    if (cells[0]) cells[0].textContent = money(0);
    if (cells[1]) cells[1].textContent = `+${stats.totalMembers}`;
    if (cells[2]) cells[2].textContent = money(stats.todayCommission);
    if (cells[3]) cells[3].textContent = money(0);

    const newToday = Array.from(root.querySelectorAll<HTMLElement>('.member-box .member-row dd'));
    if (newToday[0]) newToday[0].textContent = String(stats.todayMembers);

    const codeSpan = root.querySelector<HTMLElement>('#copyCodeBtn span');
    if (codeSpan && code) codeSpan.textContent = code;
    const copyBtn = root.querySelector<HTMLElement>('#copyCodeBtn');
    if (copyBtn && code) copyBtn.setAttribute('aria-label', `Copy invitation link ${code}`);

    // Level.B / Level.C member + volume counters on the commission card
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.deposit-row dd'));
    const bVol = levels.B.reduce((s, m) => s + m.volume, 0);
    const cVol = levels.C.reduce((s, m) => s + m.volume, 0);
    if (rows[0]) rows[0].textContent = `${levels.B.length}/${bVol.toFixed(2)}`;
    if (rows[1]) rows[1].textContent = `${levels.C.length}/${cVol.toFixed(2)}`;
  }, [stats, code, levels]);

  // Level detail page: open/close, tab switch and member list rendering
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const main = root.querySelector<HTMLElement>('main:not(#levelPage)');
    const page = root.querySelector<HTMLElement>('#levelPage');
    if (!main || !page) return;

    if (levelOpen) {
      main.hidden = true;
      page.hidden = false;
    } else {
      main.hidden = false;
      page.hidden = true;
      return;
    }

    page.querySelectorAll<HTMLElement>('.level-tab').forEach((tab) => {
      const selected = tab.getAttribute('data-level') === activeLevel;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    const panel = page.querySelector<HTMLElement>('#levelPanel');
    if (!panel) return;
    panel.querySelectorAll('.level-members').forEach((n) => n.remove());
    const members = activeLevel === 'B' ? levels.B : levels.C;
    const empty = panel.querySelector<HTMLElement>('#emptyMessage');
    if (empty) empty.hidden = members.length > 0;
    if (members.length === 0) return;

    const list = document.createElement('ul');
    list.className = 'level-members';
    list.style.cssText = 'margin:0;padding:0 18px;list-style:none;display:grid;gap:10px;text-align:left;';
    members.forEach((m) => {
      const li = document.createElement('li');
      li.style.cssText =
        'display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fff;border:1px solid #CAE9DD;border-radius:12px;padding:10px 12px;';
      const left = document.createElement('div');
      left.style.cssText = 'display:grid;gap:2px;min-width:0;';
      const nameEl = document.createElement('strong');
      nameEl.style.cssText = 'font-size:14px;color:#1F2937;';
      nameEl.textContent = m.name || m.phone || 'Member';
      const sub = document.createElement('span');
      sub.style.cssText = 'font-size:12px;color:#66686D;';
      sub.textContent = `${m.phone ? `${m.phone.slice(0, 3)}****${m.phone.slice(-3)} · ` : ''}${new Date(m.createdAt).toLocaleDateString('en-IN')}`;
      left.append(nameEl, sub);
      const vol = document.createElement('span');
      vol.style.cssText = 'font-size:14px;font-weight:600;color:#0F9D6C;white-space:nowrap;';
      vol.textContent = `₹${m.volume.toFixed(2)}`;
      li.append(left, vol);
      list.appendChild(li);
    });
    panel.appendChild(list);
  }, [levelOpen, activeLevel, levels]);

  // Buttons: back, copy, share, level tabs
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const shareLink = link || (typeof window !== 'undefined' ? window.location.origin : '');
    const share = (target: string) => {
      const text = encodeURIComponent(`Join Skypay: ${shareLink}`);
      const urls: Record<string, string> = {
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}`,
        whatsapp: `https://wa.me/?text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
      };
      if (target === 'copy') {
        void copyText(shareLink).then((ok) => toast(ok ? 'Link copied!' : 'Copy failed', ok ? 'success' : 'error'));
        return;
      }
      const url = urls[target];
      if (url) openExternalUrl(url);
    };

    const cleanups = [
      wireBack(root, () => {
        if (levelOpen) { setLevelOpen(false); return; }
        if (window.history.length > 1) window.history.back();
        else navigate('/');
      }),
      wireTabs(root),
      onClick(root, '#viewDetailsBtn', (e) => {
        e.preventDefault();
        setActiveLevel('B');
        setLevelOpen(true);
      }),
      onClick(root, '.level-tab', (e) => {
        const lvl = (e.currentTarget as HTMLElement)?.getAttribute('data-level');
        if (lvl === 'B' || lvl === 'C') setActiveLevel(lvl);
      }),
      onClick(root, '#copyCodeBtn', () => {
        void copyText(shareLink).then((ok) => toast(ok ? 'Invitation link copied!' : 'Copy failed', ok ? 'success' : 'error'));
      }),
      onClick(root, '[data-share]', (e) => {
        const el = (e.currentTarget as HTMLElement) ?? null;
        const target = el?.getAttribute('data-share');
        if (target) share(target);
      }),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [link, navigate, toast, levelOpen]);

  return (
    <div ref={rootRef}>
      <TeamRef />
      {loading && <AppLoading />}
    </div>
  );
}
