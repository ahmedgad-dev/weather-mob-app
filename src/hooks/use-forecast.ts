import { useQuery } from '@tanstack/react-query';

import { fetchForecast, type City } from '@/api/open-meteo';

export function useForecast(city: City) {
  return useQuery({
    queryKey: ['forecast', city.latitude, city.longitude],
    queryFn: () => fetchForecast(city),
  });
}
