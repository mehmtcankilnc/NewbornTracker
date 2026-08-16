import { isToday } from 'date-fns';

import type { BabyRecord } from '@/types/record';

export interface TodayStats {
  poop: number;
  piss: number;
  feed: number;
  sleepMinutes: number;
}

export function getTodayStats(records: BabyRecord[]): TodayStats {
  const stats: TodayStats = { poop: 0, piss: 0, feed: 0, sleepMinutes: 0 };

  for (const record of records) {
    if (!isToday(new Date(record.occurredAt))) continue;

    if (record.type === 'sleep') {
      stats.sleepMinutes += record.durationMinutes ?? 0;
    } else {
      stats[record.type] += 1;
    }
  }

  return stats;
}
