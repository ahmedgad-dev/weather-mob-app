import { Canvas, Path, Skia, type SkPath } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { seededRandom } from '@/components/sky/random';

const COUNT = 60;
const GROUPS = 4;
// Stars only fill the upper part of the sky.
const SPREAD = 0.6;

export function Stars({ clock }: { clock: SharedValue<number> }) {
  const { width, height } = useWindowDimensions();

  // Each group twinkles on its own rhythm. One path per group is one draw call, however many stars.
  const groups = useMemo(() => {
    const random = seededRandom(7);
    const builders = Array.from({ length: GROUPS }, () => Skia.PathBuilder.Make());

    for (let i = 0; i < COUNT; i++) {
      builders[i % GROUPS].addCircle(
        random() * width,
        random() * height * SPREAD,
        0.5 + random() * 1.1
      );
    }

    return builders.map((builder) => builder.build());
  }, [width, height]);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {groups.map((path, index) => (
        <StarGroup key={index} path={path} index={index} clock={clock} />
      ))}
    </Canvas>
  );
}

type StarGroupProps = {
  path: SkPath;
  index: number;
  clock: SharedValue<number>;
};

function StarGroup({ path, index, clock }: StarGroupProps) {
  const opacity = useDerivedValue(
    () => 0.65 + 0.35 * Math.sin(clock.get() / (600 + index * 170) + index * 2.1)
  );

  return <Path path={path} color="white" opacity={opacity} />;
}
