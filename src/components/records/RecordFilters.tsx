import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { RECORD_TYPE_ORDER } from '@/constants/recordTypes';
import { useRecordTypeMeta } from '@/hooks/useRecordTypeMeta';
import { useTranslation } from '@/i18n';
import { useAppTheme } from '@/theme/useAppTheme';
import type { RecordType } from '@/types/record';
import { getPeriodOptions, type DateRange, type Period } from '@/utils/filters';

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
  const { t, dateFnsLocale } = useTranslation();
  const { scheme } = useAppTheme();
  const recordTypeMeta = useRecordTypeMeta();
  const periodOptions = getPeriodOptions(t);

  const [showRangePicker, setShowRangePicker] = useState(false);
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(null);
  const [editingField, setEditingField] = useState<EditingField>(null);
  // Measured per-segment position, so the sliding indicator lines up exactly with each
  // Pressable's real bounds instead of an estimate derived from container width / count
  // (which drifted a few px off — and with it, the text — whenever the division wasn't exact).
  const [segmentLayouts, setSegmentLayouts] = useState<Array<{ x: number; width: number } | null>>(
    () => periodOptions.map(() => null)
  );

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const activeIndex = periodOptions.findIndex((option) => option.key === period);
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
        <FilterChip label={t('common.all')} active={selectedTypes.size === 0} onPress={onClearTypes} />
        {RECORD_TYPE_ORDER.map((type) => {
          const meta = recordTypeMeta[type];
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

      <View className="bg-surface-elevated dark:bg-surface-elevated-night rounded-full p-1">
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
              className="bg-primary dark:bg-primary-night"
            />
          )}
          {periodOptions.map((option, index) => {
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
                  className={`text-xs font-semibold ${active ? 'text-white' : 'text-muted dark:text-muted-night'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {period === 'custom' && customRange && !showRangePicker && (
        <Text className="text-muted dark:text-muted-night text-xs">
          {format(customRange.start, 'd MMM', { locale: dateFnsLocale })} –{' '}
          {format(customRange.end, 'd MMM yyyy', { locale: dateFnsLocale })}
        </Text>
      )}

      {showRangePicker && (
        <View className="bg-surface-elevated dark:bg-surface-elevated-night rounded-2xl p-4 gap-3">
          <DateField label={t('records.start')} date={pendingStart} onPress={() => startEditing('start')} />
          <DateField label={t('records.end')} date={pendingEnd} onPress={() => startEditing('end')} />

          <DatePicker
            modal
            open={editingField !== null}
            mode="date"
            theme={scheme}
            date={(editingField === 'start' ? pendingStart : pendingEnd) ?? new Date()}
            title={editingField === 'start' ? t('records.start') : t('records.end')}
            confirmText={t('records.select')}
            cancelText={t('records.cancelRange')}
            onConfirm={(date) => {
              if (editingField) commitField(editingField, date);
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />

          {!editingField && (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button label={t('records.cancelRange')} variant="secondary" onPress={cancelRange} />
              </View>
              <View className="flex-1">
                <Button label={t('records.applyRange')} onPress={applyRange} disabled={!canApplyRange} />
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
  const { t, dateFnsLocale } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center justify-between bg-surface dark:bg-surface-night rounded-2xl px-4 py-3 active:opacity-70">
      <Text className="text-muted dark:text-muted-night text-sm">{label}</Text>
      <Text className="text-ink dark:text-ink-night text-sm font-semibold">
        {date ? format(date, 'd MMMM yyyy', { locale: dateFnsLocale }) : t('records.select')}
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
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-1 flex-row items-center justify-center gap-1 h-9 rounded-full px-1.5 border active:opacity-70 ${
        active
          ? 'bg-primary dark:bg-primary-night border-primary dark:border-primary-night'
          : 'bg-surface-elevated dark:bg-surface-elevated-night border-border dark:border-border-night'
      }`}>
      {icon && <Ionicons name={icon} size={13} color={active ? colors.white : (color ?? colors.muted)} />}
      <Text
        numberOfLines={1}
        className={`text-xs font-semibold ${active ? 'text-white' : 'text-ink dark:text-ink-night'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
