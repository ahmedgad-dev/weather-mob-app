import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import type { Sky } from '@/styles/sky';

export function SkyBackground({ sky, children }: { sky: Sky; children: ReactNode }) {
  return (
    <LinearGradient colors={sky} style={styles.fill}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
