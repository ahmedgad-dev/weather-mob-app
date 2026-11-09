import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { useAppStateFocus } from '@/hooks/use-app-state-focus';
import { queryClient } from '@/lib/query-client';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useAppStateFocus();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Today' }} />
          <Stack.Screen name="hourly" options={{ title: 'Next 24 hours' }} />
          <Stack.Screen name="daily" options={{ title: '7-day forecast' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
