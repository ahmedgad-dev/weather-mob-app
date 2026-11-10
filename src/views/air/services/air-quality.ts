import type { Coordinates } from '@/api/open-meteo';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Model data can have gaps, so every reading may be missing.
export type AirQuality = {
  time: string;
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  ozone: number | null;
  nitrogenDioxide: number | null;
  uvIndex: number | null;
};

type AirQualityResponse = {
  current: {
    time: string;
    us_aqi: number | null;
    pm2_5: number | null;
    pm10: number | null;
    ozone: number | null;
    nitrogen_dioxide: number | null;
    uv_index: number | null;
  };
};

export async function fetchAirQuality({ latitude, longitude }: Coordinates): Promise<AirQuality> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,uv_index',
    timezone: 'auto',
  });

  const response = await fetch(`${AIR_QUALITY_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo returned ${response.status}`);
  }

  const { current }: AirQualityResponse = await response.json();

  return {
    time: current.time,
    usAqi: current.us_aqi,
    pm2_5: current.pm2_5,
    pm10: current.pm10,
    ozone: current.ozone,
    nitrogenDioxide: current.nitrogen_dioxide,
    uvIndex: current.uv_index,
  };
}
