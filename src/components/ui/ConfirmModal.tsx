import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Sheet visible={visible} onClose={onCancel} animationType="fade">
      <Text className="text-ink dark:text-ink-night text-lg font-semibold">{title}</Text>
      <Text className="text-muted dark:text-muted-night text-sm mt-1 mb-6">{message}</Text>

      <View className="gap-3">
        <Button label={confirmLabel} variant="destructive" onPress={onConfirm} />
        <Button label={cancelLabel} variant="secondary" onPress={onCancel} />
      </View>
    </Sheet>
  );
}
