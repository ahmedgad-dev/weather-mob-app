import type { Coordinates } from '@/api/open-meteo';

const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export type City = Coordinates & {
  id: number;
  name: string;
  country?: string;
  region?: string;
};

type SearchResponse = {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }[];
};

export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const params = new URLSearchParams({
    name: query.trim(),
    count: '10',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${SEARCH_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`City search returned ${response.status}`);
  }

  // Open-Meteo leaves out `results` entirely when nothing matches.
  const { results = [] }: SearchResponse = await response.json();

  return results.map(({ id, name, latitude, longitude, country, admin1 }) => ({
    id,
    name,
    latitude,
    longitude,
    country,
    region: admin1,
  }));
}
