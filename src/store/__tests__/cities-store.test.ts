import type { City } from '@/api/geocoding';
import { DEFAULT_CITY } from '@/constants/default-city';

import { useCitiesStore } from '../cities-store';

const RIYADH: City = {
  id: 108410,
  name: 'Riyadh',
  country: 'Saudi Arabia',
  region: 'Riyadh Region',
  latitude: 24.68773,
  longitude: 46.72185,
};

beforeEach(() => {
  useCitiesStore.setState({ cities: [] });
});

describe('useCitiesStore', () => {
  it('adds a city to the end of the list', () => {
    useCitiesStore.getState().addCity(DEFAULT_CITY);
    useCitiesStore.getState().addCity(RIYADH);

    expect(useCitiesStore.getState().cities.map((city) => city.name)).toEqual(['Dubai', 'Riyadh']);
  });

  it('ignores a city that is already saved', () => {
    useCitiesStore.getState().addCity(RIYADH);
    useCitiesStore.getState().addCity(RIYADH);

    expect(useCitiesStore.getState().cities).toHaveLength(1);
  });

  it('removes a city by id', () => {
    useCitiesStore.getState().addCity(DEFAULT_CITY);
    useCitiesStore.getState().addCity(RIYADH);
    useCitiesStore.getState().removeCity(DEFAULT_CITY.id);

    expect(useCitiesStore.getState().cities).toEqual([RIYADH]);
  });
});

describe('saved data migration', () => {
  const migrate = useCitiesStore.persist.getOptions().migrate!;

  it('drops the Dubai that version 0 pre-saved', async () => {
    expect(await migrate({ cities: [DEFAULT_CITY, RIYADH] }, 0)).toEqual({ cities: [RIYADH] });
  });

  it('leaves current data untouched', async () => {
    expect(await migrate({ cities: [DEFAULT_CITY] }, 1)).toEqual({ cities: [DEFAULT_CITY] });
  });
});
