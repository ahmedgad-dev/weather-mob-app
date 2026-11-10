import { NIGHT_SKY, skyFor } from '../sky';

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
