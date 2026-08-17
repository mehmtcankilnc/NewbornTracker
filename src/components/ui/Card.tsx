import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/useAppTheme';

interface CardProps {
  label: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentBg: string;
  onPress: () => void;
  testID?: string;
}

export function Card({ label, subtitle, icon, accent, accentBg, onPress, testID }: CardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="w-[48%] min-h-[176px] rounded-card p-4 justify-between active:opacity-70"
      style={{ backgroundColor: accentBg, borderWidth: 1.5, borderColor: accent }}>
      <View className="flex-row justify-end">
        <View
          className="h-8 w-8 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}>
          <Ionicons name="add" size={18} color={colors.ink} />
        </View>
      </View>

      <View className="items-center -mt-2">
        <View
          className="h-16 w-16 rounded-full items-center justify-center"
          style={{ backgroundColor: accent }}>
          <Ionicons name={icon} size={30} color={colors.white} />
        </View>
      </View>

      <View>
        <Text className="text-ink dark:text-ink-night text-xl font-extrabold">{label}</Text>
        {subtitle ? (
          <Text className="text-muted dark:text-muted-night text-xs mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
