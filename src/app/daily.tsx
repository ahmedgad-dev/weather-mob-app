import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenState } from '@/components/screen-state';
import { describeWeather } from '@/constants/weather-codes';
import { useForecast } from '@/context/forecast-context';
import { useColors } from '@/hooks/use-colors';
import { formatDay, formatTemperature } from '@/utils/format';

export default function DailyScreen() {
  const { forecast, error, isLoading, isRefreshing, refresh } = useForecast();
  const colors = useColors();

  if (!forecast) {
    return <ScreenState isBusy={isLoading || isRefreshing} error={error} onRetry={refresh} />;
  }

  return (
    <FlatList
      data={forecast.daily}
      keyExtractor={(day) => day.date}
      contentContainerStyle={styles.list}
      refreshing={isRefreshing}
      onRefresh={refresh}
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
