import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FEED_SUBTYPE_LABELS, RECORD_TYPES } from '@/constants/recordTypes';
import type { BabyRecord } from '@/types/record';
import { formatDuration, formatTime } from '@/utils/time';

interface RecordListItemProps {
  record: BabyRecord;
  onPress: (record: BabyRecord) => void;
  onDelete: (id: string) => void;
}

export function RecordListItem({ record, onPress, onDelete }: RecordListItemProps) {
  const meta = RECORD_TYPES[record.type];
  const swipeableRef = useRef<Swipeable>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  function askToDelete() {
    setConfirmVisible(true);
  }

  function handleCancel() {
    setConfirmVisible(false);
    swipeableRef.current?.close();
  }

  function handleConfirm() {
    setConfirmVisible(false);
    swipeableRef.current?.close();
    onDelete(record.id);
  }

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        overshootRight={false}
        renderRightActions={() => (
          <Pressable
            onPress={askToDelete}
            accessibilityRole="button"
            accessibilityLabel={`${meta.label} kaydını sil`}
            className="w-20 mb-2 ml-2 rounded-2xl bg-danger items-center justify-center active:opacity-80">
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </Pressable>
        )}>
        <Pressable
          onPress={() => onPress(record)}
          onLongPress={askToDelete}
          accessibilityRole="button"
          accessibilityLabel={`${meta.label}, saat ${formatTime(record.occurredAt)}, düzenlemek için dokun, silmek için basılı tut veya sola kaydır`}
          className="flex-row items-center gap-3 bg-surface-elevated border border-border rounded-2xl px-4 py-3 mb-2 active:opacity-70">
          <View
            className="h-10 w-10 rounded-full items-center justify-center"
            style={{ backgroundColor: meta.accentBg }}>
            <Ionicons name={meta.icon} size={18} color={meta.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-ink text-base font-semibold">{meta.label}</Text>
            {record.type === 'sleep' && record.durationMinutes != null ? (
              <Text className="text-muted text-xs mt-0.5">
                {formatTime(record.occurredAt)}
                {record.endedAt ? ` – ${formatTime(record.endedAt)}` : ''} ·{' '}
                {formatDuration(record.durationMinutes)}
              </Text>
            ) : record.type === 'feed' && record.feedSubtypes?.length ? (
              <Text numberOfLines={1} className="text-muted text-xs mt-0.5">
                {formatTime(record.occurredAt)} ·{' '}
                {record.feedSubtypes.map((subtype) => FEED_SUBTYPE_LABELS[subtype]).join(', ')}
                {record.amountMl != null ? ` · ${record.amountMl} ml` : ''}
              </Text>
            ) : (
              <Text className="text-muted text-xs mt-0.5">{formatTime(record.occurredAt)}</Text>
            )}
          </View>
        </Pressable>
      </Swipeable>

      <ConfirmModal
        visible={confirmVisible}
        title="Kayıt silinsin mi?"
        message={`Bu ${meta.label.toLowerCase()} kaydı silinecek.`}
        confirmLabel="Sil"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
