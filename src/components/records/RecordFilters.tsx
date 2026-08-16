import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, ScrollView, Text, View } from 'react-native';
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
  const [containerWidth, setContainerWidth] = useState(0);
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(null);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editingValue, setEditingValue] = useState(new Date());

  const indicatorX = useSharedValue(0);
  const activeIndex = PERIOD_OPTIONS.findIndex((option) => option.key === period);
  const segmentWidth = containerWidth > 0 ? (containerWidth - 8) / PERIOD_OPTIONS.length : 0;

  useEffect(() => {
    if (segmentWidth > 0) {
      indicatorX.value = withSpring(4 + activeIndex * segmentWidth, {
        damping: 18,
        stiffness: 160,
        mass: 0.6,
      });
    }
  }, [activeIndex, segmentWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  function handleLayout(event: LayoutChangeEvent) {
    setContainerWidth(event.nativeEvent.layout.width);
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
    setEditingValue((field === 'start' ? pendingStart : pendingEnd) ?? new Date());
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

  function handleAndroidFieldChange(event: DateTimePickerEvent, date?: Date) {
    const field = editingField;
    setEditingField(null);
    if (event.type === 'set' && date && field) {
      commitField(field, date);
    }
  }

  function handleIOSFieldChange(_event: DateTimePickerEvent, date?: Date) {
    if (date) setEditingValue(date);
  }

  function applyIOSField() {
    if (editingField) commitField(editingField, editingValue);
    setEditingField(null);
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}>
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
      </ScrollView>

      <View onLayout={handleLayout} className="bg-surface-elevated rounded-full p-1">
        <View className="flex-row">
          {segmentWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: segmentWidth,
                  borderRadius: 999,
                },
                indicatorStyle,
              ]}
              className="bg-primary"
            />
          )}
          {PERIOD_OPTIONS.map((option) => {
            const active = period === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => handleSegmentPress(option.key)}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                className="flex-1 py-2 items-center">
                <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-muted'}`}>
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

          {editingField && Platform.OS === 'android' && (
            <DateTimePicker
              value={editingValue}
              mode="date"
              display="default"
              onChange={handleAndroidFieldChange}
            />
          )}

          {editingField && Platform.OS === 'ios' && (
            <View>
              <DateTimePicker
                value={editingValue}
                mode="date"
                display="spinner"
                textColor="#4B5723"
                themeVariant="light"
                onChange={handleIOSFieldChange}
              />
              <View className="flex-row gap-3 mt-2">
                <View className="flex-1">
                  <Button label="Vazgeç" variant="secondary" onPress={() => setEditingField(null)} />
                </View>
                <View className="flex-1">
                  <Button label="Seç" onPress={applyIOSField} />
                </View>
              </View>
            </View>
          )}

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
      className={`flex-row items-center gap-1.5 h-9 rounded-full px-3 border active:opacity-70 ${
        active ? 'bg-primary border-primary' : 'bg-surface-elevated border-border'
      }`}>
      {icon && <Ionicons name={icon} size={14} color={active ? '#FFFFFF' : (color ?? '#8D8975')} />}
      <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
