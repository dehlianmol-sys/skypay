export const css = `
.tool-scope *{ box-sizing: border-box; margin: 0; padding: 0; }
.tool-scope button{ font: inherit; }
.tool-scope .backdrop{
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(2px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
.tool-scope .backdrop.is-visible{
      opacity: 1;
      visibility: visible;
    }
.tool-scope .modal{
      position: relative;
      width: 100%;
      max-width: 340px; 
      background: #ffffff;
      border-radius: 16px;
      padding: 20px 18px 16px;
      box-shadow: var(--shadow);
      transform: scale(0.92);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
.tool-scope .backdrop.is-visible .modal{
    transform: scale(1);
    }
.tool-scope .modal-close-btn{
      position: absolute;
      top: 14px;
      right: 16px;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      color: #777;
      font-size: 22px;
      font-weight: 400;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s, color 0.2s;
    }
.tool-scope .modal-close-btn:hover{
      background: #f0f0f0;
      color: #333;
    }
.tool-scope .modal-header{
      margin-bottom: 12px;
      padding-right: 30px;
    }
.tool-scope .modal-title{
      color: var(--green);
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
.tool-scope .tool-list{
      display: flex;
      flex-direction: column;
      width: 100%;
    }
.tool-scope .tool-option{
      width: 100%;
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
      background: transparent;
      border-top: 0; border-left: 0; border-right: 0;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s ease;
    }
.tool-scope .tool-option:last-child{
      border-bottom: none; 
    }
.tool-scope .tool-logo{
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #ffffff;
      border-radius: 10px;
      font-size: 24px;
      font-weight: 900;
    }
.tool-scope .tool-logo img{ width:100%; height:100%; object-fit:contain; }
.tool-scope .tool-copy{
      min-width: 0;
      flex: 1;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
    }
.tool-scope .tool-name{
      color: var(--ink);
      font-size: 16px;
      font-weight: 700;
      line-height: 1.2;
    }
.tool-scope .tool-number{
      margin-top: 3px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.2;
      overflow-wrap: anywhere;
      word-break: break-word;
      font-variant-numeric: tabular-nums;
    }
.tool-scope .radio{
      width: 22px;
      height: 22px;
      flex: 0 0 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--green);
      border-radius: 50%;
      margin-left: 8px;
    }
.tool-scope .radio::after{
      content: "";
      width: 12px;
      height: 12px;
      background: transparent;
      border-radius: 50%;
      transition: background-color 0.15s ease;
    }
.tool-scope .tool-option.is-selected .radio::after{
      background: var(--green);
    }
.tool-scope .footer-note{
      margin: 14px 0 16px;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.35;
      text-align: center;
    }
.tool-scope .modal-actions{
      display: flex;
      gap: 10px;
      width: 100%;
    }
.tool-scope .cancel-button, .tool-scope .confirm-button{
      flex: 1;
      height: 42px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s ease;
    }
.tool-scope .cancel-button{
      color: var(--green);
      background: #ffffff;
      border: 1px solid #d0e5dd;
    }
.tool-scope .cancel-button:active{
      background: var(--green-soft);
    }
.tool-scope .confirm-button{
      color: #ffffff;
      background: var(--green);
      border: none;
    }
.tool-scope .confirm-button:hover{
      background: var(--green-deep);
    }
.tool-scope .details-modal{
      max-width: 340px;
      padding: 30px 20px 20px;
      text-align: center;
    }
.tool-scope .details-title{
      margin-bottom: 12px;
      color: var(--ink);
      font-size: 20px;
      font-weight: 700;
    }
.tool-scope .details-copy{
      margin-bottom: 20px;
      color: #555;
      font-size: 13px;
      line-height: 1.45;
    }
.tool-scope .details-confirm{
      width: 100%;
      height: 44px;
      border-radius: 22px;
      background: var(--green);
      color: #fff;
      border: none;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }
.tool-scope .details-confirm:disabled{
      background: #ccc;
      cursor: not-allowed;
    }
.tool-scope .toast{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 200;
      width: min(360px, calc(100vw - 48px));
      max-width: none;
      padding: 14px 18px;
      color: #ffffff;
      background: rgba(45, 45, 45, 0.94);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }
.tool-scope .toast.is-visible{
      opacity: 1;
      visibility: visible;
    }
`;
