import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenState } from '@/components/screen-state';
import { DEFAULT_CITY } from '@/constants/cities';
import { describeWeather } from '@/constants/weather-codes';
import { useColors } from '@/hooks/use-colors';
import { useForecast } from '@/hooks/use-forecast';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { formatDay, formatTemperature } from '@/utils/format';

export default function DailyScreen() {
  const { data: forecast, error, isFetching, refetch } = useForecast(DEFAULT_CITY);
  const { isRefreshingByUser, refreshByUser } = useRefreshByUser(refetch);
  const colors = useColors();

  if (!forecast) {
    return (
      <ScreenState isBusy={isFetching} error={error?.message ?? null} onRetry={() => refetch()} />
    );
  }

  return (
    <FlatList
      data={forecast.daily}
      keyExtractor={(day) => day.date}
      contentContainerStyle={styles.list}
      refreshing={isRefreshingByUser}
      onRefresh={refreshByUser}
      renderItem={({ item, index }) => {
        const weather = describeWeather(item.weatherCode);

        return (
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Text style={[styles.day, { color: colors.text }]}>
              {index === 0 ? 'Today' : formatDay(item.date)}
            </Text>
            <Text style={styles.icon}>{weather.icon}</Text>
            <Text style={[styles.rain, { color: colors.muted }]}>
              💧 {item.precipitationChance}%
            </Text>
            <Text style={[styles.temperature, { color: colors.muted }]}>
              {formatTemperature(item.min)}
            </Text>
            <Text style={[styles.temperature, { color: colors.text }]}>
              {formatTemperature(item.max)}
            </Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  day: { width: 64, fontSize: 16, fontWeight: '500' },
  icon: { width: 40, fontSize: 24 },
  rain: { flex: 1 },
  temperature: { width: 44, fontSize: 17, fontWeight: '600' },
});
