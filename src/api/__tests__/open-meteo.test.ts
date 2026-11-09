import { fetchForecast } from '../open-meteo';

const city = { name: 'Dubai', latitude: 25.2, longitude: 55.27 };

const response = {
  current: {
    time: '2026-11-09T14:30',
    temperature_2m: 32,
    apparent_temperature: 33.2,
    relative_humidity_2m: 44,
    wind_speed_10m: 12.5,
    weather_code: 0,
    is_day: 1,
  },
  hourly: {
    time: ['2026-11-09T14:00', '2026-11-09T15:00'],
    temperature_2m: [32, 31.5],
    weather_code: [0, 1],
    precipitation_probability: [0, null],
    is_day: [1, 0],
  },
  daily: {
    time: ['2026-11-09'],
    temperature_2m_min: [26.8],
    temperature_2m_max: [32.4],
    weather_code: [0],
    precipitation_probability_max: [null],
  },
};

const originalFetch = globalThis.fetch;

function mockFetch(body: unknown, { ok = true, status = 200 } = {}) {
  const fetchMock = jest.fn().mockResolvedValue({ ok, status, json: async () => body });
  globalThis.fetch = fetchMock;

  return fetchMock;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('fetchForecast', () => {
  it('asks for the city coordinates in the city time zone', async () => {
    const fetchMock = mockFetch(response);

    await fetchForecast(city);

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get('latitude')).toBe('25.2');
    expect(url.searchParams.get('longitude')).toBe('55.27');
    expect(url.searchParams.get('timezone')).toBe('auto');
    expect(url.searchParams.get('forecast_days')).toBe('7');
  });

  it('turns per-field arrays into one object per hour and per day', async () => {
    mockFetch(response);

    const forecast = await fetchForecast(city);

    expect(forecast.current).toMatchObject({ temperature: 32, feelsLike: 33.2, isDay: true });
    expect(forecast.hourly).toEqual([
      {
        time: '2026-11-09T14:00',
        temperature: 32,
        weatherCode: 0,
        precipitationChance: 0,
        isDay: true,
      },
      {
        time: '2026-11-09T15:00',
        temperature: 31.5,
        weatherCode: 1,
        precipitationChance: 0,
        isDay: false,
      },
    ]);
    expect(forecast.daily).toEqual([
      { date: '2026-11-09', min: 26.8, max: 32.4, weatherCode: 0, precipitationChance: 0 },
    ]);
  });

  it('throws when Open-Meteo answers with an error status', async () => {
    mockFetch({}, { ok: false, status: 503 });

    await expect(fetchForecast(city)).rejects.toThrow('Open-Meteo returned 503');
  });
});
