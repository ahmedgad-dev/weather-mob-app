import type { DailyItem, Forecast, HourlyItem } from '@/api/open-meteo';

import { getNext24Hours, getTemperatureRange } from '../forecast';

function hour(time: string): HourlyItem {
  return { time, temperature: 30, weatherCode: 0, precipitationChance: 0, isDay: true };
}

function day(date: string, min: number, max: number): DailyItem {
  return { date, min, max, weatherCode: 0, precipitationChance: 0 };
}

describe('getNext24Hours', () => {
  it('starts at the current hour and returns at most 24 hours', () => {
    const hourly = Array.from({ length: 48 }, (_, i) => {
      const date = i < 24 ? '2026-11-09' : '2026-11-10';
      return hour(`${date}T${String(i % 24).padStart(2, '0')}:00`);
    });
    const forecast = {
      current: { time: '2026-11-09T14:30', temperature: 32.4, weatherCode: 2, isDay: true },
      hourly,
    } as Forecast;

    const next = getNext24Hours(forecast);

    expect(next).toHaveLength(24);
    expect(next[0].time).toBe('2026-11-09T14:00');
    expect(next[23].time).toBe('2026-11-10T13:00');
  });

  it('uses the live reading for "Now" so it matches the big temperature', () => {
    const forecast = {
      current: { time: '2026-11-09T14:30', temperature: 32.4, weatherCode: 2, isDay: true },
      hourly: [hour('2026-11-09T14:00'), hour('2026-11-09T15:00')],
    } as Forecast;

    const [now, next] = getNext24Hours(forecast);

    expect(now).toMatchObject({ temperature: 32.4, weatherCode: 2 });
    expect(next.temperature).toBe(30);
  });
});

describe('getTemperatureRange', () => {
  it('spans the coldest night and the warmest day of the week', () => {
    const days = [day('2026-11-09', 26, 32), day('2026-11-10', 24, 30), day('2026-11-11', 27, 34)];

    expect(getTemperatureRange(days)).toEqual({ min: 24, max: 34 });
  });
});
