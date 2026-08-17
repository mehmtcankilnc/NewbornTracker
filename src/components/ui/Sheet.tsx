import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: 'slide' | 'fade';
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

/** Shared bottom-sheet chrome: backdrop, keyboard-safe positioning, and drag-down-to-dismiss via the top handle. */
export function Sheet({ visible, onClose, children, animationType = 'slide' }: SheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) translateY.value = 0;
  }, [visible, translateY]);

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (translateY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        translateY.value = withTiming(800, { duration: 200 }, (finished) => {
          if (finished) runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType={animationType} statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <Pressable className="flex-1 bg-black/30 justify-end" onPress={onClose}>
            <Animated.View style={animatedStyle}>
              <Pressable
                className="bg-surface rounded-t-3xl px-5 pb-5"
                style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
                onPress={(e) => {
                  e.stopPropagation();
                  Keyboard.dismiss();
                }}>
                <GestureDetector gesture={pan}>
                  <View className="items-center pt-3 pb-2 -mx-5 px-5">
                    <View className="w-10 h-1.5 rounded-full bg-border" />
                  </View>
                </GestureDetector>
                {children}
              </Pressable>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}
