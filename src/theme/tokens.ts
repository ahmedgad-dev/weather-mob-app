import type { TextStyle } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const colors = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.78)',
  textTertiary: 'rgba(255, 255, 255, 0.55)',
  glass: 'rgba(255, 255, 255, 0.14)',
  glassBorder: 'rgba(255, 255, 255, 0.22)',
  divider: 'rgba(255, 255, 255, 0.16)',
  track: 'rgba(255, 255, 255, 0.18)',
  rain: '#8FD3FF',
  sun: '#FFD166',
  danger: '#FF5A5F',
} as const;

export const typography = {
  display: { fontSize: 96, fontWeight: '200', letterSpacing: -2 },
  title: { fontSize: 32, fontWeight: '600' },
  headline: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '500' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
} as const satisfies Record<string, TextStyle>;
