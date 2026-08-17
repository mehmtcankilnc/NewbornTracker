import { format, isToday, isYesterday, subMinutes, type Locale } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

import { interpolate, resolve, type TFunction } from '@/i18n/core';
import { tr as trDictionary } from '@/i18n/translations';
import type { BabyRecord } from '@/types/record';

/** Used when a caller doesn't have a live `t` from `useTranslation()` (e.g. the widget's headless JS context, which stays Turkish-only). */
const defaultT: TFunction = (key, params) => interpolate(resolve(trDictionary, key), params);

export interface QuickPickOption {
  label: string;
  minutesAgo: number;
}

const QUICK_PICK_MINUTES = [0, 3, 5, 10, 15, 30, 60];

export function getQuickPickOptions(t: TFunction = defaultT): QuickPickOption[] {
  return QUICK_PICK_MINUTES.map((minutesAgo) => ({
    minutesAgo,
    label: minutesAgo === 0 ? t('time.now') : t('time.minutesAgo', { n: minutesAgo }),
  }));
}

export function offsetToIso(minutesAgo: number): string {
  return subMinutes(new Date(), minutesAgo).toISOString();
}

/** Combines a picked time-of-day with today's date, so the "Custom" picker only needs to ask for a time. */
export function combineTodayWithTime(time: Date): string {
  const now = new Date();
  const combined = new Date(now);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  if (combined.getTime() > now.getTime()) {
    combined.setDate(combined.getDate() - 1);
  }
  return combined.toISOString();
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

export function formatDuration(minutes: number, t: TFunction = defaultT): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const h = t('time.hoursShort');
  const m = t('time.minutesShort');
  if (hours === 0) return `${mins} ${m}`;
  if (mins === 0) return `${hours} ${h}`;
  return `${hours} ${h} ${mins} ${m}`;
}

export function todayDateLabel(t: TFunction = defaultT, locale: Locale = trLocale): string {
  return t('time.todayDateLabel', { date: format(new Date(), 'd MMMM', { locale }) });
}

export function formatDurationCompact(minutes: number, t: TFunction = defaultT): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const h = t('time.hoursCompact');
  const m = t('time.minutesCompact');
  if (hours === 0) return `${mins}${m}`;
  if (mins === 0) return `${hours}${h}`;
  return `${hours}${h} ${mins}${m}`;
}

export function dayLabel(iso: string, t: TFunction = defaultT, locale: Locale = trLocale): string {
  const date = new Date(iso);
  if (isToday(date)) return t('time.today');
  if (isYesterday(date)) return t('time.yesterday');
  return format(date, 'd MMMM EEEE', { locale });
}

export interface RecordSection {
  title: string;
  data: BabyRecord[];
}

export function groupByDay(
  records: BabyRecord[],
  t: TFunction = defaultT,
  locale: Locale = trLocale
): RecordSection[] {
  const groups = new Map<string, BabyRecord[]>();

  for (const record of records) {
    const key = format(new Date(record.occurredAt), 'yyyy-MM-dd');
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(record);
    } else {
      groups.set(key, [record]);
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, data]) => ({
      title: dayLabel(data[0]?.occurredAt ?? key, t, locale),
      data,
    }));
}
