import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { fetchForecast, type Forecast } from '../../api/open-meteo';
import { useForecast } from '../use-forecast';

jest.mock('../../api/open-meteo');

const mockedFetchForecast = jest.mocked(fetchForecast);

const city = { name: 'Dubai', latitude: 25.2, longitude: 55.27 };

const forecast: Forecast = {
  current: {
    time: '2026-11-09T14:30',
    temperature: 32,
    feelsLike: 33,
    humidity: 44,
    windSpeed: 12,
    weatherCode: 0,
    isDay: true,
  },
  hourly: [],
  daily: [],
};

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return Wrapper;
}

describe('useForecast', () => {
  it('loads the forecast for the city', async () => {
    mockedFetchForecast.mockResolvedValue(forecast);

    const { result } = await renderHook(() => useForecast(city), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(forecast);
    expect(mockedFetchForecast).toHaveBeenCalledWith(city);
  });

  it('exposes the error when the request fails', async () => {
    mockedFetchForecast.mockRejectedValue(new Error('Network request failed'));

    const { result } = await renderHook(() => useForecast(city), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network request failed');
  });
});
