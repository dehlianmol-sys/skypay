import { css } from './css/TaskRef';

export default function TaskRef() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="svg-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="coin-icon" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="14" fill="currentColor" />
            <path d="m14 6 2.15 5.05 5.45.46-4.13 3.59 1.27 5.31L14 17.59l-4.74 2.82 1.27-5.31-4.13-3.59 5.45-.46Z" fill="#233c32" stroke="#233c32" strokeWidth="2.5" strokeLinejoin="round" />
          </symbol>
          <symbol id="chevron-icon" viewBox="0 0 24 24">
            <path d="m2 7 10 10L22 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </symbol>
        </defs>
      </svg>
      <div className="app">
        <header className="app-header">
          <div className="navigation">
            <button className="back" type="button" aria-label="Go back" data-action="back">
              <svg viewBox="0 0 28 28" aria-hidden="true">
                <path d="M25 14H3m8-8-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1>
              Task Rewards
            </h1>
          </div>
        </header>
        <main>
          <p className="subtitle">
            Earn tokens by completing tasks
          </p>
          <div className="tabs" role="tablist" aria-label="Task categories">
            <button id="newbie-tab" className="tab" type="button" role="tab" aria-selected="true" aria-controls="newbie-panel" tabIndex={0}>
              Newbie Tasks
            </button>
            <button id="team-tab" className="tab" type="button" role="tab" aria-selected="false" aria-controls="team-panel" tabIndex={-1}>
              Team Growth
            </button>
            <button id="daily-tab" className="tab" type="button" role="tab" aria-selected="false" aria-controls="daily-panel" tabIndex={-1}>
              Daily Tasks
            </button>
          </div>
          <section id="newbie-panel" className="task-list" role="tabpanel" aria-labelledby="newbie-tab" tabIndex={0}>
            <article className="task-card" aria-labelledby="new-member-title">
              <div className="card-top">
                <span className="tag">
                  NEWBIE
                </span>
                <div className="progress">
                  <span className="progress-track" role="progressbar" aria-label="New member trading volume" aria-valuemin={0} aria-valuemax={2000} aria-valuenow={0}>
                    <span className="progress-fill" />
                  </span>
                  <span>
                    0 / 2000
                  </span>
                </div>
              </div>
              <h2 id="new-member-title">
                New Member Tasks
              </h2>
              <p className="description">
                sign up karen aur trading shuru karen. jab aapka kul trading volume 2000 tak pahunch jaega, to aapko 30 rupaye ka bonus mil sakta hai.
              </p>
              <div className="card-bottom">
                <span className="reward" aria-label="20 tokens">
                  <svg className="coin" aria-hidden="true">
                    <use href="#coin-icon" />
                  </svg>
                  20
                </span>
                <button className="action action-muted" type="button" disabled>
                  Not Started
                </button>
              </div>
            </article>
          </section>
          <section id="team-panel" className="task-list" role="tabpanel" aria-labelledby="team-tab" tabIndex={0} hidden>
            <article className="task-card invite-card" aria-labelledby="invite-title">
              <div className="card-top">
                <span className="tag tag-invite">
                  INVITE
                </span>
                <span className="progress">
                  0 invited
                </span>
              </div>
              <h2 id="invite-title" className="description invite-description">
                doston ko trade ke liye invite karen! jab har invite kiye gaye user ka kul trading volume 5000 tak pahunch jata hai, to aap 100rs ka bonus kama sakte han.
              </h2>
              <div className="card-bottom">
                <span className="reward" aria-label="0 tokens">
                  <svg className="coin" aria-hidden="true">
                    <use href="#coin-icon" />
                  </svg>
                  0
                </span>
                <button className="action action-raised" type="button" data-action="invite">
                  Invite
                </button>
              </div>
            </article>
          </section>
          <section id="daily-panel" className="task-list" role="tabpanel" aria-labelledby="daily-tab" tabIndex={0} hidden>
            <div className="daily-task">
              <article className="task-card daily-card" aria-labelledby="yesterday-title">
                <div className="card-top">
                  <span className="tag tag-daily">
                    YESTERDAY
                  </span>
                  <div className="progress">
                    <span className="progress-track" role="progressbar" aria-label="Yesterday's trading volume" aria-valuemin={0} aria-valuemax={200000} aria-valuenow={0}>
                      <span className="progress-fill" />
                    </span>
                    <span>
                      0 / 200000
                    </span>
                  </div>
                </div>
                <h2 id="yesterday-title">
                  Daily Incentive Bonus 2026-09-13
                </h2>
                <p className="description">
                  rozana trading gatividhiyon mein hissa len. aapki kul rozana trading rashi ke aadhar par, aap tay niyamon ke anusar agle din reward claim kar sakte han.
                </p>
                <div className="card-bottom">
                  <span className="reward" aria-label="0 tokens">
                    <svg className="coin" aria-hidden="true">
                      <use href="#coin-icon" />
                    </svg>
                    0
                  </span>
                  <button className="action action-muted" type="button" disabled>
                    Unfinished
                  </button>
                </div>
                <button id="yesterday-toggle" className="rules-toggle" type="button" aria-expanded="false" aria-controls="yesterday-rules">
                  Check Task Rules
                  <svg className="chevron" aria-hidden="true">
                    <use href="#chevron-icon" />
                  </svg>
                </button>
              </article>
              <div id="yesterday-rules" className="rules-reveal" role="region" aria-label="Yesterday's task rules" aria-hidden="true" inert>
                <div className="rules-clip" />
              </div>
            </div>
            <div className="daily-task">
              <article className="task-card daily-card" aria-labelledby="today-title">
                <div className="card-top">
                  <span className="tag tag-daily">
                    TODAY
                  </span>
                  <div className="progress">
                    <span className="progress-track" role="progressbar" aria-label="Today's trading volume" aria-valuemin={0} aria-valuemax={200000} aria-valuenow={0}>
                      <span className="progress-fill" />
                    </span>
                    <span>
                      0 / 200000
                    </span>
                  </div>
                </div>
                <h2 id="today-title">
                  Daily Incentive Bonus 2026-09-14
                </h2>
                <p className="description">
                  rozana trading gatividhiyon mein hissa len. aapki kul rozana trading rashi ke aadhar par, aap tay niyamon ke anusar agle din reward claim kar sakte han.
                </p>
                <div className="card-bottom">
                  <span className="reward" aria-label="0 tokens">
                    <svg className="coin" aria-hidden="true">
                      <use href="#coin-icon" />
                    </svg>
                    0
                  </span>
                  <button className="action action-raised" type="button" disabled>
                    In Progress
                  </button>
                </div>
                <button id="today-toggle" className="rules-toggle" type="button" aria-expanded="false" aria-controls="today-rules">
                  Check Task Rules
                  <svg className="chevron" aria-hidden="true">
                    <use href="#chevron-icon" />
                  </svg>
                </button>
              </article>
              <div id="today-rules" className="rules-reveal" role="region" aria-label="Today's task rules" aria-hidden="true" inert>
                <div className="rules-clip" />
              </div>
            </div>
          </section>
        </main>
        <div className="home-indicator" aria-hidden="true" />
      </div>
      <div id="toast" className="toast" role="status" aria-live="polite" aria-atomic="true" />
    </>
  );
}

