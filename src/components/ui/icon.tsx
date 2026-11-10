import { SymbolView, type SymbolViewProps } from 'expo-symbols';

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
} satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 20, color = colors.textPrimary }: Props) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} />;
}
