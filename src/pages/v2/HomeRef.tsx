import type { ReactNode } from 'react';
import { REMOTE_IMAGES } from "@/lib/remoteImages";
import newcomerRewardsImg from '@/assets/newcomer-rewards-2x.png';
import { css } from './css/HomeRef';

export default function HomeRef({ transactions }: { transactions?: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="svg-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="icon-copy" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
              <path d="M8 7V3h14v14h-4" />
              <rect x="3" y="7" width="14" height="15" rx="1" />
            </g>
          </symbol>
          <symbol id="icon-bell" viewBox="0 0 32 36">
            <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 24c-1-3-1-6-.4-9.5C6.4 9.5 9 6 13 5c0-4 6-4 6 0 5 1.4 8 6.7 8 13 0 2-.3 4-1 6 6 3 3.5 6-1 6H7c-5 0-7-3-1-6Z" />
              <path d="M12 33h8M21 10c2 2 3 5 3 8" />
            </g>
          </symbol>
          <symbol id="icon-usdt" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
              <path d="M13 13H6V3h36v10h-7M11 10v34h26V10M16 10h16M11 17H6v-5M37 17h5v-5M18 21l6 8 6-8M17 29h14M17 34h14M24 29v10" />
            </g>
          </symbol>
          <symbol id="icon-task" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <circle cx="7" cy="8" r="4" />
              <circle cx="7" cy="24" r="4" />
              <circle cx="7" cy="40" r="4" />
              <path d="M19 8h25M19 24h25M19 40h25" />
            </g>
          </symbol>
          <symbol id="icon-team" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="24" cy="11" r="8.5" />
              <path d="M5 44c0-12 8-19 19-19s19 7 19 19M24 33v12M18 39h12" />
            </g>
          </symbol>
          <symbol id="icon-order" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
              <path d="M16 6H9a2 2 0 0 0-2 2v35a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7" />
              <path d="M17 3h14v7H17zM27 19l-8 9h12l-9 10" />
            </g>
          </symbol>
          <symbol id="icon-home" viewBox="0 0 32 32">
            <path fill="currentColor" d="M2 13.2 15 2.5a1.6 1.6 0 0 1 2 0l13 10.7v16.1a1 1 0 0 1-1 1H19.8V19H12v11.3H3a1 1 0 0 1-1-1Z" />
          </symbol>
          <symbol id="icon-payment" viewBox="0 0 32 32">
            <path fill="currentColor" d="M3 5h26a2 2 0 0 1 2 2v3H1V7a2 2 0 0 1 2-2Zm-2 8h30v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2Z" />
            <path d="M21 23h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </symbol>
          <symbol id="icon-wallet" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M17 5v-3M10 7 8 5M6 12H3M25 7l2-2M29 12h3M12 17l-3 1M26 17l3 1M17 8v13M21 11c-1-3-7-3-7 0s7 2 7 5-6 4-8 1" />
            </g>
            <path fill="currentColor" d="M8 22h27a4 4 0 0 1 4 4v4h-8a6 6 0 0 0 0 12h8v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4Z" />
            <rect x="27" y="32" width="17" height="8" rx="4" fill="currentColor" />
            <circle cx="32" cy="36" r="1.4" fill="#f5c52c" />
          </symbol>
          <symbol id="icon-statistics" viewBox="0 0 36 32">
            <g fill="currentColor">
              <circle cx="18" cy="8" r="6" />
              <circle cx="6" cy="10" r="4.5" />
              <circle cx="30" cy="10" r="4.5" />
              <path d="M10 30v-8c0-10 16-10 16 0v8ZM1 28l1-10c.5-4 6-5 9-2-3 4-3 9-3 12Zm27 0c0-3 0-8-3-12 3-3 8.5-2 9 2l1 10Z" />
            </g>
          </symbol>
          <symbol id="icon-my" viewBox="0 0 32 32">
            <path fill="currentColor" fillRule="evenodd" d="M16 1a15 15 0 1 0 0 30 15 15 0 0 0 0-30ZM6 17a10.1 10.1 0 0 0 20 0Z" />
          </symbol>
          <symbol id="icon-close" viewBox="0 0 24 24">
            <path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </symbol>
        </defs>
      </svg>
      <div className="app-shell">
        <header className="header">
          <button className="avatar-button" type="button" data-action="my" aria-label="Open my profile">
            <svg className="avatar" viewBox="0 0 48 48" aria-hidden="true">
              <defs>
                <clipPath id="avatar-clip">
                  <circle cx="24" cy="24" r="24" />
                </clipPath>
              </defs>
              <g clipPath="url(#avatar-clip)">
                <circle cx="24" cy="24" r="24" fill="#e8f2ff" />
                <path d="M8 47c0-11 5-16 16-16s16 5 16 16" fill="#87b3f6" />
                <ellipse cx="24" cy="20.5" rx="10" ry="10.5" fill="#91baf9" />
                <path d="M24 10c14 0 14 21 0 21 5-5 3-15 0-21" fill="#80acf0" />
                <path d="M22 23c.5 3 4 3 4.5 0" fill="none" stroke="#e9f4ff" strokeWidth="1.7" strokeLinecap="round" />
              </g>
            </svg>
          </button>
          <div className="profile">
            <h1>
              Hhhhh6345
            </h1>
            <div className="identity">
              <span>
                ID:
                <span id="user-id">
                  253856
                </span>
              </span>
              <button className="copy-button" id="copy-id" type="button" aria-label="Copy user ID 253856">
                <svg aria-hidden="true">
                  <use href="#icon-copy" />
                </svg>
              </button>
            </div>
          </div>
          <button className="bell-button" id="notifications" type="button" aria-label="View announcements">
            <svg aria-hidden="true">
              <use href="#icon-bell" />
            </svg>
          </button>
        </header>
        <main className="dashboard" aria-label="Home dashboard">
          <section className="carousel" id="carousel" aria-label="Latest promotions" aria-roledescription="carousel">
            <button className="carousel-pause sr-only" id="carousel-pause" type="button" aria-pressed="false">
              Pause slideshow
            </button>
            <div className="carousel-track" id="carousel-track" />
            <div className="carousel-dots" aria-label="Choose a promotion" />
          </section>
          <section className="image-card balance-card" aria-label="Available balance: 77 Indian rupees">
            <img src={REMOTE_IMAGES["https://i.ibb.co/hxbNq00C/Picsart-26-09-14-16-16-00-015.png"]} alt="Available Balance" width="640" height="640" draggable={false} />
            <span className="balance-value" aria-hidden="true">
              77
            </span>
            <button className="detail-button" type="button" data-action="transactions" aria-label="Detail: view transaction history" />
          </section>
          <section className="image-card stats-card" aria-label="Deposit: 0 Indian rupees. Withdrawal: 0 Indian rupees.">
            <img src={REMOTE_IMAGES["https://i.ibb.co/d4Q6VFrf/Picsart-26-09-14-16-12-00-574.png"]} alt="Deposit and Withdrawal" width="640" height="640" draggable={false} />
            <span className="stat-value deposit-value" aria-hidden="true">
              0
            </span>
            <span className="stat-value withdrawal-value" aria-hidden="true">
              0
            </span>
          </section>
          <section className="actions" aria-label="Quick actions">
            <button className="action-button" type="button" data-action="usdt">
              <span className="action-icon">
                <span className="usdt-badge">
                  110.5INR
                </span>
                <svg aria-hidden="true">
                  <use href="#icon-usdt" />
                </svg>
              </span>
              <span>
                USDT
              </span>
            </button>
            <button className="action-button" type="button" data-action="task">
              <span className="action-icon">
                <svg aria-hidden="true">
                  <use href="#icon-task" />
                </svg>
              </span>
              <span>
                Task
              </span>
            </button>
            <button className="action-button" type="button" data-action="team">
              <span className="action-icon">
                <svg aria-hidden="true">
                  <use href="#icon-team" />
                </svg>
              </span>
              <span>
                Team
              </span>
            </button>
            <button className="action-button" type="button" data-action="order">
              <span className="action-icon">
                <svg aria-hidden="true">
                  <use href="#icon-order" />
                </svg>
              </span>
              <span>
                Order
              </span>
            </button>
          </section>
          <button className="image-card rewards-card" id="newcomer-rewards" type="button" aria-label="Newcomer rewards, not started. Multi-Day Task. View reward requirements.">
            <img src={newcomerRewardsImg} fetchPriority="high" alt="Newcomer rewards. Not started. You need to complete at least one order to start." width="640" height="640" draggable={false} />
          </button>
          <section className="transactions" id="transactions" aria-labelledby="transactions-title">
            <div className="section-heading">
              <h2 id="transactions-title">
                Transactions
              </h2>
              <button className="see-all" type="button" data-action="transactions">
                See All
              </button>
            </div>
            {transactions ?? (
              <div className="empty-state">
                <p className="empty-title">
                  No top-up orders yet
                </p>
                <p className="empty-subtitle">
                  Top up now and start the game!
                </p>
                <button className="primary-button top-up-button" type="button" data-action="top-up">
                  Top up now
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
      <div className="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" />
      <dialog className="app-dialog notice-dialog" id="notice-dialog" aria-labelledby="notice-title">
        <h2 className="sr-only" id="notice-title" tabIndex={-1} autoFocus>
          Admin announcement
        </h2>
        <button className="dialog-close" type="button" data-close-dialog="" aria-label="Close announcement">
          <svg aria-hidden="true">
            <use href="#icon-close" />
          </svg>
        </button>
        <img className="notice-image" id="notice-image" alt="Skypay notice" hidden fetchPriority="high" draggable={false} />
        <p className="notice-error" id="notice-error" role="status" hidden>
          The notice image could not be loaded. Please try again later.
        </p>
        <button className="primary-button dialog-confirm notice-confirm" id="notice-next" type="button">
          I know
        </button>
      </dialog>
      <dialog className="app-dialog" id="app-dialog" data-kind="action" aria-labelledby="dialog-title" aria-describedby="dialog-message">
        <button className="dialog-close" id="dialog-close" type="button" data-close-dialog="" aria-label="Close message">
          <svg aria-hidden="true">
            <use href="#icon-close" />
          </svg>
        </button>
        <h2 className="dialog-title" id="dialog-title" tabIndex={-1} autoFocus />
        <p className="dialog-message" id="dialog-message" />
        <button className="primary-button dialog-confirm" id="dialog-confirm" type="button" data-close-dialog="">
          I Know
        </button>
      </dialog>
    </>
  );
}

