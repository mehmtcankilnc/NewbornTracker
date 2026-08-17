import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { combineTodayWithTime, formatTime, offsetToIso, QUICK_PICK_OPTIONS } from '@/utils/time';

interface TimePickerSheetProps {
  visible: boolean;
  title: string;
  onSelect: (occurredAtIso: string) => void;
  onClose: () => void;
}

type Selection = { kind: 'quick'; minutesAgo: number } | { kind: 'custom'; date: Date };

export function TimePickerSheet({ visible, title, onSelect, onClose }: TimePickerSheetProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  function reset() {
    setSelection(null);
    setShowPicker(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleQuickPick(minutesAgo: number) {
    setSelection({ kind: 'quick', minutesAgo });
  }

  function handleConfirm() {
    if (!selection) return;
    const iso =
      selection.kind === 'quick' ? offsetToIso(selection.minutesAgo) : combineTodayWithTime(selection.date);
    onSelect(iso);
    reset();
  }

  const customLabel =
    selection?.kind === 'custom' ? `Özel: ${formatTime(selection.date.toISOString())}` : 'Özel…';

  return (
    <>
      <Sheet visible={visible} onClose={handleClose}>
        <Text className="text-ink text-lg font-semibold mb-4">{title}</Text>

        <View className="gap-2">
          {QUICK_PICK_OPTIONS.map((option) => {
            const isSelected = selection?.kind === 'quick' && selection.minutesAgo === option.minutesAgo;
            return (
              <Pressable
                key={option.label}
                onPress={() => handleQuickPick(option.minutesAgo)}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
                  isSelected ? 'bg-primary' : 'bg-surface-elevated'
                }`}>
                <Text className={`text-base ${isSelected ? 'text-white font-semibold' : 'text-ink'}`}>
                  {option.label}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setShowPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Özel saat"
            className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
              selection?.kind === 'custom' ? 'bg-primary' : 'bg-surface-elevated'
            }`}>
            <Text
              className={`text-base ${selection?.kind === 'custom' ? 'text-white font-semibold' : 'text-ink'}`}>
              {customLabel}
            </Text>
            {selection?.kind === 'custom' && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          <Button label="Onayla" onPress={handleConfirm} disabled={!selection} />
          <Button label="İptal" variant="secondary" onPress={handleClose} />
        </View>
      </Sheet>

      <DatePicker
        modal
        open={showPicker}
        mode="time"
        date={selection?.kind === 'custom' ? selection.date : new Date()}
        title="Saat seç"
        confirmText="Seç"
        cancelText="Vazgeç"
        onConfirm={(date) => {
          setSelection({ kind: 'custom', date });
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
      />
    </>
  );
}
