import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyForecast } from '@/components/daily-forecast';
import { DetailTile } from '@/components/detail-tile';
import { HourlyStrip } from '@/components/hourly-strip';
import { ScreenState } from '@/components/screen-state';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { SkyBackground } from '@/components/ui/sky-background';
import { describeWeather } from '@/constants/weather-codes';
import { CURRENT_LOCATION_ID, useCurrentLocation } from '@/hooks/use-current-location';
import { useForecast } from '@/hooks/use-forecast';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { useCitiesHydrated, useCitiesStore } from '@/store/cities-store';
import { NIGHT_SKY, skyFor } from '@/theme/sky';
import { colors, spacing } from '@/theme/tokens';
import { formatTemperature } from '@/utils/format';
import { getNext24Hours } from '@/utils/forecast';

export default function CityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const hydrated = useCitiesHydrated();
  const isCurrentLocation = id === CURRENT_LOCATION_ID;
  const savedCity = useCitiesStore((state) =>
    state.cities.find((saved) => String(saved.id) === id)
  );
  const { city: locationCity } = useCurrentLocation();
  const city = isCurrentLocation ? locationCity : savedCity;
  const { data: forecast, error, isFetching, refetch } = useForecast(city);
  const { isRefreshingByUser, refreshByUser } = useRefreshByUser(refetch);

  if (!isCurrentLocation && hydrated && !savedCity) {
    return <Redirect href="/" />;
  }

  const weather = forecast ? describeWeather(forecast.current.weatherCode) : undefined;
  const sky = forecast && weather ? skyFor(weather.kind, forecast.current.isDay) : NIGHT_SKY;

  return (
    <SkyBackground sky={sky}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="back" accessibilityLabel="Back" onPress={() => router.back()} />
      </View>

      {city && forecast && weather ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingByUser}
              onRefresh={refreshByUser}
              tintColor={colors.textPrimary}
            />
          }>
          <View style={styles.hero}>
            <AppText variant="title">{city.name}</AppText>
            <AppText variant="display">{formatTemperature(forecast.current.temperature)}</AppText>
            <AppText variant="headline" tone="secondary">
              {weather.label}
            </AppText>
            <AppText tone="secondary">
              H:{formatTemperature(forecast.daily[0].max)} L:
              {formatTemperature(forecast.daily[0].min)}
            </AppText>
          </View>

          <HourlyStrip hours={getNext24Hours(forecast)} />
          <DailyForecast days={forecast.daily} />

          <View style={styles.tiles}>
            <DetailTile
              icon="feelsLike"
              label="Feels like"
              value={formatTemperature(forecast.current.feelsLike)}
            />
            <DetailTile icon="humidity" label="Humidity" value={`${forecast.current.humidity}%`} />
            <DetailTile
              icon="wind"
              label="Wind"
              value={`${Math.round(forecast.current.windSpeed)} km/h`}
            />
          </View>
        </ScrollView>
      ) : (
        <ScreenState
          isBusy={!city || isFetching}
          error={error?.message ?? null}
          onRetry={() => refetch()}
        />
      )}
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
