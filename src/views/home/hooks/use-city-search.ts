import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchCities } from '@/api/geocoding';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export const MIN_QUERY_LENGTH = 2;

export function useCitySearch(query: string) {
  const debouncedQuery = useDebouncedValue(query.trim());

  return useQuery({
    queryKey: ['city-search', debouncedQuery],
    // TanStack aborts the request through `signal` when the user keeps typing.
    queryFn: ({ signal }) => searchCities(debouncedQuery, signal),
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
