import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'İptal',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/30 justify-end" onPress={onCancel}>
        <Pressable
          className="bg-surface rounded-t-3xl p-5"
          style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
          onPress={(e) => e.stopPropagation()}>
          <Text className="text-ink text-lg font-semibold">{title}</Text>
          <Text className="text-muted text-sm mt-1 mb-6">{message}</Text>

          <View className="gap-3">
            <Button label={confirmLabel} variant="destructive" onPress={onConfirm} />
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
