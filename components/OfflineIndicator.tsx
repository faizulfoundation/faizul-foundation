'use client';

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#5A0B0B] text-white px-4 py-2 text-xs sm:text-sm flex items-center justify-center gap-2"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        You are currently offline. Public pages remain viewable from cache, while submitting new help requests requires an internet connection.
      </span>
    </div>
  );
}
