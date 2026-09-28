import { useStore } from '@/lib/store';
import { useState } from 'react';
import AddToolV2 from './AddToolV2';
import LinkedToolsV2 from './LinkedToolsV2';

/**
 * Entry for Add Wallet / Add Tool.
 * New users (no linked wallet) land straight on the supplied empty Tool screen.
 * Existing users see database-backed linked tool cards from the supplied design.
 * The PIN check happens later, right before the app setup / APK step opens.
 */
export default function WalletEntry() {
  const { currentUser, loading } = useStore();
  const [adding, setAdding] = useState(false);
  if (loading) {
    return <div className="grid min-h-[calc(100dvh-72px)] place-items-center bg-[#F5F7FC] text-sm font-medium text-[#0F8A5F]">Loading</div>;
  }
  const hasWallet = (currentUser?.upis?.length ?? 0) > 0;
  if (!hasWallet) return <AddToolV2 onDone={() => setAdding(false)} />;
  if (adding) return <AddToolV2 startAtChoose onDone={() => setAdding(false)} />;
  return <LinkedToolsV2 onAdd={() => setAdding(true)} />;
}
