import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { ListGroup, ListRow } from '@/components/ui/list-group';
import { SkyBackground } from '@/components/ui/sky-background';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useCurrentLocation, type CurrentLocation } from '@/hooks/use-current-location';
import { useLocationSky } from '@/hooks/use-location-sky';
import { spacing } from '@/styles/tokens';

// Opens inside the app (SFSafariViewController / Chrome Custom Tabs) instead of switching apps.
const open = (url: string) => WebBrowser.openBrowserAsync(url);

export function SettingsView() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const { sky, celestial } = useLocationSky();
  const { location } = useCurrentLocation();

  return (
    <SkyBackground sky={sky} celestial={celestial}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: bottomInset + spacing.xl },
        ]}>
        <AppText variant="title">Settings</AppText>

        <ListGroup title="Privacy">
          <ListRow
            label="Location access"
            value={locationAccess(location)}
            trailingIcon="external"
            onPress={() => Linking.openSettings()}
          />
        </ListGroup>

        <ListGroup title="About">
          <ListRow label="Version" value={Constants.expoConfig?.version ?? '—'} />
          <ListRow
            label="Weather data"
            value="Open-Meteo"
            trailingIcon="external"
            onPress={() => open('https://open-meteo.com/')}
          />
          <ListRow
            label="Air quality data"
            value="CAMS"
            trailingIcon="external"
            onPress={() => open('https://open-meteo.com/en/docs/air-quality-api')}
          />
          <ListRow
            label="Weather icons"
            value="Meteocons"
            trailingIcon="external"
            onPress={() => open('https://github.com/basmilius/weather-icons')}
          />
        </ListGroup>

        <AppText variant="caption" tone="tertiary" style={styles.footnote}>
          Weather and air quality data are licensed under CC BY 4.0.
        </AppText>
      </ScrollView>
    </SkyBackground>
  );
}

function locationAccess(location: CurrentLocation | undefined) {
  if (!location) return 'Checking…';

  return location.status === 'denied' ? 'Off' : 'On';
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  footnote: {
    paddingHorizontal: spacing.xs,
  },
});
