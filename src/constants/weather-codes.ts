export type WeatherKind =
  'clear' | 'partlyCloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm' | 'hail';

type WeatherInfo = {
  label: string;
  kind: WeatherKind;
};

const WEATHER_CODES: Record<number, WeatherInfo> = {
  0: { label: 'Clear sky', kind: 'clear' },
  1: { label: 'Mainly clear', kind: 'clear' },
  2: { label: 'Partly cloudy', kind: 'partlyCloudy' },
  3: { label: 'Overcast', kind: 'cloudy' },
  45: { label: 'Fog', kind: 'fog' },
  48: { label: 'Freezing fog', kind: 'fog' },
  51: { label: 'Light drizzle', kind: 'drizzle' },
  53: { label: 'Drizzle', kind: 'drizzle' },
  55: { label: 'Heavy drizzle', kind: 'drizzle' },
  56: { label: 'Freezing drizzle', kind: 'drizzle' },
  57: { label: 'Freezing drizzle', kind: 'drizzle' },
  61: { label: 'Light rain', kind: 'rain' },
  63: { label: 'Rain', kind: 'rain' },
  65: { label: 'Heavy rain', kind: 'rain' },
  66: { label: 'Freezing rain', kind: 'rain' },
  67: { label: 'Freezing rain', kind: 'rain' },
  71: { label: 'Light snow', kind: 'snow' },
  73: { label: 'Snow', kind: 'snow' },
  75: { label: 'Heavy snow', kind: 'snow' },
  77: { label: 'Snow grains', kind: 'snow' },
  80: { label: 'Rain showers', kind: 'rain' },
  81: { label: 'Rain showers', kind: 'rain' },
  82: { label: 'Violent rain showers', kind: 'rain' },
  85: { label: 'Snow showers', kind: 'snow' },
  86: { label: 'Snow showers', kind: 'snow' },
  95: { label: 'Thunderstorm', kind: 'storm' },
  96: { label: 'Thunderstorm with hail', kind: 'hail' },
  99: { label: 'Thunderstorm with hail', kind: 'hail' },
};

export function describeWeather(code: number): WeatherInfo {
  return WEATHER_CODES[code] ?? { label: 'Unknown', kind: 'cloudy' };
}
