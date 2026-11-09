import * as Location from 'expo-location';

import { findCurrentLocation, POSITION_TIMEOUT_MS } from '../use-current-location';

jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

const mocked = jest.mocked(Location);

function permission(status: 'granted' | 'denied' | 'undetermined', canAskAgain = true) {
  return { status, canAskAgain, granted: status === 'granted', expires: 'never' } as never;
}

const position = { coords: { latitude: 24.46667, longitude: 54.36667 } } as never;
const stalePosition = { coords: { latitude: 37.42, longitude: -122.08 } } as never;

beforeEach(() => {
  jest.resetAllMocks();
  mocked.getCurrentPositionAsync.mockResolvedValue(position);
  mocked.getLastKnownPositionAsync.mockResolvedValue(stalePosition);
  mocked.reverseGeocodeAsync.mockResolvedValue([
    { city: 'Abu Dhabi', region: 'Abu Dhabi', country: 'United Arab Emirates' } as never,
  ]);
});

describe('findCurrentLocation', () => {
  it('asks for permission on first use, then names the city it finds', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('undetermined'));
    mocked.requestForegroundPermissionsAsync.mockResolvedValue(permission('granted'));

    expect(await findCurrentLocation()).toEqual({
      status: 'granted',
      city: {
        id: 0,
        name: 'Abu Dhabi',
        region: 'Abu Dhabi',
        country: 'United Arab Emirates',
        latitude: 24.47,
        longitude: 54.37,
      },
    });
  });

  it('does not ask again once the user has answered', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('denied', true));

    expect(await findCurrentLocation()).toEqual({ status: 'denied', canAskAgain: true });
    expect(mocked.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('reports when the system will no longer show the prompt', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('denied', false));

    expect(await findCurrentLocation()).toEqual({ status: 'denied', canAskAgain: false });
  });

  it('trusts a fresh position over the cached one', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('granted'));

    const result = await findCurrentLocation();

    expect(result).toMatchObject({ city: { latitude: 24.47, longitude: 54.37 } });
    expect(mocked.getLastKnownPositionAsync).not.toHaveBeenCalled();
  });

  it('falls back to the cached position when a fresh fix fails', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
    mocked.getCurrentPositionAsync.mockRejectedValue(new Error('No fix'));

    expect(await findCurrentLocation()).toMatchObject({
      city: { latitude: 37.42, longitude: -122.08 },
    });
  });

  it('falls back to the cached position when a fresh fix takes too long', async () => {
    jest.useFakeTimers();
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
    mocked.getCurrentPositionAsync.mockReturnValue(new Promise(() => {}));

    const result = findCurrentLocation();
    await jest.advanceTimersByTimeAsync(POSITION_TIMEOUT_MS);

    expect(await result).toMatchObject({ city: { latitude: 37.42 } });
    jest.useRealTimers();
  });

  it('is unavailable when no position can be read at all', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
    mocked.getCurrentPositionAsync.mockRejectedValue(new Error('Location services are off'));
    mocked.getLastKnownPositionAsync.mockResolvedValue(null);

    expect(await findCurrentLocation()).toEqual({ status: 'unavailable' });
  });

  it('still returns the position when the place name lookup fails', async () => {
    mocked.getForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
    mocked.reverseGeocodeAsync.mockRejectedValue(new Error('Geocoder unavailable'));

    const result = await findCurrentLocation();

    expect(result).toMatchObject({ status: 'granted', city: { name: 'Current location' } });
  });
});
