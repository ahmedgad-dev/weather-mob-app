import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import {
  CURRENT_LOCATION_ID,
  useCurrentLocation,
  type CurrentLocation,
} from '@/hooks/use-current-location';
import { colors, spacing } from '@/styles/tokens';
import { CityCard } from '@/views/home/components/city-card';

export function LocationCard() {
  const { location, city, isFallback, isPending, refetch } = useCurrentLocation();

  if (isPending) {
    return (
      <GlassCard style={styles.locating}>
        <ActivityIndicator color={colors.textPrimary} />
        <AppText tone="secondary">Finding your location…</AppText>
      </GlassCard>
    );
  }

  async function fixLocation() {
    if (location?.status === 'denied' && location.canAskAgain) {
      await Location.requestForegroundPermissionsAsync();
      await refetch();
    } else if (location?.status === 'denied') {
      // Android stops showing the prompt after "Don't allow" twice; only Settings can change it now.
      await Linking.openSettings();
    } else {
      await refetch();
    }
  }

  return (
    <View style={styles.container}>
      <CityCard
        city={city}
        badge={isFallback ? 'Default city' : 'My location'}
        onPress={() => router.push({ pathname: '/city/[id]', params: { id: CURRENT_LOCATION_ID } })}
      />
      {location && location.status !== 'granted' ? (
        <View style={styles.hint}>
          <AppText variant="caption" tone="secondary" style={styles.hintText}>
            {hintFor(location)}
          </AppText>
          <Pressable onPress={fixLocation} accessibilityRole="button" hitSlop={8}>
            <AppText variant="caption" style={styles.action}>
              {actionFor(location)}
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function hintFor(location: CurrentLocation) {
  return location.status === 'denied'
    ? 'Location access is off, so you’re seeing Dubai.'
    : 'Couldn’t find your location, so you’re seeing Dubai.';
}

function actionFor(location: CurrentLocation) {
  if (location.status !== 'denied') return 'Try again';

  return location.canAskAgain ? 'Allow' : 'Open Settings';
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  locating: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  hintText: {
    flex: 1,
  },
  action: {
    color: colors.rain,
  },
});
