import { fetchAirQuality } from '../air-quality';

const coordinates = { latitude: 25.2, longitude: 55.27 };

const response = {
  current: {
    time: '2026-11-10T14:00',
    interval: 3600,
    us_aqi: 111,
    pm2_5: 25.1,
    pm10: 61.9,
    ozone: 100,
    nitrogen_dioxide: null,
    uv_index: 3.65,
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

describe('fetchAirQuality', () => {
  it('asks for current readings at the coordinates in their time zone', async () => {
    const fetchMock = mockFetch(response);

    await fetchAirQuality(coordinates);

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe('https://air-quality-api.open-meteo.com/v1/air-quality');
    expect(url.searchParams.get('latitude')).toBe('25.2');
    expect(url.searchParams.get('longitude')).toBe('55.27');
    expect(url.searchParams.get('timezone')).toBe('auto');
    expect(url.searchParams.get('current')?.split(',')).toEqual(
      expect.arrayContaining(['us_aqi', 'pm2_5', 'uv_index'])
    );
  });

  it('maps the response and keeps missing readings as null', async () => {
    mockFetch(response);

    await expect(fetchAirQuality(coordinates)).resolves.toEqual({
      time: '2026-11-10T14:00',
      usAqi: 111,
      pm2_5: 25.1,
      pm10: 61.9,
      ozone: 100,
      nitrogenDioxide: null,
      uvIndex: 3.65,
    });
  });

  it('throws when Open-Meteo answers with an error', async () => {
    mockFetch({}, { ok: false, status: 503 });

    await expect(fetchAirQuality(coordinates)).rejects.toThrow('Open-Meteo returned 503');
  });
});
