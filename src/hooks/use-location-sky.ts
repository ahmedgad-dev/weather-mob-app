import { describeWeather } from '@/constants/weather-codes';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useForecast } from '@/hooks/use-forecast';
import { celestialFor, NIGHT_SKY, skyFor } from '@/styles/sky';

// The tab screens wear the sky of wherever the user is. TanStack Query shares these two queries
// across every screen that calls this, so it adds no requests.
export function useLocationSky() {
  const { city, isPending } = useCurrentLocation();
  const { data: forecast } = useForecast(isPending ? undefined : city);

  if (!forecast) return { sky: NIGHT_SKY, celestial: undefined };

  const { kind } = describeWeather(forecast.current.weatherCode);

  return {
    sky: skyFor(kind, forecast.current.isDay),
    celestial: celestialFor(kind, forecast.current.isDay),
  };
}
