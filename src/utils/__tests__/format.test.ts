import { formatDay, formatHour, formatPlace, formatTemperature } from '../format';

describe('formatPlace', () => {
  const base = { id: 1, latitude: 0, longitude: 0 };

  it('joins region and country', () => {
    expect(
      formatPlace({ ...base, name: 'Jeddah', region: 'Makkah', country: 'Saudi Arabia' })
    ).toBe('Makkah, Saudi Arabia');
  });

  it('skips a region that repeats the city name', () => {
    expect(
      formatPlace({ ...base, name: 'Dubai', region: 'Dubai', country: 'United Arab Emirates' })
    ).toBe('United Arab Emirates');
  });
});

describe('formatTemperature', () => {
  it('rounds to a whole degree', () => {
    expect(formatTemperature(31.6)).toBe('32°');
    expect(formatTemperature(26.4)).toBe('26°');
  });

  it('never shows a negative zero', () => {
    expect(formatTemperature(-0.4)).toBe('0°');
  });
});

describe('formatHour', () => {
  it('reads the hour straight from the local time string', () => {
    expect(formatHour('2026-11-09T14:00')).toBe('14:00');
    expect(formatHour('2026-11-10T00:00')).toBe('00:00');
  });
});

describe('formatDay', () => {
  it('returns the short weekday name', () => {
    expect(formatDay('2026-11-09')).toBe('Mon');
    expect(formatDay('2026-12-31')).toBe('Thu');
  });
});
