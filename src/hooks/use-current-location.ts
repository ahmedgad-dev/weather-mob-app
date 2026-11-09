import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

import type { City } from '@/api/geocoding';
import { DEFAULT_CITY } from '@/constants/default-city';

export const CURRENT_LOCATION_ID = 'current';

export type CurrentLocation =
  | { status: 'granted'; city: City }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'unavailable' };

const TEN_MINUTES = 10 * 60 * 1000;
export const POSITION_TIMEOUT_MS = 10_000;

// About 1 km of precision keeps the forecast cache key stable while GPS readings jitter.
const round = (value: number) => Math.round(value * 100) / 100;

// A fresh fix first, so a phone that has moved (or an emulator given a new position) is believed;
// Android's cached last-known position only when a fresh fix fails or takes too long.
async function readPosition() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timed out')), POSITION_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      timeout,
    ]);
  } catch {
    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: TEN_MINUTES });

    if (!lastKnown) throw new Error('No position available');

    return lastKnown;
  } finally {
    clearTimeout(timer);
  }
}

export async function findCurrentLocation(): Promise<CurrentLocation> {
  let permission = await Location.getForegroundPermissionsAsync();

  if (permission.status === 'undetermined') {
    permission = await Location.requestForegroundPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    return { status: 'denied', canAskAgain: permission.canAskAgain };
  }

  try {
    const position = await readPosition();
    const latitude = round(position.coords.latitude);
    const longitude = round(position.coords.longitude);

    return {
      status: 'granted',
      city: { id: 0, latitude, longitude, ...(await describePlace(latitude, longitude)) },
    };
  } catch {
    return { status: 'unavailable' };
  }
}

async function describePlace(latitude: number, longitude: number) {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

    return {
      name: place?.city ?? place?.subregion ?? place?.region ?? 'Current location',
      region: place?.region ?? undefined,
      country: place?.country ?? undefined,
    };
  } catch {
    return { name: 'Current location' };
  }
}

export function useCurrentLocation() {
  const {
    data: location,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['current-location'],
    queryFn: findCurrentLocation,
    // Without a location, check again each time the app returns to the foreground (e.g. from Settings).
    staleTime: (query) => (query.state.data?.status === 'granted' ? TEN_MINUTES : 0),
    retry: false,
  });

  return {
    location,
    city: location?.status === 'granted' ? location.city : DEFAULT_CITY,
    isFallback: location?.status !== 'granted',
    isPending,
    refetch,
  };
}
