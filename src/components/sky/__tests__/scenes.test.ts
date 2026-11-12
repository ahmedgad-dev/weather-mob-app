import { sceneFor } from '../scenes';

describe('sceneFor', () => {
  it('shows the sun by day and the moon and stars by night when the sky is open', () => {
    expect(sceneFor({ kind: 'clear', isDay: true })).toMatchObject({ celestial: 'sun' });
    expect(sceneFor({ kind: 'clear', isDay: true }).stars).toBe(false);
    expect(sceneFor({ kind: 'partlyCloudy', isDay: false })).toMatchObject({
      celestial: 'moon',
      stars: true,
    });
  });

  it('hides the sun and moon behind cloud, rain and storms', () => {
    expect(sceneFor({ kind: 'cloudy', isDay: true }).celestial).toBeUndefined();
    expect(sceneFor({ kind: 'rain', isDay: false }).celestial).toBeUndefined();
    expect(sceneFor({ kind: 'storm', isDay: true }).celestial).toBeUndefined();
  });

  it('has no clouds on a clear day', () => {
    expect(sceneFor({ kind: 'clear', isDay: true }).clouds).toBeUndefined();
  });

  it('puts rain or snow under clouds', () => {
    const rain = sceneFor({ kind: 'rain', isDay: true });
    const snow = sceneFor({ kind: 'snow', isDay: true });

    expect(rain.clouds).toBeDefined();
    expect(rain.particles?.map((layer) => layer.shape)).toEqual(['streak']);
    expect(snow.particles?.map((layer) => layer.shape)).toEqual(['dot']);
  });

  it('dims the clouds at night', () => {
    expect(sceneFor({ kind: 'cloudy', isDay: true }).clouds?.tint).toBe('grey');
    expect(sceneFor({ kind: 'cloudy', isDay: false }).clouds?.tint).toBe('night');
  });

  it('only flashes lightning in storms', () => {
    expect(sceneFor({ kind: 'storm', isDay: true }).lightning).toBe(true);
    expect(sceneFor({ kind: 'hail', isDay: false }).lightning).toBe(true);
    expect(sceneFor({ kind: 'rain', isDay: true }).lightning).toBeUndefined();
  });

  it('gives every particle layer its own seed, so layers never fall in step', () => {
    const seeds = sceneFor({ kind: 'hail', isDay: true }).particles?.map((layer) => layer.seed);

    expect(new Set(seeds).size).toBe(seeds?.length);
  });
});
