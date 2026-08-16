import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { combineTodayWithTime, formatTime, offsetToIso, QUICK_PICK_OPTIONS } from '@/utils/time';

interface TimePickerSheetProps {
  visible: boolean;
  title: string;
  onSelect: (occurredAtIso: string) => void;
  onClose: () => void;
}

type Selection = { kind: 'quick'; minutesAgo: number } | { kind: 'custom'; date: Date };

export function TimePickerSheet({ visible, title, onSelect, onClose }: TimePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [pendingDate, setPendingDate] = useState(new Date());

  const showList = !showSpinner || Platform.OS === 'android';

  function reset() {
    setSelection(null);
    setShowSpinner(false);
    setPendingDate(new Date());
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleQuickPick(minutesAgo: number) {
    setSelection({ kind: 'quick', minutesAgo });
  }

  function openCustomPicker() {
    setPendingDate(selection?.kind === 'custom' ? selection.date : new Date());
    setShowSpinner(true);
  }

  function handleAndroidChange(event: DateTimePickerEvent, date?: Date) {
    setShowSpinner(false);
    if (event.type === 'set' && date) {
      setSelection({ kind: 'custom', date });
    }
  }

  function handleIOSChange(_event: DateTimePickerEvent, date?: Date) {
    if (date) setPendingDate(date);
  }

  function applyCustomIOS() {
    setSelection({ kind: 'custom', date: pendingDate });
    setShowSpinner(false);
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/30 justify-end" onPress={handleClose}>
        <Pressable
          className="bg-surface rounded-t-3xl p-5"
          style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
          onPress={(e) => e.stopPropagation()}>
          <Text className="text-ink text-lg font-semibold mb-4">{title}</Text>

          {showSpinner && Platform.OS === 'android' && (
            <DateTimePicker
              value={pendingDate}
              mode="time"
              display="default"
              onChange={handleAndroidChange}
            />
          )}

          {showList && (
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
                onPress={openCustomPicker}
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
          )}

          {showSpinner && Platform.OS === 'ios' && (
            <View className="mt-2">
              <DateTimePicker
                value={pendingDate}
                mode="time"
                display="spinner"
                textColor="#4B5723"
                themeVariant="light"
                onChange={handleIOSChange}
              />
              <View className="flex-row gap-3 mt-4">
                <View className="flex-1">
                  <Button label="Vazgeç" variant="secondary" onPress={() => setShowSpinner(false)} />
                </View>
                <View className="flex-1">
                  <Button label="Seç" onPress={applyCustomIOS} />
                </View>
              </View>
            </View>
          )}

          {showList && (
            <View className="mt-4 gap-3">
              <Button label="Onayla" onPress={handleConfirm} disabled={!selection} />
              <Button label="İptal" variant="secondary" onPress={handleClose} />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
