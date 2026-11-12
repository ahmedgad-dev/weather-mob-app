import type { SkyWeather } from '@/components/sky/scenes';
import { describeWeather } from '@/constants/weather-codes';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useForecast } from '@/hooks/use-forecast';

// The tab screens wear the sky of wherever the user is. TanStack Query shares these two queries
// across every screen that calls this, so it adds no requests.
export function useLocationSky(): SkyWeather | undefined {
  const { city, isPending } = useCurrentLocation();
  const { data: forecast } = useForecast(isPending ? undefined : city);

  if (!forecast) return undefined;

  return {
    kind: describeWeather(forecast.current.weatherCode).kind,
    isDay: forecast.current.isDay,
  };
}
