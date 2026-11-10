import { celestialFor, NIGHT_SKY, skyFor } from '../sky';

describe('celestialFor', () => {
  it('shows the sun by day and the moon by night when the sky is open', () => {
    expect(celestialFor('clear', true)).toBe('sun');
    expect(celestialFor('partlyCloudy', false)).toBe('moon');
  });

  it('hides both behind cloud, rain and storms', () => {
    expect(celestialFor('cloudy', true)).toBeUndefined();
    expect(celestialFor('rain', false)).toBeUndefined();
    expect(celestialFor('storm', true)).toBeUndefined();
  });
});

describe('skyFor', () => {
  it('uses a different sky for a clear day and a clear night', () => {
    expect(skyFor('clear', true)).not.toEqual(skyFor('clear', false));
    expect(skyFor('clear', false)).toBe(NIGHT_SKY);
  });

  it('shares one sky between drizzle and rain', () => {
    expect(skyFor('drizzle', true)).toBe(skyFor('rain', true));
  });

  it('keeps storms dark whatever the time of day', () => {
    expect(skyFor('storm', true)).toBe(skyFor('storm', false));
    expect(skyFor('hail', true)).toBe(skyFor('storm', true));
  });
});
