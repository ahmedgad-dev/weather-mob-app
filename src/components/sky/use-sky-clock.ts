import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';
import { useFrameCallback, useReducedMotion, useSharedValue } from 'react-native-reanimated';

// One slow frame must not make every cloud and raindrop jump.
const MAX_STEP_MS = 50;

// Milliseconds of "sky time" that every layer reads on the UI thread. It only advances while the
// screen is focused: tab screens stay mounted in the background and would otherwise keep animating.
export function useSkyClock() {
  const isFocused = useIsFocused();
  const reduceMotion = useReducedMotion();
  const isRunning = isFocused && !reduceMotion;
  const clock = useSharedValue(0);

  const frameCallback = useFrameCallback((frame) => {
    clock.set(clock.get() + Math.min(frame.timeSincePreviousFrame ?? 0, MAX_STEP_MS));
  }, false);

  useEffect(() => {
    frameCallback.setActive(isRunning);
  }, [frameCallback, isRunning]);

  return { clock, isRunning };
}
