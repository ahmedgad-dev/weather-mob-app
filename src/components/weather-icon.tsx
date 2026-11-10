import {
  Canvas,
  Group,
  Skia,
  Skottie,
  useClock,
  type SkSkottieAnimation,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, useReducedMotion } from 'react-native-reanimated';

import type { WeatherKind } from '@/constants/weather-codes';

// Meteocons "fill" Lottie files (MIT, see assets/weather-icons/LICENSE).
const FILES = {
  'clear-day': require('@/assets/weather-icons/clear-day.json'),
  'clear-night': require('@/assets/weather-icons/clear-night.json'),
  'partly-cloudy-day': require('@/assets/weather-icons/partly-cloudy-day.json'),
  'partly-cloudy-night': require('@/assets/weather-icons/partly-cloudy-night.json'),
  overcast: require('@/assets/weather-icons/overcast.json'),
  fog: require('@/assets/weather-icons/fog.json'),
  drizzle: require('@/assets/weather-icons/drizzle.json'),
  rain: require('@/assets/weather-icons/rain.json'),
  snow: require('@/assets/weather-icons/snow.json'),
  'thunderstorms-rain': require('@/assets/weather-icons/thunderstorms-rain.json'),
  hail: require('@/assets/weather-icons/hail.json'),
};

type IconFile = keyof typeof FILES;

const DAY: Record<WeatherKind, IconFile> = {
  clear: 'clear-day',
  partlyCloudy: 'partly-cloudy-day',
  cloudy: 'overcast',
  fog: 'fog',
  drizzle: 'drizzle',
  rain: 'rain',
  snow: 'snow',
  storm: 'thunderstorms-rain',
  hail: 'hail',
};

const NIGHT: Partial<Record<WeatherKind, IconFile>> = {
  clear: 'clear-night',
  partlyCloudy: 'partly-cloudy-night',
};

// 2 s into the 6 s loop: rain and snow are mid-fall, where frame 0 shows them barely started.
const STILL_FRAME = 120;

type Props = {
  kind: WeatherKind;
  isDay?: boolean;
  size: number;
  animated?: boolean;
};

export function WeatherIcon({ kind, isDay = true, size, animated = false }: Props) {
  const file = (!isDay && NIGHT[kind]) || DAY[kind];
  const animation = useMemo(() => Skia.Skottie.Make(JSON.stringify(FILES[file])), [file]);
  const reduceMotion = useReducedMotion();
  const scale = size / animation.size().width;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={[{ scale }]}>
        {animated && !reduceMotion ? (
          <PlayingSkottie animation={animation} />
        ) : (
          <Skottie animation={animation} frame={STILL_FRAME} />
        )}
      </Group>
    </Canvas>
  );
}

function PlayingSkottie({ animation }: { animation: SkSkottieAnimation }) {
  const clock = useClock();
  const fps = animation.fps();
  const totalFrames = animation.duration() * fps;
  const frame = useDerivedValue(() => ((clock.value / 1000) * fps) % totalFrames);

  return <Skottie animation={animation} frame={frame} />;
}
