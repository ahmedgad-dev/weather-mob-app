import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  isLoading: boolean;
};

export function SearchField({ value, onChangeText, isLoading }: Props) {
  return (
    <View style={styles.field}>
      <Icon name="search" size={18} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search for a city"
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.textPrimary}
        accessibilityLabel="Search for a city"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {isLoading ? <ActivityIndicator size="small" color={colors.textSecondary} /> : null}
      {value ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}>
          <Icon name="close" size={16} color={colors.textTertiary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
});
