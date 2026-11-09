import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenState } from '@/components/screen-state';
import { describeWeather } from '@/constants/weather-codes';
import { useForecast } from '@/context/forecast-context';
import { useColors } from '@/hooks/use-colors';
import { formatHour, formatTemperature } from '@/utils/format';

export default function HourlyScreen() {
  const { forecast, error, isLoading, isRefreshing, refresh } = useForecast();
  const colors = useColors();

  if (!forecast) {
    return <ScreenState isBusy={isLoading || isRefreshing} error={error} onRetry={refresh} />;
  }

  const currentHour = forecast.current.time.slice(0, 13);
  const next24Hours = forecast.hourly
    .filter((hour) => hour.time.slice(0, 13) >= currentHour)
    .slice(0, 24);

  return (
    <FlatList
      data={next24Hours}
      keyExtractor={(hour) => hour.time}
      contentContainerStyle={styles.list}
      refreshing={isRefreshing}
      onRefresh={refresh}
      renderItem={({ item, index }) => {
        const weather = describeWeather(item.weatherCode, item.isDay);

        return (
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Text style={[styles.time, { color: colors.text }]}>
              {index === 0 ? 'Now' : formatHour(item.time)}
            </Text>
            <Text style={styles.icon}>{weather.icon}</Text>
            <Text style={[styles.rain, { color: colors.muted }]}>
              💧 {item.precipitationChance}%
            </Text>
            <Text style={[styles.temperature, { color: colors.text }]}>
              {formatTemperature(item.temperature)}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  time: { width: 56, fontSize: 16, fontWeight: '500' },
  icon: { width: 40, fontSize: 24 },
  rain: { flex: 1 },
  temperature: { fontSize: 18, fontWeight: '600' },
});
