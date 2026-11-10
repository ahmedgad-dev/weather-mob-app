import { useLocalSearchParams } from 'expo-router';

import { CityView } from '@/views/city';

export default function CityRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CityView id={id} />;
}
