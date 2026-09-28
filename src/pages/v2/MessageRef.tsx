import { css } from './css/MessageRef';

export default function MessageRef() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="page">
        <div className="header">
          <button className="back-btn" id="backBtn" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M11 18L5 12L11 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="header-title">
            Message
          </div>
        </div>
        <div className="toggle-wrapper">
          <button className="toggle-btn active" id="unreadBtn" type="button" data-tab="unread">
            Unread
          </button>
          <button className="toggle-btn" id="allBtn" type="button" data-tab="all">
            All
          </button>
        </div>
        <div className="content-area" id="messageContent" />
      </div>
    </>
  );
}

