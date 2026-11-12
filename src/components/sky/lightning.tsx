import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// A strike flickers twice. Two flashes well under a second apart stay inside WCAG's limit of
// three flashes per second.
const strike = () =>
  withSequence(
    withTiming(0.35, { duration: 60 }),
    withTiming(0.05, { duration: 100 }),
    withTiming(0.25, { duration: 60 }),
    withTiming(0, { duration: 500 })
  );

export function Lightning({ isRunning }: { isRunning: boolean }) {
  const flash = useSharedValue(0);

  useEffect(() => {
    if (!isRunning) return;

    let timer: ReturnType<typeof setTimeout>;
    const strikeLater = () => {
      timer = setTimeout(
        () => {
          flash.set(strike());
          strikeLater();
        },
        4000 + Math.random() * 6000
      );
    };

    strikeLater();

    return () => clearTimeout(timer);
  }, [isRunning, flash]);

  const style = useAnimatedStyle(() => ({ opacity: flash.get() }));

  return <Animated.View style={[styles.flash, style]} />;
}

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E8ECFF',
    opacity: 0,
  },
});
