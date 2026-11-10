import { aqiLevel, aqiScalePosition, uvLevel } from '../levels';

describe('aqiLevel', () => {
  it.each([
    [0, 'Good'],
    [50, 'Good'],
    [51, 'Moderate'],
    [111, 'Unhealthy for sensitive groups'],
    [200, 'Unhealthy'],
    [300, 'Very unhealthy'],
    [301, 'Hazardous'],
    [650, 'Hazardous'],
  ])('puts %i in the %s band', (aqi, label) => {
    expect(aqiLevel(aqi).label).toBe(label);
  });
});

describe('aqiScalePosition', () => {
  it('runs from 0 at the start of the bar to 1 at the end', () => {
    expect(aqiScalePosition(0)).toBe(0);
    expect(aqiScalePosition(500)).toBe(1);
  });

  it('places each band boundary at an equal step', () => {
    expect(aqiScalePosition(50)).toBeCloseTo(1 / 6);
    expect(aqiScalePosition(100)).toBeCloseTo(2 / 6);
    expect(aqiScalePosition(300)).toBeCloseTo(5 / 6);
  });

  it('moves within a band in proportion to its range', () => {
    expect(aqiScalePosition(125)).toBeCloseTo(2.5 / 6);
    expect(aqiScalePosition(400)).toBeCloseTo(5.5 / 6);
  });

  it('keeps out-of-range readings on the bar', () => {
    expect(aqiScalePosition(-5)).toBe(0);
    expect(aqiScalePosition(900)).toBe(1);
  });
});

describe('uvLevel', () => {
  it.each([
    [0, 'Low'],
    [2.4, 'Low'],
    [3.65, 'Moderate'],
    [6, 'High'],
    [10.4, 'Very high'],
    [11, 'Extreme'],
  ])('rounds %f to the %s band', (uv, label) => {
    expect(uvLevel(uv)).toBe(label);
  });
});
