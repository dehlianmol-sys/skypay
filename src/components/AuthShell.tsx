import type { ReactNode } from 'react';
import { APP_LOGO, APP_LOGO_FALLBACK, APP_NAME } from '../lib/brand';
import CachedImage from '@/components/CachedImage';

/* Auth UI styles taken from the buddy-connect-hub reference, scoped to .bch-auth */
const AUTH_CSS = `
.bch-auth{min-height:100dvh;background:#fff;padding:36px 20px;display:flex;justify-content:center;color:#202124;font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;}
.bch-auth *{box-sizing:border-box;}
.bch-auth .auth-card{width:100%;max-width:440px;}
.bch-auth .brand{display:flex;align-items:center;gap:10px;justify-content:center;margin:10px 0 40px;}
.bch-auth .brand img{width:92px;height:92px;border-radius:50%;object-fit:cover;box-shadow:0 4px 12px rgba(21,32,45,.09);}
.bch-auth h1{font-size:28px;line-height:1.2;margin:0 0 7px;font-weight:800;}
.bch-auth .auth-intro{color:#787878;margin:0 0 24px;}
.bch-auth label{display:block;font-size:18px;font-weight:600;margin-bottom:20px;}
.bch-auth .phone-input,.bch-auth .field{display:flex;align-items:center;border:1.5px solid #a9a9a9;border-radius:12px;min-height:58px;margin-top:8px;padding:0 16px;background:#fff;}
.bch-auth .phone-input span{color:#555;white-space:nowrap;}
.bch-auth .phone-input em{font-style:normal;color:#aaa;margin:0 10px;}
.bch-auth .phone-input input,.bch-auth .field input{border:0;outline:0;min-width:0;flex:1;font-size:17px;color:#333;background:transparent;}
.bch-auth input::placeholder{color:#aaa;}
.bch-auth .hint{display:block;color:#8a8a8a;font-size:13px;font-weight:400;margin-top:6px;}
.bch-auth .error-box{background:#fff2f2;border:1px solid #f0b8b8;color:#a22525;border-radius:10px;padding:12px;font-size:13px;margin:-6px 0 18px;}
.bch-auth .dark-button{width:100%;padding:16px;border:0;border-radius:12px;background:#303030;color:#fff;font-size:18px;font-weight:700;cursor:pointer;transition:transform .2s,opacity .2s;}
.bch-auth .dark-button:hover{transform:translateY(-1px);}
.bch-auth .dark-button:disabled{opacity:.55;cursor:wait;}
.bch-auth .auth-switch{text-align:center;color:#666;margin:28px 0 12px;}
.bch-auth .auth-switch a{color:#1d5eaf;font-weight:700;text-decoration:none;}
`;

export default function AuthShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="bch-auth">
      <style dangerouslySetInnerHTML={{ __html: AUTH_CSS }} />
      <div className="auth-card">
        <div className="brand">
          <CachedImage src={APP_LOGO} fallbackSrc={APP_LOGO_FALLBACK} cacheKey="app-logo-v2" alt={`${APP_NAME} logo`} />
        </div>
        <h1>{title}</h1>
        <p className="auth-intro">{intro}</p>
        {children}
      </div>
    </main>
  );
}
