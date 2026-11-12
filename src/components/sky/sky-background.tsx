import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { CelestialBody } from '@/components/sky/celestial-body';
import { Clouds } from '@/components/sky/clouds';
import { Lightning } from '@/components/sky/lightning';
import { Precipitation } from '@/components/sky/precipitation';
import { sceneFor, type SkyScene, type SkyWeather } from '@/components/sky/scenes';
import { Stars } from '@/components/sky/stars';
import { useSkyClock } from '@/components/sky/use-sky-clock';
import { NIGHT_SKY, skyFor } from '@/styles/sky';

type Props = {
  // Undefined while the forecast loads, which shows a plain night sky.
  weather?: SkyWeather;
  // Off where the screen already shows a large weather icon.
  showCelestial?: boolean;
  children: ReactNode;
};

export function SkyBackground({ weather, showCelestial = true, children }: Props) {
  return (
    <LinearGradient
      colors={weather ? skyFor(weather.kind, weather.isDay) : NIGHT_SKY}
      style={styles.fill}>
      {weather ? (
        // Keyed by the weather, so a change fades the old scene out and the new one in.
        <SceneLayers
          key={`${weather.kind}-${weather.isDay}`}
          scene={sceneFor(weather)}
          showCelestial={showCelestial}
        />
      ) : null}
      {children}
    </LinearGradient>
  );
}

function SceneLayers({ scene, showCelestial }: { scene: SkyScene; showCelestial: boolean }) {
  const { clock, isRunning } = useSkyClock();

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      exiting={FadeOut.duration(800)}
      style={styles.layers}>
      {scene.stars ? <Stars clock={clock} /> : null}
      {showCelestial && scene.celestial ? (
        <CelestialBody body={scene.celestial} isRunning={isRunning} />
      ) : null}
      {scene.clouds ? <Clouds {...scene.clouds} clock={clock} /> : null}
      {scene.particles ? <Precipitation layers={scene.particles} clock={clock} /> : null}
      {scene.lightning ? <Lightning isRunning={isRunning} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  layers: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
});
