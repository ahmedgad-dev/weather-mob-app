import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = ViewProps & {
  title?: string;
  icon?: IconName;
};

export function GlassCard({ title, icon, style, children, ...props }: Props) {
  return (
    <View style={[styles.card, style]} {...props}>
      {title ? (
        <View style={styles.header}>
          {icon ? <Icon name={icon} size={14} color={colors.textTertiary} /> : null}
          <AppText variant="label" tone="tertiary">
            {title}
          </AppText>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
});
