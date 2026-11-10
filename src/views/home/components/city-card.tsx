import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import type { City } from '@/api/geocoding';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { WeatherIcon } from '@/components/weather-icon';
import { describeWeather } from '@/constants/weather-codes';
import { useForecast } from '@/hooks/use-forecast';
import { NIGHT_SKY, skyFor } from '@/styles/sky';
import { colors, radius, spacing } from '@/styles/tokens';
import { formatPlace, formatTemperature } from '@/utils/format';

type Props = {
  city: City;
  badge?: string;
  onPress: () => void;
};

export function CityCard({ city, badge, onPress }: Props) {
  const { data: forecast, isError } = useForecast(city);
  const weather = forecast ? describeWeather(forecast.current.weatherCode) : undefined;
  const sky = forecast && weather ? skyFor(weather.kind, forecast.current.isDay) : NIGHT_SKY;
  const today = forecast?.daily[0];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${city.name} forecast`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <LinearGradient colors={sky} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.place}>
          {badge ? (
            <View style={styles.badge}>
              <Icon name="location" size={12} color={colors.textSecondary} />
              <AppText variant="label" tone="secondary">
                {badge}
              </AppText>
            </View>
          ) : null}
          <AppText variant="headline" numberOfLines={1}>
            {city.name}
          </AppText>
          <AppText variant="caption" tone="secondary" numberOfLines={1}>
            {formatPlace(city)}
          </AppText>
          <AppText variant="caption" tone="secondary" style={styles.condition}>
            {isError ? 'Couldn’t load' : (weather?.label ?? ' ')}
          </AppText>
        </View>

        <View style={styles.temperatures}>
          <View style={styles.reading}>
            {weather && forecast ? (
              <WeatherIcon kind={weather.kind} isDay={forecast.current.isDay} size={52} animated />
            ) : null}
            <AppText style={styles.temperature}>
              {forecast ? formatTemperature(forecast.current.temperature) : '--°'}
            </AppText>
          </View>
          {today ? (
            <AppText variant="caption" tone="secondary">
              H:{formatTemperature(today.max)} L:{formatTemperature(today.min)}
            </AppText>
          ) : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 116,
    padding: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  place: {
    flex: 1,
    gap: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  condition: {
    marginTop: 'auto',
  },
  temperatures: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  reading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
  },
});
