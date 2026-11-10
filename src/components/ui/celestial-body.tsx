import { StyleSheet, View } from 'react-native';
import Animated, { css, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Celestial } from '@/styles/sky';
import { spacing } from '@/styles/tokens';

const DISC = 64;
const HALO = 240;

const LOOKS = {
  sun: {
    disc: 'radial-gradient(circle at 35% 35%, #FFF7D6 0%, #FFD166 55%, #FFAF45 100%)',
    glow: '0 0 28px 8px rgba(255, 196, 84, 0.65)',
    halo: 'radial-gradient(circle, rgba(255, 214, 120, 0.5) 0%, rgba(255, 214, 120, 0.16) 38%, rgba(255, 214, 120, 0) 70%)',
  },
  moon: {
    disc: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E8EDF6 60%, #C4CEDF 100%)',
    glow: '0 0 22px 4px rgba(214, 226, 255, 0.45)',
    halo: 'radial-gradient(circle, rgba(196, 212, 255, 0.28) 0%, rgba(196, 212, 255, 0.08) 40%, rgba(196, 212, 255, 0) 70%)',
  },
} as const;

export function CelestialBody({ body }: { body: Celestial }) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const look = LOOKS[body];

  return (
    <View style={[styles.anchor, { top: insets.top + spacing.sm }]}>
      <Animated.View
        style={[styles.halo, { backgroundImage: look.halo }, !reduceMotion && animations.breathe]}
      />
      <View style={[styles.disc, { backgroundImage: look.disc, boxShadow: look.glow }]} />
    </View>
  );
}

const breathe = css.keyframes({
  from: { opacity: 0.75, transform: [{ scale: 0.92 }] },
  to: { opacity: 1, transform: [{ scale: 1.08 }] },
});

const animations = css.create({
  breathe: {
    animationName: breathe,
    animationDuration: '4s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
});

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    right: spacing.xl,
    width: DISC,
    height: DISC,
    pointerEvents: 'none',
  },
  halo: {
    position: 'absolute',
    top: (DISC - HALO) / 2,
    left: (DISC - HALO) / 2,
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
  },
});
