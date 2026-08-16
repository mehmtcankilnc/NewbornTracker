import { Ionicons } from '@expo/vector-icons';
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

export function TabBarRow({ children, ...props }: TabListProps) {
  return (
    <View
      {...props}
      className="flex-row bg-surface-elevated rounded-full border border-border overflow-hidden">
      {children}
    </View>
  );
}

export function TabDivider() {
  return <View className="w-px bg-border my-3" />;
}

interface TabButtonProps extends TabTriggerSlotProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function TabButton({ icon, label, isFocused, style: _style, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-1 flex-col items-center justify-center py-3">
      <Ionicons name={icon} size={20} color={isFocused ? '#1C1B16' : '#8D8975'} />
      <Text
        style={{ includeFontPadding: false }}
        className={`text-xs mt-1 ${isFocused ? 'text-ink font-bold' : 'text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
