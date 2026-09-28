import { css } from './css/UsdtRef';
import { REMOTE_IMAGES } from "@/lib/remoteImages";

export default function UsdtRef() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg className="svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="arrow-icon" viewBox="0 0 24 24">
            <path d="M21 12H3m7-7-7 7 7 7" />
          </symbol>
          <symbol id="copy-icon" viewBox="0 0 24 24">
            <path d="M8 7V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3" />
            <rect x="3" y="7" width="15" height="15" rx="1" />
          </symbol>
          <symbol id="warning-icon" viewBox="0 0 24 24">
            <path d="m10.3 3.6-8 14A2 2 0 0 0 4 20.5h16a2 2 0 0 0 1.7-2.9l-8-14a2 2 0 0 0-3.4 0Z" />
            <path d="M12 8v5m0 3.2v.1" />
          </symbol>
        </defs>
      </svg>
      <div className="wallet" id="wallet">
        <header className="header">
          <nav className="nav" aria-label="Page navigation">
            <button className="back" id="back-button" type="button" aria-label="Go back">
              <svg className="icon" aria-hidden="true">
                <use href="#arrow-icon" />
              </svg>
            </button>
            <h1 className="page-title" id="page-title" tabIndex={-1}>
              Deposit
            </h1>
          </nav>
        </header>
        <main>
          <section className="deposit-page" id="deposit-page" aria-label="USDT deposit">
            <aside className="instructions" aria-label="Deposit instructions">
              <ol>
                <li>
                  Please enter the amount of USDT you would like to use to recharge your integrals.
                </li>
                <li>
                  Then click the 'Deposit' button at the bottom.
                </li>
                <li>
                  Follow the payment instructions on the order page to complete the payment.
                </li>
              </ol>
            </aside>
            <form className="deposit-form" id="deposit-form" noValidate>
              <div className="form-card">
                <section className="calculator" aria-labelledby="calculator-title">
                  <div className="calculator-heading">
                    <h2 id="calculator-title">
                      Calculator
                    </h2>
                    <span className="ratio">
                      Ratio: 1 USDT=110.5 INR
                    </span>
                  </div>
                  <div className="amount-field">
                    <label className="currency" htmlFor="amount">
                      USDT
                    </label>
                    <input className="amount-input" id="amount" name="amount" type="number" inputMode="decimal" min="10" step="any" placeholder="Please Enter A Number" aria-label="Deposit amount in USDT" autoComplete="off" required />
                  </div>
                </section>
                <div className="estimates" aria-live="polite" aria-atomic="true">
                  <div className="estimate">
                    <span className="estimate-label">
                      Estimated bonus:
                    </span>
                    <output id="bonus" htmlFor="amount">
                      0.00 Score
                    </output>
                  </div>
                  <div className="estimate">
                    <span className="estimate-label">
                      You will receive:
                    </span>
                    <output id="received" htmlFor="amount">
                      0.00 Score
                    </output>
                  </div>
                </div>
                <fieldset className="chains">
                  <legend>
                    Select Chain Type
                  </legend>
                  <label className="chain-option">
                    <span className="chain-icon-frame">
                      <img className="chain-icon" src={REMOTE_IMAGES["https://i.ibb.co/yB42zJcb/Picsart-26-09-14-17-45-04-471.png"]} alt="TRC20" width="27" height="27" />
                    </span>
                    <span className="chain-text">
                      <span className="chain-name">
                        TRC20
                      </span>
                      <span className="chain-description">
                        USDT-TRON Network
                      </span>
                    </span>
                    <input className="chain-radio" type="radio" name="chain" value="trc20" aria-label="TRC20, USDT-TRON Network" />
                  </label>
                  <label className="chain-option">
                    <span className="chain-icon-frame">
                      <img className="chain-icon" src={REMOTE_IMAGES["https://i.ibb.co/b541WkpL/Picsart-26-09-14-17-43-14-913.png"]} alt="BEP20" width="27" height="27" />
                    </span>
                    <span className="chain-text">
                      <span className="chain-name">
                        BSC(BEP20)
                      </span>
                      <span className="chain-description">
                        USDT-BNB Smart Chain
                      </span>
                    </span>
                    <input className="chain-radio" type="radio" name="chain" value="bep20" aria-label="BSC BEP20, USDT-BNB Smart Chain" />
                  </label>
                </fieldset>
              </div>
              <div className="deposit-footer">
                <p className="warning">
                  <svg className="icon" aria-hidden="true">
                    <use href="#warning-icon" />
                  </svg>
                  After the recharge is completed, please wait 3-5 minutes for the deposit to arrive.
                </p>
                <button className="deposit-button is-muted" id="deposit-button" type="submit" disabled>
                  Deposit
                </button>
              </div>
            </form>
          </section>
          <section className="order-page" id="order-page" aria-label="Deposit order" hidden>
            <article className="order-card" aria-label="Order summary">
              <h2 className="order-amount">
                USDT
                <span id="order-amount" />
              </h2>
              <dl className="order-details">
                <div className="order-row address-row">
                  <dt>
                    Address:
                  </dt>
                  <dd>
                    <span id="order-address" />
                    <button className="copy-button" type="button" data-copy="order-address" aria-label="Copy wallet address">
                      <svg className="icon" aria-hidden="true">
                        <use href="#copy-icon" />
                      </svg>
                    </button>
                  </dd>
                </div>
                <div className="order-row">
                  <dt>
                    Type:
                  </dt>
                  <dd>
                    <span className="type-value">
                      <img id="order-chain-icon" alt="" width="17" height="17" />
                      <span className="chain-badge" id="order-type" />
                    </span>
                    <button className="copy-button" type="button" data-copy="order-type" aria-label="Copy chain type">
                      <svg className="icon" aria-hidden="true">
                        <use href="#copy-icon" />
                      </svg>
                    </button>
                  </dd>
                </div>
                <div className="order-row">
                  <dt>
                    Status:
                  </dt>
                  <dd>
                    <span id="order-status">
                      Pending
                    </span>
                    <button className="copy-button" type="button" data-copy="order-status" aria-label="Copy order status">
                      <svg className="icon" aria-hidden="true">
                        <use href="#copy-icon" />
                      </svg>
                    </button>
                  </dd>
                </div>
                <div className="order-row">
                  <dt>
                    CreatedAt:
                  </dt>
                  <dd>
                    <time id="order-created" />
                    <button className="copy-button" type="button" data-copy="order-created" aria-label="Copy creation date">
                      <svg className="icon" aria-hidden="true">
                        <use href="#copy-icon" />
                      </svg>
                    </button>
                  </dd>
                </div>
                <div className="order-row order-number">
                  <dt>
                    NO:
                  </dt>
                  <dd>
                    <span id="order-number" />
                    <button className="copy-button" type="button" data-copy="order-number" aria-label="Copy order number">
                      <svg className="icon" aria-hidden="true">
                        <use href="#copy-icon" />
                      </svg>
                    </button>
                  </dd>
                </div>
              </dl>
            </article>
          </section>
        </main>
      </div>
      <div className="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" hidden />
    </>
  );
}

