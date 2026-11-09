import { describeWeather } from '../weather-codes';

describe('describeWeather', () => {
  it('maps a WMO code to a label and a kind of weather', () => {
    expect(describeWeather(0)).toEqual({ label: 'Clear sky', kind: 'clear' });
    expect(describeWeather(63)).toEqual({ label: 'Rain', kind: 'rain' });
    expect(describeWeather(95)).toEqual({ label: 'Thunderstorm', kind: 'storm' });
  });

  it('treats showers like their steady counterparts', () => {
    expect(describeWeather(81).kind).toBe('rain');
    expect(describeWeather(85).kind).toBe('snow');
  });

  it('falls back for codes it does not know', () => {
    expect(describeWeather(42)).toEqual({ label: 'Unknown', kind: 'cloudy' });
  });
});
