import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { between, seededRandom } from '@/components/sky/random';
import type { ParticleLayer } from '@/components/sky/scenes';

type Props = {
  layers: readonly ParticleLayer[];
  clock: SharedValue<number>;
};

export function Precipitation({ layers, clock }: Props) {
  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {layers.map((layer) => (
        <Particles key={layer.seed} layer={layer} clock={clock} />
      ))}
    </Canvas>
  );
}

function Particles({ layer, clock }: { layer: ParticleLayer; clock: SharedValue<number> }) {
  const { width, height } = useWindowDimensions();
  const { shape, slant, sway } = layer;

  // Each particle's fixed traits. Where it is right now is worked out from the clock, per frame.
  const particles = useMemo(() => {
    const random = seededRandom(layer.seed);
    // Wind pushes particles right as they fall, so some start left of the screen.
    const windShift = slant * height;

    return Array.from({ length: layer.count }, () => {
      const size = between(random, layer.size);

      return {
        x: random() * (width + windShift) - windShift,
        offset: random() * (height + size * 2),
        speed: between(random, layer.speed),
        size,
        swayRate: 0.6 + random() * 0.8,
      };
    });
  }, [layer, slant, width, height]);

  const builder = useMemo(() => Skia.PathBuilder.Make(), []);

  // Every particle goes into one path that is rebuilt each frame on the UI thread.
  const path = useDerivedValue(() => {
    const seconds = clock.get() / 1000;
    builder.reset();

    for (const particle of particles) {
      const fall = height + particle.size * 2;
      const y = ((particle.offset + seconds * particle.speed) % fall) - particle.size;
      const x =
        particle.x + y * slant + Math.sin(seconds * particle.swayRate + particle.offset) * sway;

      if (shape === 'streak') {
        builder.moveTo(x, y).lineTo(x + particle.size * slant, y + particle.size);
      } else {
        builder.addCircle(x, y, particle.size);
      }
    }

    return builder.build();
  });

  return (
    <Path
      path={path}
      color={layer.color}
      style={shape === 'streak' ? 'stroke' : 'fill'}
      strokeWidth={layer.strokeWidth}
      strokeCap="round"
    />
  );
}
