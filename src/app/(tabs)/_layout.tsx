import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { colors } from '@/styles/tokens';

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Icon name={name} size={size} color={color} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        // On Android the keyboard would otherwise push the bar up above it.
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Weather', tabBarIcon: tabIcon('weather') }} />
      <Tabs.Screen name="cities" options={{ title: 'Cities', tabBarIcon: tabIcon('cities') }} />
      <Tabs.Screen name="air" options={{ title: 'Air', tabBarIcon: tabIcon('air') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: tabIcon('account') }} />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: tabIcon('settings') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Absolute, so each screen's sky runs behind the translucent bar; screens pad their content
  // with useBottomInset() to stay clear of it.
  tabBar: {
    position: 'absolute',
    backgroundColor: colors.tabBar,
    borderTopColor: colors.glassBorder,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
  },
});
