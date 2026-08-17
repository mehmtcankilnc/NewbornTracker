import {
  endOfDay,
  endOfWeek,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { tr } from 'date-fns/locale';

export type Period = 'today' | 'week' | 'month' | 'all' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodOption {
  key: Period;
  label: string;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'today', label: 'Bugün' },
  { key: 'week', label: 'Hafta' },
  { key: 'month', label: 'Ay' },
  { key: 'custom', label: 'Özel' },
];

export function isWithinPeriod(iso: string, period: Period, customRange?: DateRange | null): boolean {
  if (period === 'all') return true;

  const date = new Date(iso);
  const now = new Date();

  if (period === 'today') return isToday(date);
  if (period === 'week') {
    return isWithinInterval(date, {
      start: startOfWeek(now, { locale: tr }),
      end: endOfWeek(now, { locale: tr }),
    });
  }
  if (period === 'month') return isSameMonth(date, now);
  if (period === 'custom') {
    if (!customRange) return false;
    return isWithinInterval(date, {
      start: startOfDay(customRange.start),
      end: endOfDay(customRange.end),
    });
  }
  return true;
}
