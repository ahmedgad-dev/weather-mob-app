import { formatDay, formatHour, formatTemperature } from '../format';

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
