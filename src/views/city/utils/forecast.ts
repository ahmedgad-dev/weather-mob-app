import type { DailyItem, Forecast, HourlyItem } from '@/api/open-meteo';

export function getNext24Hours(forecast: Forecast): HourlyItem[] {
  const { current } = forecast;
  const currentHour = current.time.slice(0, 13);
  const [now, ...later] = forecast.hourly
    .filter((hour) => hour.time.slice(0, 13) >= currentHour)
    .slice(0, 24);

  if (!now) return [];

  // "Now" shows the live reading, not the forecast for the whole hour, so it matches the hero.
  return [
    {
      ...now,
      temperature: current.temperature,
      weatherCode: current.weatherCode,
      isDay: current.isDay,
    },
    ...later,
  ];
}

export function getTemperatureRange(days: DailyItem[]) {
  return {
    min: Math.min(...days.map((day) => day.min)),
    max: Math.max(...days.map((day) => day.max)),
  };
}
