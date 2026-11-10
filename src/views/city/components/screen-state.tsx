import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, spacing } from '@/styles/tokens';

type Props = {
  isBusy: boolean;
  error: string | null;
  onRetry: () => void;
};

export function ScreenState({ isBusy, error, onRetry }: Props) {
  return (
    <View style={styles.container}>
      {isBusy ? (
        <ActivityIndicator size="large" color={colors.textPrimary} />
      ) : (
        <>
          <AppText variant="headline">Couldn&apos;t load the forecast</AppText>
          {error ? <AppText tone="secondary">{error}</AppText> : null}
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}>
            <AppText variant="body">Try again</AppText>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
