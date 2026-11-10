import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { colors } from '@/styles/tokens';

// SF Symbols on iOS, Material Symbols on Android and web.
export type SymbolName = Extract<SymbolViewProps['name'], object>;

const ICONS = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  delete: { ios: 'trash.fill', android: 'delete', web: 'delete' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  feelsLike: { ios: 'thermometer.medium', android: 'device_thermostat', web: 'device_thermostat' },
  humidity: { ios: 'humidity.fill', android: 'humidity_percentage', web: 'humidity_percentage' },
  wind: { ios: 'wind', android: 'air', web: 'air' },
  location: { ios: 'location.fill', android: 'location_on', web: 'location_on' },
  weather: { ios: 'cloud.sun.fill', android: 'partly_cloudy_day', web: 'partly_cloudy_day' },
  cities: { ios: 'list.bullet', android: 'format_list_bulleted', web: 'format_list_bulleted' },
  air: { ios: 'aqi.medium', android: 'airwave', web: 'airwave' },
  uv: { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' },
  account: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  signOut: {
    ios: 'rectangle.portrait.and.arrow.right',
    android: 'logout',
    web: 'logout',
  },
  external: { ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = 20, color = colors.textPrimary }: Props) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} />;
}
