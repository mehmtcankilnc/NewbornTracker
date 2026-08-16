import { format, isToday, isYesterday, subMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';

import type { BabyRecord } from '@/types/record';

export interface QuickPickOption {
  label: string;
  minutesAgo: number;
}

export const QUICK_PICK_OPTIONS: QuickPickOption[] = [
  { label: 'Şimdi', minutesAgo: 0 },
  { label: '3 dakika önce', minutesAgo: 3 },
  { label: '5 dakika önce', minutesAgo: 5 },
  { label: '10 dakika önce', minutesAgo: 10 },
  { label: '15 dakika önce', minutesAgo: 15 },
  { label: '30 dakika önce', minutesAgo: 30 },
  { label: '60 dakika önce', minutesAgo: 60 },
];

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

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} dk`;
  if (mins === 0) return `${hours} sa`;
  return `${hours} sa ${mins} dk`;
}

export function todayDateLabel(): string {
  return `Bugün, ${format(new Date(), 'd MMMM', { locale: tr })}`;
}

export function formatDurationCompact(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}dk`;
  if (mins === 0) return `${hours}s`;
  return `${hours}s ${mins}dk`;
}

export function dayLabel(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return 'Bugün';
  if (isYesterday(date)) return 'Dün';
  return format(date, 'd MMMM EEEE', { locale: tr });
}

export interface RecordSection {
  title: string;
  data: BabyRecord[];
}

export function groupByDay(records: BabyRecord[]): RecordSection[] {
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
      title: dayLabel(data[0]?.occurredAt ?? key),
      data,
    }));
}
