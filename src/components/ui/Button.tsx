import { Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const fillClass =
    variant === 'primary'
      ? 'bg-primary dark:bg-primary-night'
      : variant === 'destructive'
        ? 'bg-danger dark:bg-danger-night'
        : 'bg-surface-elevated dark:bg-surface-elevated-night border border-border dark:border-border-night';
  const textClass = variant === 'secondary' ? 'text-ink dark:text-ink-night' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`min-h-[48px] rounded-full items-center justify-center px-6 ${fillClass} ${
        disabled ? 'opacity-40' : 'active:opacity-70'
      }`}>
      <Text className={`text-base font-semibold ${textClass}`}>{label}</Text>
    </Pressable>
  );
}
