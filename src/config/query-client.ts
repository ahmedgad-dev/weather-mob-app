import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Weather changes slowly: reuse a forecast for 10 minutes before refetching it.
      staleTime: 10 * 60 * 1000,
    },
  },
});
