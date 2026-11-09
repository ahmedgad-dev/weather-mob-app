import type { City } from '@/api/geocoding';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatTemperature = (celsius: number) => `${Math.round(celsius)}°`;

// Times arrive in the city's local time; reading them as text keeps the phone's time zone out of it.
export const formatHour = (time: string) => time.slice(11, 16);

export function formatDay(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

export function formatPlace({ name, region, country }: City) {
  return [region !== name ? region : undefined, country].filter(Boolean).join(', ');
}
