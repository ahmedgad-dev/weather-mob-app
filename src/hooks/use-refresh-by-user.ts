import { useState } from 'react';

// Background refetches shouldn't show the pull-to-refresh spinner; only the user's own pull should.
export function useRefreshByUser(refetch: () => Promise<unknown>) {
  const [isRefreshingByUser, setIsRefreshingByUser] = useState(false);

  async function refreshByUser() {
    setIsRefreshingByUser(true);

    try {
      await refetch();
    } finally {
      setIsRefreshingByUser(false);
    }
  }

  return { isRefreshingByUser, refreshByUser };
}
