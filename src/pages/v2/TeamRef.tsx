import { css } from './css/TeamRef';
import { REMOTE_IMAGES } from "@/lib/remoteImages";

export default function TeamRef() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="app" id="app">
        <header className="app-header">
          <div className="topbar">
            <button className="back-button" id="backBtn" type="button" aria-label="Back to top">
              <svg viewBox="0 0 28 28" aria-hidden="true">
                <path d="M25 14H4M11 7l-7 7 7 7" />
              </svg>
            </button>
            <h1 id="pageTitle" tabIndex={-1}>
              Team
            </h1>
          </div>
        </header>
        <main id="teamPage" className="team-content" aria-label="Team overview">
          <section className="commissions-summary" aria-labelledby="summaryTitle">
            <h2 className="summary-title" id="summaryTitle">
              My Total Commissions:
            </h2>
            <p className="summary-total">
              +0.00
            </p>
            <dl className="summary-grid">
              <div className="summary-stat">
                <dt>
                  Commissions Yesterday
                </dt>
                <dd>
                  +0.00
                </dd>
              </div>
              <div className="summary-stat">
                <dt>
                  Total Team Members
                </dt>
                <dd>
                  +0
                </dd>
              </div>
              <div className="summary-stat">
                <dt>
                  Commissions Today
                </dt>
                <dd>
                  +0.00
                </dd>
              </div>
              <div className="summary-stat">
                <dt>
                  Total Team Deposit
                </dt>
                <dd>
                  +0.00
                </dd>
              </div>
            </dl>
          </section>
          <section className="folder invitation-card" aria-labelledby="invitationTitle">
            <h2 className="folder-title" id="invitationTitle">
              Invitation
            </h2>
            <div className="folder-shell">
              <div className="invitation-link">
                <strong>
                  Link
                </strong>
                <button className="copy-code" id="copyCodeBtn" type="button" aria-label="Copy invitation code QRCZRh">
                  <span>
                    QRCZRh
                  </span>
                  <svg viewBox="0 0 22 24" aria-hidden="true">
                    <rect x="2" y="6" width="14" height="16" rx="1.3" />
                    <path d="M6 6V2.8c0-.8.5-1.3 1.3-1.3h12c.8 0 1.3.5 1.3 1.3v14c0 .8-.5 1.3-1.3 1.3H16" />
                  </svg>
                </button>
              </div>
              <div className="members-body">
                <h3>
                  New Team Members:
                </h3>
                <div className="member-grid">
                  <section className="member-box" aria-labelledby="memberBTitle">
                    <h4 id="memberBTitle">
                      Level.B
                    </h4>
                    <dl>
                      <div className="member-row">
                        <dt>
                          Today:
                        </dt>
                        <dd>
                          0
                        </dd>
                      </div>
                      <div className="member-row">
                        <dt>
                          Yesterday:
                        </dt>
                        <dd>
                          0
                        </dd>
                      </div>
                    </dl>
                  </section>
                  <section className="member-box" aria-labelledby="memberCTitle">
                    <h4 id="memberCTitle">
                      Level.C
                    </h4>
                    <dl>
                      <div className="member-row">
                        <dt>
                          Today:
                        </dt>
                        <dd>
                          0
                        </dd>
                      </div>
                      <div className="member-row">
                        <dt>
                          Yesterday:
                        </dt>
                        <dd>
                          0
                        </dd>
                      </div>
                    </dl>
                  </section>
                </div>
              </div>
            </div>
          </section>
          <section className="card share-card" aria-labelledby="shareTitle">
            <h2 id="shareTitle">
              Share APP to
            </h2>
            <div className="share-options">
              <button className="share-option" type="button" data-share="telegram" aria-label="Share on Telegram">
                <img src={REMOTE_IMAGES["https://i.ibb.co/PvHmLqqq/image-search-1789392181763.png"]} alt="Telegram" style={{ width: "48px", height: "48px" }} />
                <span>
                  Telegram
                </span>
              </button>
              <button className="share-option" type="button" data-share="facebook" aria-label="Share on Facebook">
                <img src={REMOTE_IMAGES["https://i.ibb.co/yFrmc2Ny/image-search-1789392214390.jpg"]} alt="Facebook" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
                <span>
                  Facebook
                </span>
              </button>
              <button className="share-option" type="button" data-share="whatsapp" aria-label="Share on Whatsapp">
                <img src={REMOTE_IMAGES["https://i.ibb.co/Q7VtT8d6/image-search-1789392262092.png"]} alt="Whatsapp" style={{ width: "48px", height: "48px" }} />
                <span>
                  Whatsapp
                </span>
              </button>
              <button className="share-option" type="button" data-share="copy" aria-label="Copy invitation link">
                <img src={REMOTE_IMAGES["https://i.ibb.co/8DTm2Pj4/image-search-1789392354794.jpg"]} alt="Copy link" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
                <span>
                  Copy link
                </span>
              </button>
            </div>
          </section>
          <section className="folder deposit-card" aria-labelledby="depositTitle">
            <h2 className="folder-title" id="depositTitle">
              Commissions / Deposit
            </h2>
            <div className="folder-shell">
              <div className="deposit-body">
                <dl>
                  <div className="deposit-row">
                    <dt>
                      Level.B
                    </dt>
                    <dd>
                      0.00/0.00
                    </dd>
                  </div>
                  <div className="deposit-row">
                    <dt>
                      Level.C
                    </dt>
                    <dd>
                      0.00/0.00
                    </dd>
                  </div>
                </dl>
                <a id="viewDetailsBtn" href="#level" style={{ color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}>
                  View details&gt;
                </a>
              </div>
            </div>
          </section>
          <section className="card performance-card" aria-labelledby="performanceTitle">
            <div className="performance-header">
              <h2 id="performanceTitle">
                Performance
              </h2>
              <div className="period-switch" role="group" aria-label="Performance period">
                <button type="button" data-period="Day" aria-pressed="false">
                  Day
                </button>
                <button type="button" data-period="Week" aria-pressed="false">
                  Week
                </button>
                <button type="button" data-period="Month" aria-pressed="true">
                  Month
                </button>
              </div>
            </div>
            <div className="chart" id="performanceChart" role="img" aria-label="Month performance: no data. Y-axis from 0 to 4.">
              <div className="chart-row" aria-hidden="true">
                <span>
                  4
                </span>
                <i />
              </div>
              <div className="chart-row" aria-hidden="true">
                <span>
                  3
                </span>
                <i />
              </div>
              <div className="chart-row" aria-hidden="true">
                <span>
                  2
                </span>
                <i />
              </div>
              <div className="chart-row" aria-hidden="true">
                <span>
                  1
                </span>
                <i />
              </div>
              <div className="chart-row" aria-hidden="true">
                <span>
                  0
                </span>
                <i />
              </div>
            </div>
          </section>
        </main>
        <main id="levelPage" className="level-content" aria-label="Team level details" hidden>
          <div className="level-tabs" role="tablist" aria-label="Team level">
            <button className="level-tab" id="levelBTab" type="button" role="tab" aria-selected="true" aria-controls="levelPanel" data-level="B">
              LevelB
            </button>
            <button className="level-tab" id="levelCTab" type="button" role="tab" aria-selected="false" aria-controls="levelPanel" tabIndex={-1} data-level="C">
              LevelC
            </button>
          </div>
          <div className="level-panel" id="levelPanel" role="tabpanel" aria-labelledby="levelBTab" aria-busy="false">
            <div role="status" aria-live="polite">
              <p id="emptyMessage">
                No more data
              </p>
            </div>
          </div>
        </main>
      </div>
      <div className="toast" id="toast" role="status" aria-live="polite" hidden />
    </>
  );
}

