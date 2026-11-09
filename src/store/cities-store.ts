import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { City } from '@/api/geocoding';
import { DEFAULT_CITY } from '@/constants/default-city';

type CitiesState = {
  cities: City[];
  addCity: (city: City) => void;
  removeCity: (id: number) => void;
};

type SavedCities = Pick<CitiesState, 'cities'>;

export const useCitiesStore = create<CitiesState>()(
  persist(
    (set) => ({
      cities: [],
      addCity: (city) =>
        set((state) =>
          state.cities.some((saved) => saved.id === city.id)
            ? state
            : { cities: [...state.cities, city] }
        ),
      removeCity: (id) =>
        set((state) => ({ cities: state.cities.filter((city) => city.id !== id) })),
    }),
    {
      name: 'saved-cities',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): SavedCities => ({ cities: state.cities }),
      version: 1,
      // Version 0 pre-saved Dubai; it is now the location fallback instead.
      migrate: (persisted, version) => {
        const { cities } = persisted as SavedCities;

        return version === 0
          ? { cities: cities.filter((city) => city.id !== DEFAULT_CITY.id) }
          : { cities };
      },
    }
  )
);

// AsyncStorage is async, so the saved list arrives after the first render.
export function useCitiesHydrated() {
  return useSyncExternalStore(
    (onChange) => useCitiesStore.persist.onFinishHydration(onChange),
    () => useCitiesStore.persist.hasHydrated()
  );
}
