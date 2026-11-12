import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailTile } from '@/components/detail-tile';
import { ScreenState } from '@/components/screen-state';
import { SkyBackground } from '@/components/sky/sky-background';
import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useLocationSky } from '@/hooks/use-location-sky';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { colors, radius, spacing } from '@/styles/tokens';
import { formatHour } from '@/utils/format';
import { AqiScale } from '@/views/air/components/aqi-scale';
import { useAirQuality } from '@/views/air/hooks/use-air-quality';
import { aqiLevel, uvLevel } from '@/views/air/services/levels';

const formatPollutant = (value: number | null) =>
  value === null ? '—' : `${Math.round(value)} µg/m³`;

const formatUv = (value: number | null) =>
  value === null ? '—' : `${Math.round(value)} · ${uvLevel(value)}`;

export function AirView() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const sky = useLocationSky();
  const { city, isPending: isLocating } = useCurrentLocation();
  const { data: air, error, isFetching, refetch } = useAirQuality(isLocating ? undefined : city);
  const { isRefreshingByUser, refreshByUser } = useRefreshByUser(refetch);
  const level = air?.usAqi != null ? aqiLevel(air.usAqi) : undefined;

  return (
    <SkyBackground weather={sky}>
      {air ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + spacing.lg, paddingBottom: bottomInset + spacing.xl },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingByUser}
              onRefresh={refreshByUser}
              tintColor={colors.textPrimary}
            />
          }>
          <View>
            <AppText variant="title">Air quality</AppText>
            <AppText tone="secondary">{city.name}</AppText>
          </View>

          <GlassCard title="US AQI" icon="air" style={styles.hero}>
            <AppText style={styles.aqi}>{air.usAqi ?? '—'}</AppText>
            {level && air.usAqi !== null ? (
              <>
                <View style={styles.level}>
                  <View style={[styles.dot, { backgroundColor: level.color }]} />
                  <AppText variant="headline">{level.label}</AppText>
                </View>
                <AppText tone="secondary">{level.advice}</AppText>
                <AqiScale aqi={air.usAqi} />
              </>
            ) : null}
          </GlassCard>

          <View style={styles.tiles}>
            <DetailTile label="PM2.5" value={formatPollutant(air.pm2_5)} />
            <DetailTile label="PM10" value={formatPollutant(air.pm10)} />
          </View>
          <View style={styles.tiles}>
            <DetailTile label="Ozone" value={formatPollutant(air.ozone)} />
            <DetailTile label="NO₂" value={formatPollutant(air.nitrogenDioxide)} />
          </View>
          <View style={styles.tiles}>
            <DetailTile icon="uv" label="UV index" value={formatUv(air.uvIndex)} />
          </View>

          <AppText variant="caption" tone="tertiary">
            Updated {formatHour(air.time)} local time · CAMS data via Open-Meteo
          </AppText>
        </ScrollView>
      ) : (
        <ScreenState
          isBusy={isLocating || isFetching}
          errorTitle="Couldn’t load air quality"
          error={error?.message ?? null}
          onRetry={() => refetch()}
        />
      )}
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  aqi: {
    fontSize: 72,
    fontWeight: '200',
    lineHeight: 80,
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
