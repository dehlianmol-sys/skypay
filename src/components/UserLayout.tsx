import { Outlet, useLocation } from '@/lib/router-compat';
import { type ReactNode } from 'react';
import WalletNav, { type NavKey } from './v2/WalletNav';
import SupportFab from './v2/SupportFab';
import PullToRefresh from './PullToRefresh';
import BusyPill from './BusyPill';
import { useStore } from '@/lib/store';

function activeKey(pathname: string): NavKey | undefined {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/payment') || pathname.startsWith('/order')) return 'payment';
  if (pathname.startsWith('/statistics')) return 'statistics';
  if (pathname.startsWith('/mine')) return 'my';
  return undefined;
}

export default function UserLayout({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const { refreshData } = useStore();
  return (
    <div className="vp vp-shell">
      <PullToRefresh onRefresh={refreshData}>
        {children ?? <Outlet />}
      </PullToRefresh>
      {!pathname.startsWith('/mine') && !pathname.startsWith('/customer-service') && <SupportFab />}
      <WalletNav active={activeKey(pathname)} />
      <BusyPill />
    </div>
  );
}
