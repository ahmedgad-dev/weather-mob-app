import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { CelestialBody } from '@/components/ui/celestial-body';
import type { Celestial, Sky } from '@/styles/sky';

type Props = {
  sky: Sky;
  celestial?: Celestial;
  children: ReactNode;
};

export function SkyBackground({ sky, celestial, children }: Props) {
  return (
    <LinearGradient colors={sky} style={styles.fill}>
      {celestial ? <CelestialBody body={celestial} /> : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
