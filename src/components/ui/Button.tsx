import { Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const fillClass =
    variant === 'primary' ? 'bg-primary' : variant === 'destructive' ? 'bg-danger' : 'bg-surface-elevated border border-border';
  const textClass = variant === 'secondary' ? 'text-ink' : 'text-white';

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
