import { searchCities } from '../geocoding';

const originalFetch = globalThis.fetch;

function mockFetch(body: unknown, { ok = true, status = 200 } = {}) {
  const fetchMock = jest.fn().mockResolvedValue({ ok, status, json: async () => body });
  globalThis.fetch = fetchMock;

  return fetchMock;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('searchCities', () => {
  it('searches by trimmed name and passes the abort signal through', async () => {
    const fetchMock = mockFetch({ results: [] });
    const controller = new AbortController();

    await searchCities('  Riyadh ', controller.signal);

    const [url, init] = fetchMock.mock.calls[0];
    expect(new URL(url).searchParams.get('name')).toBe('Riyadh');
    expect(init.signal).toBe(controller.signal);
  });

  it('maps results to cities, keeping the region from admin1', async () => {
    mockFetch({
      results: [
        {
          id: 108410,
          name: 'Riyadh',
          latitude: 24.68773,
          longitude: 46.72185,
          country: 'Saudi Arabia',
          admin1: 'Riyadh Region',
          population: 4205961,
        },
      ],
    });

    expect(await searchCities('Riyadh')).toEqual([
      {
        id: 108410,
        name: 'Riyadh',
        latitude: 24.68773,
        longitude: 46.72185,
        country: 'Saudi Arabia',
        region: 'Riyadh Region',
      },
    ]);
  });

  it('returns an empty list when nothing matches', async () => {
    mockFetch({ generationtime_ms: 0.2 });

    expect(await searchCities('Xyzzy')).toEqual([]);
  });

  it('throws when the search answers with an error status', async () => {
    mockFetch({}, { ok: false, status: 500 });

    await expect(searchCities('Riyadh')).rejects.toThrow('City search returned 500');
  });
});
