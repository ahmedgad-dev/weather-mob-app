import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppStateFocus } from '@/hooks/use-app-state-focus';
import { queryClient } from '@/lib/query-client';
import { NIGHT_SKY } from '@/theme/sky';

export default function RootLayout() {
  useAppStateFocus();

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DarkTheme}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: styles.screen }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="city/[id]" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { backgroundColor: NIGHT_SKY[0] },
});
