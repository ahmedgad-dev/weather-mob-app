import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { ForecastProvider } from '@/context/forecast-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ForecastProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Today' }} />
          <Stack.Screen name="hourly" options={{ title: 'Next 24 hours' }} />
          <Stack.Screen name="daily" options={{ title: '7-day forecast' }} />
        </Stack>
      </ForecastProvider>
    </ThemeProvider>
  );
}
