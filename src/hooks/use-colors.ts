import { useColorScheme } from 'react-native';

const palette = {
  light: { text: '#11181C', muted: '#687076', card: '#FFFFFF', tint: '#208AEF' },
  dark: { text: '#ECEDEE', muted: '#9BA1A6', card: '#1C1E21', tint: '#4DA3FF' },
};

export function useColors() {
  return palette[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
