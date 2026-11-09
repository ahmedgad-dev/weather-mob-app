import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { fetchForecast, type City, type Forecast } from '@/api/open-meteo';

const DEFAULT_CITY: City = { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 };

type ForecastContextValue = {
  city: City;
  forecast: Forecast | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => void;
};

const ForecastContext = createContext<ForecastContextValue | null>(null);

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [city] = useState(DEFAULT_CITY);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetchForecast(city)
      .then((data) => {
        if (ignore) return;
        setForecast(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!ignore) setError(e instanceof Error ? e.message : 'Unknown error');
      })
      .finally(() => {
        if (ignore) return;
        setIsLoading(false);
        setIsRefreshing(false);
      });

    return () => {
      ignore = true;
    };
  }, [city, requestId]);

  const refresh = () => {
    setIsRefreshing(true);
    setRequestId((id) => id + 1);
  };

  return (
    <ForecastContext value={{ city, forecast, error, isLoading, isRefreshing, refresh }}>
      {children}
    </ForecastContext>
  );
}

export function useForecast() {
  const context = use(ForecastContext);

  if (!context) {
    throw new Error('useForecast must be used inside <ForecastProvider>');
  }

  return context;
}
