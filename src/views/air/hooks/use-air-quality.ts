import { skipToken, useQuery } from '@tanstack/react-query';

import type { Coordinates } from '@/api/open-meteo';
import { fetchAirQuality } from '@/views/air/services/air-quality';

export function useAirQuality(coordinates: Coordinates | undefined) {
  return useQuery({
    queryKey: ['air-quality', coordinates?.latitude, coordinates?.longitude],
    queryFn: coordinates ? () => fetchAirQuality(coordinates) : skipToken,
  });
}
