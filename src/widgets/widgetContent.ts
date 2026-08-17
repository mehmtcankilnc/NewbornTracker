import { RECORD_TYPE_ORDER, RECORD_TYPES } from "@/constants/recordTypes";
import type { BabyRecord, RecordType } from "@/types/record";
import { getTodayStats } from "@/utils/stats";
import { formatDurationCompact } from "@/utils/time";

import type { BebekWidgetProps } from "./BebekWidget";
import { getWidgetSnapshot } from "./widgetStorage";

function elapsedLabel(iso: string): string {
  const minutes = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  return minutes < 1 ? "az önce" : `${formatDurationCompact(minutes)} önce`;
}

export async function buildWidgetProps(): Promise<BebekWidgetProps> {
  const { records, activeSleep, babyName } = await getWidgetSnapshot();
  const stats = getTodayStats(records);

  const lastByType: Partial<Record<RecordType, BabyRecord>> = {};
  for (const record of records) {
    if (!lastByType[record.type]) lastByType[record.type] = record;
  }

  const rows = RECORD_TYPE_ORDER.filter(
    (type) => type !== "sleep" || !activeSleep,
  ).map((type) => {
    const record = lastByType[type];

    if (type === "sleep" && record?.endedAt && record.durationMinutes) {
      return {
        type,
        text: `Uyku • ${formatDurationCompact(record.durationMinutes)} · ${elapsedLabel(record.endedAt)} bitti`,
        hasRecord: true,
      };
    }

    return {
      type,
      text: record
        ? `${RECORD_TYPES[type].label} • ${elapsedLabel(record.occurredAt)}`
        : `${RECORD_TYPES[type].label} kaydı yok`,
      hasRecord: Boolean(record),
    };
  });

  const todaySummary = `Bugün: ${stats.feed} ${RECORD_TYPES.feed.label.toLowerCase()} · ${stats.piss} ${RECORD_TYPES.piss.label.toLowerCase()} · ${stats.poop} ${RECORD_TYPES.poop.label.toLowerCase()} · ${formatDurationCompact(stats.sleepMinutes)} ${RECORD_TYPES.sleep.label.toLowerCase()}`;

  return {
    babyName,
    rows,
    activeSleepText: activeSleep
      ? `😴 Uykuda • ${elapsedLabel(activeSleep.startedAt)}`
      : null,
    isSleeping: Boolean(activeSleep),
    todaySummary,
  };
}
