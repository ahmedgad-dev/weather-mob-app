import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, spacing } from '@/styles/tokens';

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {title ? (
        <AppText variant="label" tone="tertiary" style={styles.title}>
          {title}
        </AppText>
      ) : null}
      <GlassCard style={styles.group}>
        {Children.toArray(children).map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {row}
          </Fragment>
        ))}
      </GlassCard>
    </View>
  );
}

type RowProps = {
  label: string;
  value?: string;
  trailingIcon?: IconName;
  onPress?: () => void;
};

export function ListRow({ label, value, trailingIcon, onPress }: RowProps) {
  const content = (
    <>
      <AppText style={styles.label}>{label}</AppText>
      {value ? <AppText tone="secondary">{value}</AppText> : null}
      {trailingIcon ? <Icon name={trailingIcon} size={16} color={colors.textTertiary} /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    paddingHorizontal: spacing.xs,
  },
  group: {
    paddingVertical: spacing.xs,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
