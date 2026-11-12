import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Keyboard, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { City } from '@/api/geocoding';
import { SkyBackground } from '@/components/sky/sky-background';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { useBottomInset } from '@/hooks/use-bottom-inset';
import { useLocationSky } from '@/hooks/use-location-sky';
import { useRefreshByUser } from '@/hooks/use-refresh-by-user';
import { useCitiesHydrated, useCitiesStore } from '@/store/cities-store';
import { colors, radius, spacing } from '@/styles/tokens';
import { CityCard } from '@/views/cities/components/city-card';
import { LocationCard } from '@/views/cities/components/location-card';
import { SearchField } from '@/views/cities/components/search-field';
import { SearchResults } from '@/views/cities/components/search-results';
import { useCitySearch } from '@/views/cities/hooks/use-city-search';

export function CitiesView() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomInset();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const search = useCitySearch(query);
  const sky = useLocationSky();
  const hydrated = useCitiesHydrated();
  const cities = useCitiesStore((state) => state.cities);
  const addCity = useCitiesStore((state) => state.addCity);
  const removeCity = useCitiesStore((state) => state.removeCity);
  const isSearching = query.trim().length > 0;
  const { isRefreshingByUser, refreshByUser } = useRefreshByUser(() =>
    Promise.all([
      queryClient.refetchQueries({ queryKey: ['current-location'] }),
      queryClient.refetchQueries({ queryKey: ['forecast'] }),
    ])
  );

  function saveCity(city: City) {
    addCity(city);
    setQuery('');
    Keyboard.dismiss();
  }

  return (
    <SkyBackground weather={sky}>
      <FlatList
        data={isSearching || !hydrated ? [] : cities}
        keyExtractor={(city) => String(city.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + spacing.lg, paddingBottom: bottomInset + spacing.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingByUser}
            onRefresh={refreshByUser}
            tintColor={colors.textPrimary}
          />
        }
        // An element, not an inline component: a new component type each render would remount
        // the TextInput and close the keyboard after every letter.
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <AppText variant="title">Cities</AppText>
              <AppText tone="secondary">Ahmed Gad dev</AppText>
            </View>
            <SearchField value={query} onChangeText={setQuery} isLoading={search.isFetching} />
            {isSearching ? (
              <SearchResults
                query={query}
                results={search.data ?? []}
                isFetching={search.isFetching}
                isError={search.isError}
                savedIds={new Set(cities.map((city) => city.id))}
                onSelect={saveCity}
              />
            ) : (
              <>
                <LocationCard />
                {cities.length > 0 ? (
                  <AppText variant="label" tone="tertiary" style={styles.section}>
                    Saved cities
                  </AppText>
                ) : null}
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            friction={2}
            rightThreshold={40}
            overshootRight={false}
            renderRightActions={() => (
              <Pressable
                onPress={() => removeCity(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.name}`}
                style={styles.deleteAction}>
                <Icon name="delete" size={22} />
              </Pressable>
            )}>
            <CityCard
              city={item}
              onPress={() =>
                router.push({ pathname: '/city/[id]', params: { id: String(item.id) } })
              }
            />
          </ReanimatedSwipeable>
        )}
      />
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.lg,
  },
  section: {
    marginTop: spacing.sm,
  },
  deleteAction: {
    width: 80,
    marginLeft: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
});
