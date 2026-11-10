import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View, type TextInputInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { SkyBackground } from '@/components/ui/sky-background';
import { useSessionStore } from '@/store/session-store';
import { NIGHT_SKY } from '@/styles/sky';
import { colors, spacing } from '@/styles/tokens';
import { TextField } from '@/views/sign-in/components/text-field';
import { authenticate, MIN_PASSWORD_LENGTH } from '@/views/sign-in/services/fake-auth';

export function SignInView() {
  const insets = useSafeAreaInsets();
  const signIn = useSessionStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInputInstance>(null);
  // Storing the session flips the root layout's Stack.Protected guard, and that closes this modal.
  const { mutate, isPending, error } = useMutation({ mutationFn: authenticate, onSuccess: signIn });
  const canSubmit = email.trim() !== '' && password !== '';

  function submit() {
    if (canSubmit && !isPending) mutate({ email, password });
  }

  // An iOS modal is a sheet that already starts below the status bar; on Android it is full screen.
  const topInset = Platform.OS === 'ios' ? spacing.lg : insets.top + spacing.sm;

  return (
    <SkyBackground sky={NIGHT_SKY}>
      <ScrollView
        // Without this, the first tap on "Sign in" while the keyboard is up only closes the keyboard.
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: topInset, paddingBottom: insets.bottom + spacing.xl },
        ]}>
        <View style={styles.topBar}>
          <IconButton icon="close" accessibilityLabel="Close" onPress={() => router.back()} />
        </View>

        <View style={styles.intro}>
          <AppText variant="title">Sign in</AppText>
          <AppText tone="secondary">
            This sign-in is pretend: any email and a password of {MIN_PASSWORD_LENGTH} or more
            characters will work.
          </AppText>
        </View>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />

        {error ? (
          <AppText accessibilityRole="alert" style={styles.error}>
            {error.message}
          </AppText>
        ) : null}

        <Button label="Sign in" onPress={submit} disabled={!canSubmit} isLoading={isPending} />
      </ScrollView>
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  topBar: {
    alignItems: 'flex-end',
  },
  intro: {
    gap: spacing.sm,
  },
  error: {
    color: colors.danger,
  },
});
