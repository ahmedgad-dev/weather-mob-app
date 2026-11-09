import { FlatList, StyleSheet, View } from 'react-native';

import type { HourlyItem } from '@/api/open-meteo';
import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { WeatherIcon } from '@/components/weather-icon';
import { describeWeather } from '@/constants/weather-codes';
import { colors, spacing } from '@/theme/tokens';
import { formatHour, formatTemperature } from '@/utils/format';

export function HourlyStrip({ hours }: { hours: HourlyItem[] }) {
  return (
    <GlassCard title="Hourly forecast" icon="clock">
      <FlatList
        horizontal
        data={hours}
        keyExtractor={(hour) => hour.time}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.hour}>
            <AppText variant="caption" tone="secondary">
              {index === 0 ? 'Now' : formatHour(item.time)}
            </AppText>
            <WeatherIcon kind={describeWeather(item.weatherCode).kind} isDay={item.isDay} />
            <View style={styles.rainSlot}>
              {item.precipitationChance > 0 ? (
                <AppText variant="caption" style={styles.rain}>
                  {item.precipitationChance}%
                </AppText>
              ) : null}
            </View>
            <AppText variant="headline">{formatTemperature(item.temperature)}</AppText>
          </View>
        )}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
  },
  hour: {
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 44,
  },
  rainSlot: {
    height: 16,
  },
  rain: {
    color: colors.rain,
  },
});
