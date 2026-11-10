import { StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import type { IconName } from '@/components/ui/icon';

type Props = {
  icon: IconName;
  label: string;
  value: string;
};

export function DetailTile({ icon, label, value }: Props) {
  return (
    <GlassCard title={label} icon={icon} style={styles.tile}>
      <AppText variant="headline">{value}</AppText>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
  },
});
