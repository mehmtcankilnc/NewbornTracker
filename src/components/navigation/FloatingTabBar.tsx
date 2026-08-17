import { Ionicons } from '@expo/vector-icons';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/useAppTheme';

export function TabBarRow({ children, ...props }: TabListProps) {
  return (
    <View
      {...props}
      className="flex-row bg-surface-elevated dark:bg-surface-elevated-night rounded-full border border-border dark:border-border-night overflow-hidden">
      {children}
    </View>
  );
}

export function TabDivider() {
  return <View className="w-px bg-border dark:bg-border-night my-3" />;
}

interface TabButtonProps extends TabTriggerSlotProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function TabButton({ icon, label, isFocused, style: _style, ...props }: TabButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-1 flex-col items-center justify-center py-3">
      <Ionicons name={icon} size={20} color={isFocused ? colors.primary : colors.muted} />
      <Text
        style={{ includeFontPadding: false }}
        className={`text-xs mt-1 ${
          isFocused ? 'text-primary dark:text-primary-night font-bold' : 'text-muted dark:text-muted-night'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
