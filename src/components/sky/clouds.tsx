import { StyleSheet, useWindowDimensions, View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import type { CloudSpec, CloudTint } from '@/components/sky/scenes';

const TINTS: Record<CloudTint, string> = {
  white: '255, 255, 255',
  grey: '214, 222, 232',
  night: '170, 185, 210',
  storm: '120, 122, 150',
};

const ASPECT = 0.5;

type Box = {
  left: DimensionValue;
  top: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
};

// A cloud is a few overlapping puffs that each fade out to their edges, so it has no hard outline.
const PUFFS: readonly Box[] = [
  { left: '0%', top: '42%', width: '100%', height: '58%' },
  { left: '8%', top: '20%', width: '44%', height: '62%' },
  { left: '28%', top: '0%', width: '48%', height: '80%' },
  { left: '54%', top: '16%', width: '40%', height: '64%' },
];

type Props = {
  tint: CloudTint;
  specs: readonly CloudSpec[];
  clock: SharedValue<number>;
};

export function Clouds({ tint, specs, clock }: Props) {
  const { width, height } = useWindowDimensions();
  const rgb = TINTS[tint];
  const puff = `radial-gradient(closest-side, rgba(${rgb}, 0.9) 0%, rgba(${rgb}, 0.55) 50%, rgba(${rgb}, 0) 100%)`;

  return (
    <>
      {specs.map((spec, index) => (
        <Cloud
          key={index}
          spec={spec}
          puff={puff}
          clock={clock}
          skyWidth={width}
          skyHeight={height}
        />
      ))}
    </>
  );
}

type CloudProps = {
  spec: CloudSpec;
  puff: string;
  clock: SharedValue<number>;
  skyWidth: number;
  skyHeight: number;
};

function Cloud({ spec, puff, clock, skyWidth, skyHeight }: CloudProps) {
  // From fully off the left edge to fully off the right edge, so the wrap-around is never seen.
  const travel = skyWidth + spec.width;

  // Runs on the UI thread every frame. React never re-renders the cloud while it moves.
  const drift = useAnimatedStyle(() => {
    const progress = (spec.phase + clock.get() / spec.duration) % 1;

    return { transform: [{ translateX: progress * travel - spec.width }] };
  });

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top: spec.top * skyHeight,
          width: spec.width,
          height: spec.width * ASPECT * (spec.flatten ?? 1),
          opacity: spec.opacity,
        },
        drift,
      ]}>
      {PUFFS.map((box, index) => (
        <View key={index} style={[styles.puff, box, { backgroundImage: puff }]} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    left: 0,
  },
  puff: {
    position: 'absolute',
  },
});
