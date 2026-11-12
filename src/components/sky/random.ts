// Mulberry32: the same seed always gives the same numbers, so stars and raindrops keep their
// places between renders and between screens instead of reshuffling.
export function seededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function between(random: () => number, [min, max]: readonly [number, number]) {
  return min + random() * (max - min);
}
