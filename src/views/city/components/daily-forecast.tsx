import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import type { DailyItem } from '@/api/open-meteo';
import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { WeatherIcon } from '@/components/weather-icon';
import { describeWeather } from '@/constants/weather-codes';
import { colors, radius, spacing } from '@/styles/tokens';
import { formatDay, formatTemperature } from '@/utils/format';
import { getTemperatureRange } from '@/views/city/utils/forecast';

type Range = { min: number; max: number };

// Seven fixed rows inside a ScrollView: a plain map, not a nested FlatList.
export function DailyForecast({ days }: { days: DailyItem[] }) {
  const range = getTemperatureRange(days);

  return (
    <GlassCard title="7-day forecast" icon="calendar">
      {days.map((day, index) => (
        <View key={day.date} style={[styles.row, index > 0 && styles.divider]}>
          <AppText style={styles.day}>{index === 0 ? 'Today' : formatDay(day.date)}</AppText>
          <View style={styles.weather}>
            <WeatherIcon kind={describeWeather(day.weatherCode).kind} size={40} />
            {day.precipitationChance > 0 ? (
              <AppText variant="caption" style={styles.rain}>
                {day.precipitationChance}%
              </AppText>
            ) : null}
          </View>
          <AppText tone="tertiary" style={styles.temperature}>
            {formatTemperature(day.min)}
          </AppText>
          <TemperatureBar day={day} range={range} />
          <AppText style={styles.temperature}>{formatTemperature(day.max)}</AppText>
        </View>
      ))}
    </GlassCard>
  );
}

function TemperatureBar({ day, range }: { day: DailyItem; range: Range }) {
  const span = range.max - range.min || 1;
  const left = ((day.min - range.min) / span) * 100;
  const width = Math.max(((day.max - day.min) / span) * 100, 4);

  return (
    <View style={styles.track}>
      <LinearGradient
        colors={[colors.rain, colors.sun]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { left: `${left}%`, width: `${width}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopColor: colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  day: {
    width: 56,
  },
  weather: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rain: {
    color: colors.rain,
  },
  temperature: {
    width: 40,
    textAlign: 'center',
  },
  track: {
    flex: 1,
    height: 5,
    marginHorizontal: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: radius.pill,
  },
});
