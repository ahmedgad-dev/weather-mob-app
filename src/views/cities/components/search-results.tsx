import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { City } from '@/api/geocoding';
import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Icon } from '@/components/ui/icon';
import { colors, spacing } from '@/styles/tokens';
import { formatPlace } from '@/utils/format';
import { MIN_QUERY_LENGTH } from '@/views/cities/hooks/use-city-search';

type Props = {
  query: string;
  results: City[];
  isFetching: boolean;
  isError: boolean;
  savedIds: Set<number>;
  onSelect: (city: City) => void;
};

export function SearchResults({ query, results, isFetching, isError, savedIds, onSelect }: Props) {
  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) return <Hint>Keep typing…</Hint>;
  if (isError) return <Hint>Couldn’t search right now. Check your connection.</Hint>;
  if (results.length === 0) return isFetching ? null : <Hint>No cities match “{trimmed}”.</Hint>;

  return (
    <GlassCard style={styles.card}>
      {results.map((city, index) => {
        const saved = savedIds.has(city.id);

        return (
          <Pressable
            key={city.id}
            onPress={() => onSelect(city)}
            disabled={saved}
            accessibilityRole="button"
            accessibilityLabel={saved ? `${city.name} is already saved` : `Save ${city.name}`}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.divider,
              pressed && styles.pressed,
            ]}>
            <View style={styles.text}>
              <AppText>{city.name}</AppText>
              <AppText variant="caption" tone="tertiary">
                {formatPlace(city)}
              </AppText>
            </View>
            <Icon
              name={saved ? 'check' : 'add'}
              size={18}
              color={saved ? colors.textTertiary : colors.textPrimary}
            />
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <AppText tone="tertiary" style={styles.hint}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopColor: colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  hint: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
