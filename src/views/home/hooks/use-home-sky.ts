import { describeWeather } from '@/constants/weather-codes';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useForecast } from '@/hooks/use-forecast';
import { celestialFor, NIGHT_SKY, skyFor } from '@/styles/sky';

// The home screen wears the sky of wherever the user is. TanStack Query shares these two queries
// with LocationCard, so this adds no requests.
export function useHomeSky() {
  const { city, isPending } = useCurrentLocation();
  const { data: forecast } = useForecast(isPending ? undefined : city);

  if (!forecast) return { sky: NIGHT_SKY, celestial: undefined };

  const { kind } = describeWeather(forecast.current.weatherCode);

  return {
    sky: skyFor(kind, forecast.current.isDay),
    celestial: celestialFor(kind, forecast.current.isDay),
  };
}
