import type { WeatherKind } from '@/constants/weather-codes';

export type Sky = readonly [string, string];

const SKIES = {
  clearDay: ['#2E7BD8', '#6FB7F0'],
  clearNight: ['#0B1530', '#1F3561'],
  cloudyDay: ['#5D7590', '#9AAFC4'],
  cloudyNight: ['#1C2533', '#36475D'],
  fog: ['#6E7C8A', '#A9B6C2'],
  rainDay: ['#3B5068', '#6A8099'],
  rainNight: ['#141C28', '#2E3D50'],
  snow: ['#5F7FA6', '#A4BCD9'],
  storm: ['#24243E', '#4A4A6A'],
} as const satisfies Record<string, Sky>;

export const NIGHT_SKY: Sky = SKIES.clearNight;

export function skyFor(kind: WeatherKind, isDay: boolean): Sky {
  switch (kind) {
    case 'storm':
    case 'hail':
      return SKIES.storm;
    case 'snow':
      return SKIES.snow;
    case 'drizzle':
    case 'rain':
      return isDay ? SKIES.rainDay : SKIES.rainNight;
    case 'fog':
      return SKIES.fog;
    case 'cloudy':
      return isDay ? SKIES.cloudyDay : SKIES.cloudyNight;
    default:
      return isDay ? SKIES.clearDay : SKIES.clearNight;
  }
}
