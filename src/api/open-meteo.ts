const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type HourlyItem = {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationChance: number;
  isDay: boolean;
};

export type DailyItem = {
  date: string;
  min: number;
  max: number;
  weatherCode: number;
  precipitationChance: number;
};

export type Forecast = {
  current: {
    time: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    isDay: boolean;
  };
  hourly: HourlyItem[];
  daily: DailyItem[];
};

type ForecastResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
    is_day: number[];
  };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
    precipitation_probability_max: (number | null)[];
  };
};

export async function fetchForecast({ latitude, longitude }: Coordinates): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily: 'temperature_2m_min,temperature_2m_max,weather_code,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo returned ${response.status}`);
  }

  return toForecast(await response.json());
}

// Open-Meteo sends one array per field; lists need one object per row.
function toForecast({ current, hourly, daily }: ForecastResponse): Forecast {
  return {
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.map((time, i) => ({
      time,
      temperature: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      precipitationChance: hourly.precipitation_probability[i] ?? 0,
      isDay: hourly.is_day[i] === 1,
    })),
    daily: daily.time.map((date, i) => ({
      date,
      min: daily.temperature_2m_min[i],
      max: daily.temperature_2m_max[i],
      weatherCode: daily.weather_code[i],
      precipitationChance: daily.precipitation_probability_max[i] ?? 0,
    })),
  };
}
