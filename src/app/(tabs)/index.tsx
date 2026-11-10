import { CURRENT_LOCATION_ID } from '@/hooks/use-current-location';
import { CityView } from '@/views/city';

export default function WeatherRoute() {
  return <CityView id={CURRENT_LOCATION_ID} showBack={false} />;
}
