import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/styles/tokens';

type Props = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'glass';
  disabled?: boolean;
  isLoading?: boolean;
};

const INK = '#0B1530';

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  isLoading = false,
}: Props) {
  const ink = variant === 'primary' ? INK : colors.textPrimary;
  const inactive = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: isLoading }}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.primary : styles.glass,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}>
      {isLoading ? (
        <ActivityIndicator color={ink} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={18} color={ink} /> : null}
          <AppText variant="headline" style={[styles.label, { color: ink }]}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  primary: {
    backgroundColor: colors.textPrimary,
  },
  glass: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 17,
  },
});
