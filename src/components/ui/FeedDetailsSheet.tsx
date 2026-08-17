import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { FEED_SUBTYPE_LABELS, FEED_SUBTYPE_ORDER } from '@/constants/recordTypes';
import type { FeedSubtype } from '@/types/record';

interface FeedDetailsSheetProps {
  visible: boolean;
  onConfirm: (subtypes: FeedSubtype[], amountMl?: number) => void;
  onClose: () => void;
}

export function FeedDetailsSheet({ visible, onConfirm, onClose }: FeedDetailsSheetProps) {
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
      <Text className="text-ink text-lg font-semibold mb-4">Mama türü</Text>

      <View className="gap-2">
        {FEED_SUBTYPE_ORDER.map((option) => {
          const isSelected = subtypes.has(option);
          return (
            <Pressable
              key={option}
              onPress={() => toggleSubtype(option)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={FEED_SUBTYPE_LABELS[option]}
              className={`min-h-[48px] rounded-full flex-row items-center justify-between px-4 active:opacity-70 ${
                isSelected ? 'bg-primary' : 'bg-surface-elevated'
              }`}>
              <Text className={`text-base ${isSelected ? 'text-white font-semibold' : 'text-ink'}`}>
                {FEED_SUBTYPE_LABELS[option]}
              </Text>
              {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4">
        <Text className="text-muted text-xs font-semibold mb-1.5">Miktar (ml, opsiyonel)</Text>
        <TextInput
          value={amountInput}
          onChangeText={setAmountInput}
          placeholder="Örn. 120"
          placeholderTextColor="#8D8975"
          keyboardType="numeric"
          maxLength={4}
          accessibilityLabel="Miktar (ml)"
          className="bg-surface-elevated rounded-full px-4 h-12 text-ink text-base"
        />
      </View>

      <View className="mt-5 gap-3">
        <Button label="Kaydet" onPress={handleConfirm} disabled={subtypes.size === 0} />
        <Button label="İptal" variant="secondary" onPress={onClose} />
      </View>
    </Sheet>
  );
}
