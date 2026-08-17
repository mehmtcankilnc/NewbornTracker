import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { RECORD_TYPE_ORDER, RECORD_TYPES } from '@/constants/recordTypes';
import type { RecordType } from '@/types/record';
import { PERIOD_OPTIONS, type DateRange, type Period } from '@/utils/filters';

interface RecordFiltersProps {
  selectedTypes: Set<RecordType>;
  onToggleType: (type: RecordType) => void;
  onClearTypes: () => void;
  period: Period;
  customRange: DateRange | null;
  onSelectPeriod: (period: Period) => void;
  onSelectCustomRange: (range: DateRange) => void;
  onClearCustomRange: () => void;
}

type EditingField = 'start' | 'end' | null;

export function RecordFilters({
  selectedTypes,
  onToggleType,
  onClearTypes,
  period,
  customRange,
  onSelectPeriod,
  onSelectCustomRange,
  onClearCustomRange,
}: RecordFiltersProps) {
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(null);
  const [editingField, setEditingField] = useState<EditingField>(null);
  // Measured per-segment position, so the sliding indicator lines up exactly with each
  // Pressable's real bounds instead of an estimate derived from container width / count
  // (which drifted a few px off — and with it, the text — whenever the division wasn't exact).
  const [segmentLayouts, setSegmentLayouts] = useState<Array<{ x: number; width: number } | null>>(
    () => PERIOD_OPTIONS.map(() => null)
  );

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const activeIndex = PERIOD_OPTIONS.findIndex((option) => option.key === period);
  const activeLayout = segmentLayouts[activeIndex];

  useEffect(() => {
    if (!activeLayout) return;
    const spring = { damping: 18, stiffness: 160, mass: 0.6 };
    indicatorX.value = withSpring(activeLayout.x, spring);
    indicatorWidth.value = withSpring(activeLayout.width, spring);
  }, [activeLayout, indicatorX, indicatorWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  function handleSegmentLayout(index: number, event: LayoutChangeEvent) {
    const { x, width } = event.nativeEvent.layout;
    setSegmentLayouts((prev) => {
      const next = [...prev];
      next[index] = { x, width };
      return next;
    });
  }

  function handleSegmentPress(key: Period) {
    if (key === 'custom') {
      setPendingStart(customRange?.start ?? null);
      setPendingEnd(customRange?.end ?? null);
      setShowRangePicker(true);
    } else {
      // Switching away discards any unapplied or previously applied custom date selection.
      setShowRangePicker(false);
      setEditingField(null);
      setPendingStart(null);
      setPendingEnd(null);
      onClearCustomRange();
    }
    onSelectPeriod(key);
  }

  function startEditing(field: EditingField) {
    if (!field) return;
    setEditingField(field);
  }

  function commitField(field: 'start' | 'end', date: Date) {
    if (field === 'start') {
      setPendingStart(date);
      // Default the end date to match, so a single tap filters one day —
      // the user can still tap "Bitiş" afterwards to widen the range.
      setPendingEnd((prevEnd) => (prevEnd && prevEnd >= date ? prevEnd : date));
    } else {
      setPendingEnd(date);
    }
  }

  const canApplyRange = !!pendingStart;

  function applyRange() {
    if (!pendingStart) return;
    const end = pendingEnd && pendingEnd >= pendingStart ? pendingEnd : pendingStart;
    onSelectCustomRange({ start: pendingStart, end });
    setShowRangePicker(false);
  }

  function cancelRange() {
    setShowRangePicker(false);
    setEditingField(null);
  }

  return (
    <View className="gap-3">
      <View className="flex-row gap-1.5">
        <FilterChip label="Tümü" active={selectedTypes.size === 0} onPress={onClearTypes} />
        {RECORD_TYPE_ORDER.map((type) => {
          const meta = RECORD_TYPES[type];
          return (
            <FilterChip
              key={type}
              label={meta.label}
              icon={meta.icon}
              color={meta.accent}
              active={selectedTypes.has(type)}
              onPress={() => onToggleType(type)}
            />
          );
        })}
      </View>

      <View className="bg-surface-elevated rounded-full p-1">
        <View className="flex-row">
          {activeLayout && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  borderRadius: 999,
                },
                indicatorStyle,
              ]}
              className="bg-primary"
            />
          )}
          {PERIOD_OPTIONS.map((option, index) => {
            const active = period === option.key;
            return (
              <Pressable
                key={option.key}
                onLayout={(event) => handleSegmentLayout(index, event)}
                onPress={() => handleSegmentPress(option.key)}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                className="flex-1 py-2 items-center">
                <Text
                  style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-muted'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {period === 'custom' && customRange && !showRangePicker && (
        <Text className="text-muted text-xs">
          {format(customRange.start, 'd MMM', { locale: tr })} –{' '}
          {format(customRange.end, 'd MMM yyyy', { locale: tr })}
        </Text>
      )}

      {showRangePicker && (
        <View className="bg-surface-elevated rounded-2xl p-4 gap-3">
          <DateField
            label="Başlangıç"
            date={pendingStart}
            onPress={() => startEditing('start')}
          />
          <DateField label="Bitiş" date={pendingEnd} onPress={() => startEditing('end')} />

          <DatePicker
            modal
            open={editingField !== null}
            mode="date"
            date={(editingField === 'start' ? pendingStart : pendingEnd) ?? new Date()}
            title={editingField === 'start' ? 'Başlangıç' : 'Bitiş'}
            confirmText="Seç"
            cancelText="Vazgeç"
            onConfirm={(date) => {
              if (editingField) commitField(editingField, date);
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />

          {!editingField && (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button label="Vazgeç" variant="secondary" onPress={cancelRange} />
              </View>
              <View className="flex-1">
                <Button label="Uygula" onPress={applyRange} disabled={!canApplyRange} />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

interface DateFieldProps {
  label: string;
  date: Date | null;
  onPress: () => void;
}

function DateField({ label, date, onPress }: DateFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center justify-between bg-surface rounded-2xl px-4 py-3 active:opacity-70">
      <Text className="text-muted text-sm">{label}</Text>
      <Text className="text-ink text-sm font-semibold">
        {date ? format(date, 'd MMMM yyyy', { locale: tr }) : 'Seç'}
      </Text>
    </Pressable>
  );
}

interface FilterChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  active: boolean;
  onPress: () => void;
}

function FilterChip({ label, icon, color, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-1 flex-row items-center justify-center gap-1 h-9 rounded-full px-1.5 border active:opacity-70 ${
        active ? 'bg-primary border-primary' : 'bg-surface-elevated border-border'
      }`}>
      {icon && <Ionicons name={icon} size={13} color={active ? '#FFFFFF' : (color ?? '#8D8975')} />}
      <Text
        numberOfLines={1}
        className={`text-xs font-semibold ${active ? 'text-white' : 'text-ink'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
