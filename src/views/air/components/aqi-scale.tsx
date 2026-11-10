import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/styles/tokens';
import { AQI_LEVELS, aqiScalePosition } from '@/views/air/services/levels';

const MARKER = 14;

export function AqiScale({ aqi }: { aqi: number }) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {AQI_LEVELS.map((level) => (
          <View key={level.label} style={[styles.band, { backgroundColor: level.color }]} />
        ))}
      </View>
      <View style={[styles.marker, { left: `${aqiScalePosition(aqi) * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MARKER,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    flexDirection: 'row',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  band: {
    flex: 1,
  },
  marker: {
    position: 'absolute',
    width: MARKER,
    height: MARKER,
    marginLeft: -MARKER / 2,
    borderRadius: MARKER / 2,
    backgroundColor: colors.textPrimary,
    boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.25)',
  },
});
