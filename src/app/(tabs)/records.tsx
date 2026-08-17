import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecordDetailsSheet } from '@/components/records/RecordDetailsSheet';
import { RecordFilters } from '@/components/records/RecordFilters';
import { RecordListItem } from '@/components/records/RecordListItem';
import { RecordListSkeleton } from '@/components/records/RecordListSkeleton';
import { Button } from '@/components/ui/Button';
import { FEED_SUBTYPE_LABELS, FEED_SUBTYPE_ORDER } from '@/constants/recordTypes';
import { useRecordsStore } from '@/stores/useRecordsStore';
import type { BabyRecord, FeedSubtype, RecordType } from '@/types/record';
import { isWithinPeriod, type DateRange, type Period } from '@/utils/filters';
import { groupByDay } from '@/utils/time';

type ListRow =
  | { kind: 'header'; title: string; countLabel: string | null }
  | { kind: 'record'; record: BabyRecord };

/** e.g. "3 süt emme · 1 ekstra mama" for a day's feed records, skipping subtypes with no records that day. */
function buildFeedBreakdown(records: BabyRecord[]): string {
  const counts: Partial<Record<FeedSubtype, number>> = {};
  let untyped = 0;

  for (const record of records) {
    if (record.feedSubtypes?.length) {
      for (const subtype of record.feedSubtypes) {
        counts[subtype] = (counts[subtype] ?? 0) + 1;
      }
    } else {
      untyped += 1;
    }
  }

  const parts = FEED_SUBTYPE_ORDER.filter((subtype) => counts[subtype]).map(
    (subtype) => `${counts[subtype]} ${FEED_SUBTYPE_LABELS[subtype].toLowerCase()}`
  );
  if (untyped > 0) parts.push(`${untyped} diğer`);

  return parts.join(' · ');
}

export default function RecordsScreen() {
  const records = useRecordsStore((s) => s.records);
  const hasHydrated = useRecordsStore((s) => s.hasHydrated);
  const deleteRecord = useRecordsStore((s) => s.deleteRecord);
  const updateRecord = useRecordsStore((s) => s.updateRecord);

  const [selectedTypes, setSelectedTypes] = useState<Set<RecordType>>(new Set());
  const [period, setPeriod] = useState<Period>('today');
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [editingRecord, setEditingRecord] = useState<BabyRecord | null>(null);

  function toggleType(type: RecordType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function selectCustomRange(range: DateRange) {
    setCustomRange(range);
    setPeriod('custom');
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (selectedTypes.size > 0 && !selectedTypes.has(record.type)) return false;
      if (!isWithinPeriod(record.occurredAt, period, customRange)) return false;
      return true;
    });
  }, [records, selectedTypes, period, customRange]);

  const isFeedOnlyFilter = selectedTypes.size === 1 && selectedTypes.has('feed');

  const rows = useMemo<ListRow[]>(() => {
    const sections = groupByDay(filteredRecords);
    return sections.flatMap((section) => {
      const countLabel =
        selectedTypes.size === 0
          ? null
          : isFeedOnlyFilter
            ? buildFeedBreakdown(section.data)
            : `${section.data.length} kayıt`;

      return [
        { kind: 'header' as const, title: section.title, countLabel },
        ...section.data.map((record) => ({ kind: 'record' as const, record })),
      ];
    });
  }, [filteredRecords, selectedTypes, isFeedOnlyFilter]);

  const hasFilters = selectedTypes.size > 0 || period !== 'all';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="px-5 pt-4">
        <RecordFilters
          selectedTypes={selectedTypes}
          onToggleType={toggleType}
          onClearTypes={() => setSelectedTypes(new Set())}
          period={period}
          customRange={customRange}
          onSelectPeriod={setPeriod}
          onSelectCustomRange={selectCustomRange}
          onClearCustomRange={() => setCustomRange(null)}
        />
      </View>

      {/* Kept mounted at all times (empty state handled via ListEmptyComponent) so switching
          filters never remounts the list itself — that mount/unmount was what made filter
          switches feel janky, not the segmented indicator animation. */}
      {!hasHydrated ? (
        <RecordListSkeleton />
      ) : (
      <FlashList
        data={rows}
        keyExtractor={(row) => (row.kind === 'header' ? `h-${row.title}` : row.record.id)}
        getItemType={(row) => row.kind}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <View className="items-center justify-center px-8 pt-16">
            <Text className="text-ink text-base font-semibold text-center">
              {records.length === 0 ? 'Henüz kayıt yok' : 'Bu filtrelere uygun kayıt yok'}
            </Text>
            <Text className="text-muted text-sm text-center mt-1">
              {records.length === 0
                ? 'Ana Sayfa sekmesinden kaka, çiş, mama veya uyku kaydı oluşturduğunda burada görünecek.'
                : hasFilters
                  ? 'Farklı bir filtre deneyin veya filtreleri temizleyin.'
                  : ''}
            </Text>
            {records.length === 0 && (
              <View className="mt-6">
                <Button label="Ana Sayfa'ya git" onPress={() => router.navigate('/')} />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) =>
          item.kind === 'header' ? (
            <View className="flex-row items-baseline justify-between mt-4 mb-2">
              <Text className="text-muted text-xs font-semibold uppercase">{item.title}</Text>
              {item.countLabel ? (
                <Text className="text-muted text-xs font-semibold">{item.countLabel}</Text>
              ) : null}
            </View>
          ) : (
            <RecordListItem record={item.record} onPress={setEditingRecord} onDelete={deleteRecord} />
          )
        }
      />
      )}

      <RecordDetailsSheet
        record={editingRecord}
        onSave={(id, edits) => {
          updateRecord(id, edits);
          setEditingRecord(null);
        }}
        onClose={() => setEditingRecord(null)}
      />
    </SafeAreaView>
  );
}
