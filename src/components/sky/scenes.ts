import type { WeatherKind } from '@/constants/weather-codes';

export type SkyWeather = { kind: WeatherKind; isDay: boolean };

export type Celestial = 'sun' | 'moon';

export type CloudTint = 'white' | 'grey' | 'night' | 'storm';

export type CloudSpec = {
  // Fraction of the sky's height.
  top: number;
  width: number;
  // Milliseconds to cross the screen once. Smaller, fainter clouds go slower, so they read as farther away.
  duration: number;
  // Where along its path the cloud starts, 0–1.
  phase: number;
  opacity: number;
  // Fog banks are long and flat.
  flatten?: number;
};

export type ParticleLayer = {
  shape: 'streak' | 'dot';
  count: number;
  // Pixels per second.
  speed: readonly [number, number];
  // Streak length or dot radius.
  size: readonly [number, number];
  // Sideways pixels per pixel fallen: the wind.
  slant: number;
  // Side-to-side swing in pixels, for snow.
  sway: number;
  color: string;
  strokeWidth?: number;
  seed: number;
};

export type SkyScene = {
  celestial?: Celestial;
  stars?: boolean;
  clouds?: { tint: CloudTint; specs: readonly CloudSpec[] };
  particles?: readonly ParticleLayer[];
  lightning?: boolean;
};

const FEW_CLOUDS: readonly CloudSpec[] = [
  { top: 0.07, width: 230, duration: 70_000, phase: 0.1, opacity: 0.9 },
  { top: 0.2, width: 160, duration: 95_000, phase: 0.55, opacity: 0.7 },
  { top: 0.02, width: 120, duration: 120_000, phase: 0.8, opacity: 0.5 },
];

const MANY_CLOUDS: readonly CloudSpec[] = [
  { top: -0.02, width: 320, duration: 60_000, phase: 0.05, opacity: 0.85 },
  { top: 0.09, width: 250, duration: 75_000, phase: 0.42, opacity: 0.75 },
  { top: 0.03, width: 200, duration: 95_000, phase: 0.72, opacity: 0.6 },
  { top: 0.19, width: 270, duration: 68_000, phase: 0.86, opacity: 0.7 },
  { top: 0.28, width: 180, duration: 115_000, phase: 0.25, opacity: 0.5 },
  { top: 0.14, width: 150, duration: 135_000, phase: 0.6, opacity: 0.45 },
];

const FOG_BANKS: readonly CloudSpec[] = [
  { top: 0.12, width: 520, duration: 160_000, phase: 0.2, opacity: 0.45, flatten: 0.5 },
  { top: 0.32, width: 600, duration: 200_000, phase: 0.7, opacity: 0.4, flatten: 0.5 },
  { top: 0.52, width: 480, duration: 180_000, phase: 0.45, opacity: 0.35, flatten: 0.5 },
  { top: 0.72, width: 560, duration: 220_000, phase: 0.9, opacity: 0.35, flatten: 0.5 },
];

const DRIZZLE: ParticleLayer = {
  shape: 'streak',
  count: 60,
  speed: [380, 520],
  size: [6, 10],
  slant: 0.06,
  sway: 0,
  color: 'rgba(220, 235, 255, 0.32)',
  strokeWidth: 1,
  seed: 1,
};

const RAIN: ParticleLayer = {
  shape: 'streak',
  count: 110,
  speed: [850, 1150],
  size: [14, 22],
  slant: 0.1,
  sway: 0,
  color: 'rgba(210, 230, 255, 0.38)',
  strokeWidth: 1.2,
  seed: 2,
};

const DOWNPOUR: ParticleLayer = {
  shape: 'streak',
  count: 150,
  speed: [1100, 1500],
  size: [18, 28],
  slant: 0.18,
  sway: 0,
  color: 'rgba(200, 220, 255, 0.42)',
  strokeWidth: 1.3,
  seed: 3,
};

const SNOW: ParticleLayer = {
  shape: 'dot',
  count: 70,
  speed: [35, 75],
  size: [1.5, 3.5],
  slant: 0.05,
  sway: 14,
  color: 'rgba(255, 255, 255, 0.85)',
  seed: 4,
};

const HAIL: ParticleLayer = {
  shape: 'dot',
  count: 40,
  speed: [650, 850],
  size: [1.5, 2.5],
  slant: 0.1,
  sway: 0,
  color: 'rgba(235, 245, 255, 0.9)',
  seed: 5,
};

export function sceneFor({ kind, isDay }: SkyWeather): SkyScene {
  const overcast = { tint: isDay ? 'grey' : 'night', specs: MANY_CLOUDS } as const;
  const storm = { tint: 'storm', specs: MANY_CLOUDS } as const;

  switch (kind) {
    case 'clear':
      return { celestial: isDay ? 'sun' : 'moon', stars: !isDay };
    case 'partlyCloudy':
      return {
        celestial: isDay ? 'sun' : 'moon',
        stars: !isDay,
        clouds: { tint: isDay ? 'white' : 'night', specs: FEW_CLOUDS },
      };
    case 'fog':
      return { clouds: { tint: isDay ? 'white' : 'night', specs: FOG_BANKS } };
    case 'drizzle':
      return { clouds: overcast, particles: [DRIZZLE] };
    case 'rain':
      return { clouds: overcast, particles: [RAIN] };
    case 'snow':
      return { clouds: overcast, particles: [SNOW] };
    case 'storm':
      return { clouds: storm, particles: [DOWNPOUR], lightning: true };
    case 'hail':
      return { clouds: storm, particles: [DOWNPOUR, HAIL], lightning: true };
    case 'cloudy':
      return { clouds: overcast };
  }
}
