import { describeWeather } from '../weather-codes';

describe('describeWeather', () => {
  it('maps a WMO code to a label and icon', () => {
    expect(describeWeather(0)).toEqual({ label: 'Clear sky', icon: '☀️' });
    expect(describeWeather(95)).toEqual({ label: 'Thunderstorm', icon: '⛈️' });
  });

  it('shows a moon for clear skies at night', () => {
    expect(describeWeather(0, false).icon).toBe('🌙');
  });

  it('keeps cloud and rain icons at night', () => {
    expect(describeWeather(3, false).icon).toBe('☁️');
  });

  it('falls back for codes it does not know', () => {
    expect(describeWeather(42).label).toBe('Unknown');
  });
});
