import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/config/query-client';
import { useAppStateFocus } from '@/hooks/use-app-state-focus';
import { useSessionStore } from '@/store/session-store';
import { NIGHT_SKY } from '@/styles/sky';

export default function RootLayout() {
  useAppStateFocus();
  const isSignedIn = useSessionStore((state) => state.session !== null);

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DarkTheme}>
          <StatusBar style="light" />
          {/* Screens here sit above the tab bar, so pushing one covers it. */}
          <Stack screenOptions={{ headerShown: false, contentStyle: styles.screen }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="city/[id]" />
            {/* Signing in flips the guard, which closes the modal and lands on /account. */}
            <Stack.Protected guard={!isSignedIn} redirectTo="/account">
              <Stack.Screen name="sign-in" options={{ presentation: 'modal' }} />
            </Stack.Protected>
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
