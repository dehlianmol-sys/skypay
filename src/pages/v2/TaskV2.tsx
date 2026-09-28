import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import { DEFAULT_DAILY_TIERS, useTaskConfig } from '@/lib/v2data';
import { onClick, setText, wireBack, wireReveals, wireTabs } from '@/lib/v2dom';
import TaskRef from './TaskRef';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Sets a progress bar: fill width, label and ARIA values. */
function setProgress(scope: HTMLElement | null, value: number, max: number) {
  if (!scope) return;
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const track = scope.querySelector<HTMLElement>('.progress-track');
  if (track) {
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', String(max));
    track.setAttribute('aria-valuenow', String(Math.min(value, max)));
    let fill = track.querySelector<HTMLElement>('.progress-fill');
    if (!fill) {
      fill = document.createElement('span');
      fill.className = 'progress-fill';
      track.appendChild(fill);
    }
    fill.style.width = `${pct}%`;
    fill.classList.toggle('is-complete', pct >= 100);
  }
  const label = scope.querySelector<HTMLElement>('.progress span:last-child');
  if (label) label.textContent = `${inr(Math.min(value, max)).replace('₹', '')} / ${inr(max).replace('₹', '')}`;
}

/** Keeps the supplied star-token reward presentation while updating live values. */
function setRewardAmount(scope: HTMLElement | null, amount: number) {
  const reward = scope?.querySelector<HTMLElement>('.reward');
  if (!reward) return;
  reward.setAttribute('aria-label', `${amount} reward tokens`);
  reward.innerHTML = `<svg class="coin" aria-hidden="true"><use href="#coin-icon"></use></svg><span>${amount.toLocaleString('en-IN')}</span>`;
}

/** Task rewards screen — newbie, invite and daily tiers driven by admin config. */
export default function TaskV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const cfg = useTaskConfig();
  const { currentUser, deposits } = useStore();

  // Live purchase volumes for the progress bars
  const volumes = useMemo(() => {
    const mine = deposits.filter((d) => d.userId === currentUser?.id && d.status === 'Success');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 86400000);
    let total = 0, todayVol = 0, yVol = 0;
    mine.forEach((d) => {
      const at = new Date(d.createdAt).getTime();
      const amt = Number(d.amount || 0);
      total += amt;
      if (at >= today.getTime()) todayVol += amt;
      else if (at >= yesterday.getTime()) yVol += amt;
    });
    return { total, today: todayVol, yesterday: yVol };
  }, [deposits, currentUser]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Newbie task: text + reward follow the admin configuration
    const newbieCard = root.querySelector<HTMLElement>('[aria-labelledby="new-member-title"]');
    setText(root, '#new-member-title', 'New Reward');
    setText(
      root,
      '[aria-labelledby="new-member-title"] .description',
      `Agar aap ${inr(cfg.newbieRequiredAmount)} tak ki purchase complete kar lete hain, to aapko ${inr(cfg.newbieReward)} milenge.`,
    );
    setRewardAmount(newbieCard, cfg.newbieReward);
    setProgress(newbieCard, volumes.total, cfg.newbieRequiredAmount);

    // Invite task
    const inviteCard = root.querySelector<HTMLElement>('.invite-card');
    setText(
      root,
      '#invite-title',
      `Apne dost ko refer karein. Aapki referral link se uska pehla order (first purchase) complete hote hi aapko ${inr(cfg.inviteReward)} milenge.`,
    );
    setRewardAmount(inviteCard, cfg.inviteReward);

    // Daily tasks: same rules for yesterday + today, capped at the highest tier
    const tiers = (cfg.dailyTiers?.length ? cfg.dailyTiers : DEFAULT_DAILY_TIERS)
      .slice()
      .sort((a, b) => a.amount - b.amount);
    const max = tiers.length ? tiers[tiers.length - 1] : null;
    const earned = (vol: number) =>
      tiers.reduce((best, t) => (vol >= t.amount ? t.reward : best), 0);
    root.querySelectorAll<HTMLElement>('.daily-card').forEach((card) => {
      const isToday = Boolean(card.querySelector('#today-title'));
      const vol = isToday ? volumes.today : volumes.yesterday;
      const desc = card.querySelector<HTMLElement>('.description');
      if (desc) {
        desc.textContent =
          'rozana trading gatividhiyon mein hissa len. aapki kul rozana trading rashi ke aadhar par, aap tay niyamon ke anusar agle din reward claim kar sakte han.';
      }
      if (max) setProgress(card, vol, max.amount);
      setRewardAmount(card, earned(vol));
    });

    // Rules panels list the tier table
    root.querySelectorAll<HTMLElement>('.rules-clip').forEach((clip) => {
      clip.innerHTML = '';
      const panel = document.createElement('section');
      panel.className = 'rules-panel';
      const heading = document.createElement('h3');
      heading.textContent = 'Daily Purchase and Sale Token Amount';
      const timeline = document.createElement('div');
      timeline.className = 'timeline';
      timeline.setAttribute('role', 'table');
      timeline.setAttribute('aria-label', 'Trading amounts and token bonuses');
      const values = (label: string, entries: number[], extraClass = '') => {
        const row = document.createElement('div');
        row.className = 'timeline-row';
        const rowLabel = document.createElement('span');
        rowLabel.className = `timeline-label${extraClass ? ` ${extraClass}-label` : ''}`;
        rowLabel.textContent = label;
        const cells = document.createElement('div');
        cells.className = `timeline-values${extraClass ? ` ${extraClass}` : ''}`;
        entries.forEach((entry) => {
          const cell = document.createElement('span');
          cell.textContent = String(entry);
          cells.appendChild(cell);
        });
        row.append(rowLabel, cells);
        return row;
      };
      timeline.appendChild(values('Amount', tiers.map((tier) => tier.amount)));
      const rail = document.createElement('div');
      rail.className = 'timeline-rail';
      tiers.forEach(() => { const dot = document.createElement('span'); dot.className = 'timeline-dot'; rail.appendChild(dot); });
      timeline.appendChild(rail);
      timeline.appendChild(values('Bonus', tiers.map((tier) => tier.reward), 'bonuses'));
      panel.append(heading, timeline);
      clip.appendChild(panel);
    });

    const cleanups = [
      wireBack(root, () => {
        if (window.history.length > 1) window.history.back();
        else navigate('/');
      }),
      wireTabs(root),
      wireReveals(root),
      onClick(root, '[data-action="bind"]', () => navigate('/upi')),
      onClick(root, '[data-action="invite"]', () => navigate('/team')),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [cfg, navigate, volumes]);

  return (
    <div ref={rootRef}>
      <TaskRef />
    </div>
  );
}
