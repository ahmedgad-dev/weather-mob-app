import { Redirect, router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailTile } from '@/components/detail-tile';
import { ScreenState } from '@/components/screen-state';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { SkyBackground } from '@/components/ui/sky-background';
import { WeatherIcon } from '@/components/weather-icon';
import { describeWeather } from '@/constants/weather-codes';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { CURRENT_LOCATION_ID, useCurrentLocation } from '@/hooks/use-current-location';
import { useForecast } from '@/hooks/use-forecast';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { useCitiesHydrated, useCitiesStore } from '@/store/cities-store';
import { NIGHT_SKY, skyFor } from '@/styles/sky';
import { colors, spacing } from '@/styles/tokens';
import { formatTemperature } from '@/utils/format';
import { DailyForecast } from '@/views/city/components/daily-forecast';
import { HourlyStrip } from '@/views/city/components/hourly-strip';
import { getNext24Hours } from '@/views/city/utils/forecast';

type Props = {
  id: string;
  // False when the view is a tab's root screen, where there is nothing to go back to.
  showBack?: boolean;
};

export function CityView({ id, showBack = true }: Props) {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
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
    return <Redirect href="/cities" />;
  }

  const weather = forecast ? describeWeather(forecast.current.weatherCode) : undefined;
  const sky = forecast && weather ? skyFor(weather.kind, forecast.current.isDay) : NIGHT_SKY;

  return (
    <SkyBackground sky={sky}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        {showBack ? (
          <IconButton icon="back" accessibilityLabel="Back" onPress={() => router.back()} />
        ) : null}
      </View>

      {city && forecast && weather ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomInset + spacing.xxl }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingByUser}
              onRefresh={refreshByUser}
              tintColor={colors.textPrimary}
            />
          }>
          <View style={styles.hero}>
            <AppText variant="title">{city.name}</AppText>
            <WeatherIcon kind={weather.kind} isDay={forecast.current.isDay} size={112} animated />
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
          errorTitle="Couldn’t load the forecast"
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
