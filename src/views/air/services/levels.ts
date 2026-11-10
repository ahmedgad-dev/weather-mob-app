export type AqiLevel = {
  label: string;
  color: string;
  advice: string;
  max: number;
};

// US EPA bands and colours.
export const AQI_LEVELS: readonly AqiLevel[] = [
  {
    max: 50,
    label: 'Good',
    color: '#00E400',
    advice: 'Great air for being outside.',
  },
  {
    max: 100,
    label: 'Moderate',
    color: '#FFFF00',
    advice: 'Fine for most people. Unusually sensitive people may want to take it easy outdoors.',
  },
  {
    max: 150,
    label: 'Unhealthy for sensitive groups',
    color: '#FF7E00',
    advice: 'Children, older adults and people with asthma should limit long outdoor activity.',
  },
  {
    max: 200,
    label: 'Unhealthy',
    color: '#FF0000',
    advice: 'Everyone should cut back on long or intense outdoor activity.',
  },
  {
    max: 300,
    label: 'Very unhealthy',
    color: '#8F3F97',
    advice: 'Avoid long or intense outdoor activity.',
  },
  {
    max: Infinity,
    label: 'Hazardous',
    color: '#7E0023',
    advice: 'Stay indoors and keep activity low.',
  },
];

export function aqiLevel(aqi: number): AqiLevel {
  return AQI_LEVELS.find((level) => aqi <= level.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

const SCALE_TOP = 500;

// Where an AQI sits on a bar of equal-width bands, from 0 to 1. The bands cover very different
// ranges (50 points for Good, 200 for Hazardous), so the marker moves within its own band.
export function aqiScalePosition(aqi: number) {
  const clamped = Math.min(Math.max(aqi, 0), SCALE_TOP);
  const index = AQI_LEVELS.findIndex((level) => clamped <= level.max);
  const min = index === 0 ? 0 : AQI_LEVELS[index - 1].max;
  const max = Math.min(AQI_LEVELS[index].max, SCALE_TOP);

  return (index + (clamped - min) / (max - min)) / AQI_LEVELS.length;
}

const UV_LEVELS = [
  { max: 2, label: 'Low' },
  { max: 5, label: 'Moderate' },
  { max: 7, label: 'High' },
  { max: 10, label: 'Very high' },
  { max: Infinity, label: 'Extreme' },
] as const;

// WHO bands are defined on whole numbers.
export function uvLevel(uvIndex: number) {
  const rounded = Math.round(uvIndex);

  return UV_LEVELS.find((level) => rounded <= level.max)!.label;
}
