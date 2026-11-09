import { router, type Href } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenState } from '@/components/screen-state';
import { DEFAULT_CITY } from '@/constants/cities';
import { describeWeather } from '@/constants/weather-codes';
import { useColors } from '@/hooks/use-colors';
import { useForecast } from '@/hooks/use-forecast';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { formatTemperature } from '@/utils/format';

export default function TodayScreen() {
  const city = DEFAULT_CITY;
  const { data: forecast, error, isFetching, refetch } = useForecast(city);
  const { isRefreshingByUser, refreshByUser } = useRefreshByUser(refetch);
  const colors = useColors();

  if (!forecast) {
    return (
      <ScreenState isBusy={isFetching} error={error?.message ?? null} onRetry={() => refetch()} />
    );
  }

  const { current } = forecast;
  const today = forecast.daily[0];
  const weather = describeWeather(current.weatherCode, current.isDay);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshingByUser} onRefresh={refreshByUser} />}>
      <View style={styles.hero}>
        <Text style={[styles.city, { color: colors.text }]}>{city.name}</Text>
        <Text style={styles.icon}>{weather.icon}</Text>
        <Text style={[styles.temperature, { color: colors.text }]}>
          {formatTemperature(current.temperature)}
        </Text>
        <Text style={[styles.condition, { color: colors.muted }]}>{weather.label}</Text>
        <Text style={{ color: colors.muted }}>
          H: {formatTemperature(today.max)} L: {formatTemperature(today.min)}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Detail label="Feels like" value={formatTemperature(current.feelsLike)} />
        <Detail label="Humidity" value={`${current.humidity}%`} />
        <Detail label="Wind" value={`${Math.round(current.windSpeed)} km/h`} />
      </View>

      <NavRow href="/hourly" label="Next 24 hours" />
      <NavRow href="/daily" label="7-day forecast" />
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const colors = useColors();

  return (
    <View style={styles.detail}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function NavRow({ href, label }: { href: Href; label: string }) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.navRow,
        { backgroundColor: colors.card, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Text style={[styles.navLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.navLabel, { color: colors.muted }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  hero: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  city: { fontSize: 28, fontWeight: '600' },
  icon: { fontSize: 64, lineHeight: 80 },
  temperature: { fontSize: 72, fontWeight: '200' },
  condition: { fontSize: 18 },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16 },
  detail: { flex: 1, alignItems: 'center', gap: 4 },
  detailValue: { fontSize: 18, fontWeight: '600' },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  navLabel: { fontSize: 17, fontWeight: '500' },
});
