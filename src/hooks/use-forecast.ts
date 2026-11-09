import { skipToken, useQuery } from '@tanstack/react-query';

import { fetchForecast, type Coordinates } from '@/api/open-meteo';

export function useForecast(coordinates: Coordinates | undefined) {
  return useQuery({
    queryKey: ['forecast', coordinates?.latitude, coordinates?.longitude],
    queryFn: coordinates ? () => fetchForecast(coordinates) : skipToken,
  });
}
