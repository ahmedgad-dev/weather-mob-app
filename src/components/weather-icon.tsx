import { SymbolView } from 'expo-symbols';

import type { SymbolName } from '@/components/ui/icon';
import type { WeatherKind } from '@/constants/weather-codes';
import { colors } from '@/styles/tokens';

const DAY: Record<WeatherKind, SymbolName> = {
  clear: { ios: 'sun.max.fill', android: 'sunny', web: 'sunny' },
  partlyCloudy: { ios: 'cloud.sun.fill', android: 'partly_cloudy_day', web: 'partly_cloudy_day' },
  cloudy: { ios: 'cloud.fill', android: 'cloud', web: 'cloud' },
  fog: { ios: 'cloud.fog.fill', android: 'foggy', web: 'foggy' },
  drizzle: { ios: 'cloud.drizzle.fill', android: 'rainy_light', web: 'rainy_light' },
  rain: { ios: 'cloud.rain.fill', android: 'rainy', web: 'rainy' },
  snow: { ios: 'cloud.snow.fill', android: 'weather_snowy', web: 'weather_snowy' },
  storm: { ios: 'cloud.bolt.rain.fill', android: 'thunderstorm', web: 'thunderstorm' },
  hail: { ios: 'cloud.hail.fill', android: 'weather_hail', web: 'weather_hail' },
};

const NIGHT: Partial<Record<WeatherKind, SymbolName>> = {
  clear: { ios: 'moon.stars.fill', android: 'bedtime', web: 'bedtime' },
  partlyCloudy: {
    ios: 'cloud.moon.fill',
    android: 'partly_cloudy_night',
    web: 'partly_cloudy_night',
  },
};

type Props = {
  kind: WeatherKind;
  isDay?: boolean;
  size?: number;
};

export function WeatherIcon({ kind, isDay = true, size = 28 }: Props) {
  const name = (!isDay && NIGHT[kind]) || DAY[kind];
  const color = isDay && kind === 'clear' ? colors.sun : colors.textPrimary;

  return <SymbolView name={name} size={size} tintColor={color} />;
}
