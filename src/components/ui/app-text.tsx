import { Text, type TextProps } from 'react-native';

import { colors, typography } from '@/theme/tokens';

type Variant = keyof typeof typography;
type Tone = 'primary' | 'secondary' | 'tertiary';

const TONES: Record<Tone, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
};

type Props = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function AppText({ variant = 'body', tone = 'primary', style, ...props }: Props) {
  return <Text style={[typography[variant], { color: TONES[tone] }, style]} {...props} />;
}
