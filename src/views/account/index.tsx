import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Icon } from '@/components/ui/icon';
import { ListGroup, ListRow } from '@/components/ui/list-group';
import { SkyBackground } from '@/components/ui/sky-background';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useLocationSky } from '@/hooks/use-location-sky';
import { useCitiesStore } from '@/store/cities-store';
import { useSessionHydrated, useSessionStore, type Session } from '@/store/session-store';
import { colors, radius, spacing } from '@/styles/tokens';

export function AccountView() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const { sky, celestial } = useLocationSky();
  const hydrated = useSessionHydrated();
  const session = useSessionStore((state) => state.session);

  return (
    <SkyBackground sky={sky} celestial={celestial}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: bottomInset + spacing.xl },
        ]}>
        <AppText variant="title">Account</AppText>
        {/* SecureStore is async: until it answers we don't know which state to show. */}
        {hydrated && (session ? <Profile session={session} /> : <SignedOut />)}
      </ScrollView>
    </SkyBackground>
  );
}

function SignedOut() {
  return (
    <GlassCard style={styles.signedOut}>
      <Icon name="account" size={56} color={colors.textSecondary} />
      <AppText variant="headline">You’re not signed in</AppText>
      <AppText tone="secondary" style={styles.centered}>
        Sign in to see your profile here.
      </AppText>
      <View style={styles.action}>
        <Button label="Sign in" onPress={() => router.push('/sign-in')} />
      </View>
    </GlassCard>
  );
}

function Profile({ session }: { session: Session }) {
  const signOut = useSessionStore((state) => state.signOut);
  const savedCities = useCitiesStore((state) => state.cities.length);

  function confirmSignOut() {
    Alert.alert('Sign out?', 'Your saved cities stay on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <>
      <GlassCard style={styles.profile}>
        <View style={styles.avatar}>
          <AppText variant="headline">{initials(session.user.name)}</AppText>
        </View>
        <View style={styles.identity}>
          <AppText variant="headline" numberOfLines={1}>
            {session.user.name}
          </AppText>
          <AppText tone="secondary" numberOfLines={1}>
            {session.user.email}
          </AppText>
        </View>
      </GlassCard>

      <ListGroup title="On this phone">
        <ListRow label="Saved cities" value={String(savedCities)} />
      </ListGroup>

      <Button label="Sign out" icon="signOut" variant="glass" onPress={confirmSignOut} />
    </>
  );
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const AVATAR = 56;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  signedOut: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  centered: {
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.track,
  },
  identity: {
    flex: 1,
  },
});
