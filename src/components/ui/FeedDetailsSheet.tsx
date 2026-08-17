import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useFeedSubtypeLabels } from '@/hooks/useFeedSubtypeLabels';
import { useTranslation } from '@/i18n';
import { useAppTheme } from '@/theme/useAppTheme';
import { FEED_SUBTYPE_ORDER } from '@/constants/recordTypes';
import type { FeedSubtype } from '@/types/record';

interface FeedDetailsSheetProps {
  visible: boolean;
  onConfirm: (subtypes: FeedSubtype[], amountMl?: number) => void;
  onClose: () => void;
}

export function FeedDetailsSheet({ visible, onConfirm, onClose }: FeedDetailsSheetProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const feedSubtypeLabels = useFeedSubtypeLabels();
  const [subtypes, setSubtypes] = useState<Set<FeedSubtype>>(new Set());
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    if (!visible) {
      setSubtypes(new Set());
      setAmountInput('');
    }
  }, [visible]);

  function toggleSubtype(option: FeedSubtype) {
    setSubtypes((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  }

  function handleConfirm() {
    if (subtypes.size === 0) return;
    const parsed = Number(amountInput.trim());
    const amountMl = amountInput.trim() && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    onConfirm(Array.from(subtypes), amountMl);
  }

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text className="text-ink dark:text-ink-night text-lg font-semibold mb-4">{t('feedDetails.title')}</Text>

      <View className="gap-2">
        {FEED_SUBTYPE_ORDER.map((option) => {
          const isSelected = subtypes.has(option);
          return (
            <Pressable
              key={option}
              onPress={() => toggleSubtype(option)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={feedSubtypeLabels[option]}
              className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
                isSelected ? 'bg-primary dark:bg-primary-night' : 'bg-surface-elevated dark:bg-surface-elevated-night'
              }`}>
              <Text
                className={`text-base ${isSelected ? 'text-white font-semibold' : 'text-ink dark:text-ink-night'}`}>
                {feedSubtypeLabels[option]}
              </Text>
              {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4">
        <Text className="text-muted dark:text-muted-night text-xs font-semibold mb-1.5">
          {t('feedDetails.amountLabel')}
        </Text>
        <TextInput
          value={amountInput}
          onChangeText={setAmountInput}
          placeholder={t('feedDetails.amountPlaceholder')}
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          maxLength={4}
          accessibilityLabel={t('feedDetails.amountLabel')}
          className="bg-surface-elevated dark:bg-surface-elevated-night rounded-full px-4 h-12 text-ink dark:text-ink-night text-base"
        />
      </View>

      <View className="mt-5 gap-3">
        <Button label={t('feedDetails.save')} onPress={handleConfirm} disabled={subtypes.size === 0} />
        <Button label={t('feedDetails.cancel')} variant="secondary" onPress={onClose} />
      </View>
    </Sheet>
  );
}
