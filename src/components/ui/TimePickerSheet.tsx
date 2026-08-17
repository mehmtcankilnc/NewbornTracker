import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useTranslation } from '@/i18n';
import { useAppTheme } from '@/theme/useAppTheme';
import { combineTodayWithTime, formatTime, getQuickPickOptions, offsetToIso } from '@/utils/time';

interface TimePickerSheetProps {
  visible: boolean;
  title: string;
  onSelect: (occurredAtIso: string) => void;
  onClose: () => void;
}

type Selection = { kind: 'quick'; minutesAgo: number } | { kind: 'custom'; date: Date };

export function TimePickerSheet({ visible, title, onSelect, onClose }: TimePickerSheetProps) {
  const { t } = useTranslation();
  const { scheme } = useAppTheme();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const quickPickOptions = getQuickPickOptions(t);

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
    selection?.kind === 'custom'
      ? t('timePicker.customSelected', { time: formatTime(selection.date.toISOString()) })
      : t('timePicker.customLabel');

  return (
    <>
      <Sheet visible={visible} onClose={handleClose}>
        <Text className="text-ink dark:text-ink-night text-lg font-semibold mb-4">{title}</Text>

        <View className="gap-2">
          {quickPickOptions.map((option) => {
            const isSelected = selection?.kind === 'quick' && selection.minutesAgo === option.minutesAgo;
            return (
              <Pressable
                key={option.label}
                onPress={() => handleQuickPick(option.minutesAgo)}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
                  isSelected ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
                }`}>
                <Text
                  className={`text-base ${
                    isSelected ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'
                  }`}>
                  {option.label}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setShowPicker(true)}
            accessibilityRole="button"
            accessibilityLabel={t('timePicker.customLabel')}
            className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
              selection?.kind === 'custom' ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
            }`}>
            <Text
              className={`text-base ${
                selection?.kind === 'custom' ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'
              }`}>
              {customLabel}
            </Text>
            {selection?.kind === 'custom' && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          <Button label={t('timePicker.confirm')} onPress={handleConfirm} disabled={!selection} />
          <Button label={t('timePicker.cancel')} variant="secondary" onPress={handleClose} />
        </View>
      </Sheet>

      <DatePicker
        modal
        open={showPicker}
        mode="time"
        theme={scheme}
        date={selection?.kind === 'custom' ? selection.date : new Date()}
        title={t('timePicker.pickTimeTitle')}
        confirmText={t('timePicker.pickerConfirm')}
        cancelText={t('timePicker.pickerCancel')}
        onConfirm={(date) => {
          setSelection({ kind: 'custom', date });
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
      />
    </>
  );
}
