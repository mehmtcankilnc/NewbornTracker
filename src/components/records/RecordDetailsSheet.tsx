import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { FEED_SUBTYPE_LABELS, FEED_SUBTYPE_ORDER, RECORD_TYPES } from '@/constants/recordTypes';
import type { RecordEdits } from '@/stores/useRecordsStore';
import type { BabyRecord, FeedSubtype } from '@/types/record';

interface RecordDetailsSheetProps {
  record: BabyRecord | null;
  onSave: (id: string, edits: RecordEdits) => void;
  onClose: () => void;
}

type EditingField = 'date' | 'time' | null;

export function RecordDetailsSheet({ record, onSave, onClose }: RecordDetailsSheetProps) {
  const [occurredAt, setOccurredAt] = useState(new Date());
  const [subtypes, setSubtypes] = useState<Set<FeedSubtype>>(new Set());
  const [amountInput, setAmountInput] = useState('');
  const [editingField, setEditingField] = useState<EditingField>(null);
  // Kept so the sheet still shows its content while animating out, instead of going blank the instant `record` is cleared.
  const [displayRecord, setDisplayRecord] = useState<BabyRecord | null>(null);

  useEffect(() => {
    if (record) {
      setDisplayRecord(record);
      setOccurredAt(new Date(record.occurredAt));
      setSubtypes(new Set(record.feedSubtypes ?? []));
      setAmountInput(record.amountMl != null ? String(record.amountMl) : '');
      setEditingField(null);
    }
  }, [record]);

  if (!displayRecord) return null;

  const meta = RECORD_TYPES[displayRecord.type];
  const isFeed = displayRecord.type === 'feed';

  const isDateChanged = occurredAt.getTime() !== new Date(displayRecord.occurredAt).getTime();
  const isFeedChanged =
    isFeed &&
    (subtypes.size !== (displayRecord.feedSubtypes?.length ?? 0) ||
      (displayRecord.feedSubtypes ?? []).some((s) => !subtypes.has(s)) ||
      amountInput.trim() !== (displayRecord.amountMl != null ? String(displayRecord.amountMl) : ''));
  const isDirty = isDateChanged || isFeedChanged;

  const canSave = (!isFeed || subtypes.size > 0) && isDirty;

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

  function startEditing(field: EditingField) {
    if (!field) return;
    setEditingField(field);
  }

  function commitField(field: 'date' | 'time', value: Date) {
    setOccurredAt((prev) => {
      const next = new Date(prev);
      if (field === 'date') {
        next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
      } else {
        next.setHours(value.getHours(), value.getMinutes(), 0, 0);
      }
      return next;
    });
  }

  function handleSave() {
    if (!canSave || !displayRecord) return;
    const parsed = Number(amountInput.trim());
    const amountMl = amountInput.trim() && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;

    onSave(displayRecord.id, {
      occurredAt: occurredAt.toISOString(),
      ...(isFeed ? { feedSubtypes: Array.from(subtypes), amountMl } : {}),
    });
  }

  return (
    <Sheet visible={record !== null} onClose={onClose}>
      <View className="flex-row items-center gap-2 mb-4">
        <View
          className="h-9 w-9 rounded-full items-center justify-center"
          style={{ backgroundColor: meta.accentBg }}>
          <Ionicons name={meta.icon} size={16} color={meta.accent} />
        </View>
        <Text className="text-ink text-lg font-semibold">{meta.label} kaydını düzenle</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={() => startEditing('date')}
          accessibilityRole="button"
          accessibilityLabel="Tarih"
          className="flex-1 bg-surface-elevated rounded-2xl px-4 py-3">
          <Text className="text-muted text-xs">Tarih</Text>
          <Text className="text-ink text-sm font-semibold mt-0.5">
            {format(occurredAt, 'd MMMM yyyy', { locale: tr })}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => startEditing('time')}
          accessibilityRole="button"
          accessibilityLabel="Saat"
          className="flex-1 bg-surface-elevated rounded-2xl px-4 py-3">
          <Text className="text-muted text-xs">Saat</Text>
          <Text className="text-ink text-sm font-semibold mt-0.5">{format(occurredAt, 'HH:mm')}</Text>
        </Pressable>
      </View>

      <DatePicker
        modal
        open={editingField !== null}
        mode={editingField ?? 'date'}
        date={occurredAt}
        title={editingField === 'time' ? 'Saat seç' : 'Tarih seç'}
        confirmText="Seç"
        cancelText="Vazgeç"
        onConfirm={(value) => {
          if (editingField) commitField(editingField, value);
          setEditingField(null);
        }}
        onCancel={() => setEditingField(null)}
      />

      {isFeed && (
        <>
          <Text className="text-ink text-sm font-semibold mt-5 mb-2">Mama türü</Text>
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
        </>
      )}

      <View className="mt-5 gap-3">
        <Button label="Kaydet" onPress={handleSave} disabled={!canSave} />
        <Button label="İptal" variant="secondary" onPress={onClose} />
      </View>
    </Sheet>
  );
}
