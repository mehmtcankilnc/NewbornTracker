import {
  endOfDay,
  endOfWeek,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  type Locale,
} from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

import { interpolate, resolve, type TFunction } from '@/i18n/core';
import { tr as trDictionary } from '@/i18n/translations';

const defaultT: TFunction = (key, params) => interpolate(resolve(trDictionary, key), params);

export type Period = 'today' | 'week' | 'month' | 'all' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodOption {
  key: Period;
  label: string;
}

export function getPeriodOptions(t: TFunction = defaultT): PeriodOption[] {
  return [
    { key: 'all', label: t('records.periodAll') },
    { key: 'today', label: t('records.periodToday') },
    { key: 'week', label: t('records.periodWeek') },
    { key: 'month', label: t('records.periodMonth') },
    { key: 'custom', label: t('records.periodCustom') },
  ];
}

export function isWithinPeriod(
  iso: string,
  period: Period,
  customRange?: DateRange | null,
  locale: Locale = trLocale
): boolean {
  if (period === 'all') return true;

  const date = new Date(iso);
  const now = new Date();

  if (period === 'today') return isToday(date);
  if (period === 'week') {
    return isWithinInterval(date, {
      start: startOfWeek(now, { locale }),
      end: endOfWeek(now, { locale }),
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
