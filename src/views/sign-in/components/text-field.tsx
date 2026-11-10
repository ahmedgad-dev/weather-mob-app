import type { Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, spacing, typography } from '@/styles/tokens';

type Props = TextInputProps & {
  label: string;
  ref?: Ref<TextInputInstance>;
};

export function TextField({ label, style, ...props }: Props) {
  return (
    <View style={styles.field}>
      <AppText variant="label" tone="tertiary">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.rain}
        cursorColor={colors.textPrimary}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    color: colors.textPrimary,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
