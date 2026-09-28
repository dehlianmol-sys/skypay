import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '../lib/toast';
import { getUserTeam, type TeamStats } from '../lib/team';

const EMPTY_STATS: TeamStats = {
  todayMembers: 0,
  todayCommission: 0,
  totalMembers: 0,
  totalCommission: 0,
};

export default function Team() {
  const { currentUser } = useStore();
  const toast = useToast();
  const [stats, setStats] = useState<TeamStats>(EMPTY_STATS);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const userId = currentUser?.id ?? '';

  useEffect(() => {
    if (!userId) {
      setStats(EMPTY_STATS);
      setInviteLink('');
      setInviteCode('');
      return;
    }
    let active = true;
    getUserTeam(userId)
      .then((t) => {
        if (!active) return;
        setStats(t.stats);
        setInviteLink(t.link);
        setInviteCode(t.code);
      })
      .catch(() => {
        if (active) setStats(EMPTY_STATS);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const copy = () => {
    if (!inviteLink) {
      toast('Please log in to get your invitation link', 'error');
      return;
    }
    navigator.clipboard.writeText(inviteLink).then(() => toast('Link copied!', 'success'));
  };

  return (
    <div>
      <div className="vp-header" style={{ justifyContent: 'center' }}>
        <span className="vp-header-title">Teams</span>
      </div>

      <div className="vp-comm-header">
        <div>
          <div style={{ color: 'var(--vp-muted)', fontSize: 12, marginBottom: 5 }}>
            My Total Commissions
          </div>
          <div className="vp-comm-total">
            <i className="fa-solid fa-coins" /> {stats.totalCommission.toFixed(2)}
          </div>
          <button className="vp-link-text">Show commission structure &gt;</button>
        </div>
        <div className="vp-rebate">
          <div style={{ color: '#aaa', marginBottom: 4 }}>Rebate Rate</div>
           <div>Level 1 &nbsp;&nbsp; <strong>1.5%</strong></div>
           <div>Level 2 &nbsp;&nbsp; <strong>0.5%</strong></div>
           <div>Level 3 &nbsp;&nbsp; <strong>0.3%</strong></div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title">Today's Teams Data</div>
        <div className="vp-team-grid">
          <div className="vp-team-box">
            <span className="label">Team Commissions</span>
            <span className="val">₹{stats.todayCommission.toFixed(2)}</span>
          </div>
          <div className="vp-team-box">
            <span className="label">Total New Team</span>
            <span className="val">{stats.todayMembers} &gt;</span>
          </div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title">Total Teams Data</div>
        <div className="vp-team-grid">
          <div className="vp-team-box">
            <span className="label">Team Commissions</span>
            <span className="val">₹{stats.totalCommission.toFixed(2)}</span>
          </div>
          <div className="vp-team-box">
            <span className="label">Team Members</span>
            <span className="val">{stats.totalMembers} &gt;</span>
          </div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title" style={{ marginBottom: 5 }}>
          Invitation Link{' '}
          <span style={{ fontSize: 12, color: 'var(--vp-muted)', fontWeight: 400 }}>
            (ID: {inviteCode || '—'})
          </span>
        </div>
        <div className="vp-invite-box">
          <input type="text" value={inviteLink} readOnly />
          <i className="fa-regular fa-copy" onClick={copy} role="button" aria-label="Copy invitation link" />
        </div>
        <div className="vp-team-title" style={{ marginTop: 25, marginBottom: 5 }}>
          More Ways To Invite
        </div>
        <div className="vp-social-row">
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-facebook vp-fb" /> Facebook
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-telegram vp-tg" /> Telegram
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-whatsapp vp-wa" /> WhatsApp
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-solid fa-share-nodes vp-more" /> More
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-solid fa-qrcode vp-qr" /> QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
