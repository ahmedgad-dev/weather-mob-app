import { BottomTabBarHeightContext } from 'expo-router/tabs';
import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Inside a tab the floating tab bar covers the bottom of the screen (its height already includes
// the home indicator); on a screen pushed over the tabs only the home indicator does.
export function useBottomInset() {
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const { bottom } = useSafeAreaInsets();

  return tabBarHeight ?? bottom;
}
