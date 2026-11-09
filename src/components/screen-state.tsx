import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '@/hooks/use-colors';

type Props = {
  isBusy: boolean;
  error: string | null;
  onRetry: () => void;
};

export function ScreenState({ isBusy, error, onRetry }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {isBusy ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={[styles.title, { color: colors.text }]}>
            Couldn&apos;t load the forecast
          </Text>
          {error ? <Text style={{ color: colors.muted }}>{error}</Text> : null}
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.tint, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 18, fontWeight: '600' },
  button: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
