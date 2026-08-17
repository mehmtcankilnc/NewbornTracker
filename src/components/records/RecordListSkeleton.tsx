import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

function SkeletonRow() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-row items-center gap-3 bg-surface-elevated dark:bg-surface-elevated-night border border-border dark:border-border-night rounded-2xl px-4 py-3 mb-2">
      <View className="h-10 w-10 rounded-full bg-border dark:bg-border-night" />
      <View className="flex-1 gap-2">
        <View className="h-3.5 w-24 rounded-full bg-border dark:bg-border-night" />
        <View className="h-3 w-16 rounded-full bg-border dark:bg-border-night" />
      </View>
    </Animated.View>
  );
}

export function RecordListSkeleton() {
  return (
    <View className="px-5 pt-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </View>
  );
}
