import { Appearance } from 'react-native';

import { RECORD_TYPE_ORDER } from '@/constants/recordTypes';
import { interpolate, resolve, type Language, type TFunction, type TranslationKey } from '@/i18n/core';
import { en, tr } from '@/i18n/translations';
import { darkColors, darkRecordColors, lightColors, lightRecordColors } from '@/theme/colors';
import type { BabyRecord, RecordType } from '@/types/record';
import { getTodayStats } from '@/utils/stats';
import { formatDurationCompact } from '@/utils/time';

import type { BebekWidgetProps, BebekWidgetQuickButton } from './BebekWidget';
import { getWidgetSettings, getWidgetSnapshot } from './widgetStorage';

const QUICK_ADD_TYPES: RecordType[] = ['feed', 'piss', 'poop'];

const RECORD_LABEL_KEY: Record<RecordType, TranslationKey> = {
  poop: 'recordTypes.poop.label',
  piss: 'recordTypes.piss.label',
  feed: 'recordTypes.feed.label',
  sleep: 'recordTypes.sleep.label',
};

function resolveScheme(themeMode: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (themeMode !== 'system') return themeMode;
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

function elapsedLabel(iso: string, t: TFunction): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return t('time.justNow');
  return `${formatDurationCompact(minutes, t)} ${t('time.agoSuffix')}`;
}

export async function buildWidgetProps(): Promise<BebekWidgetProps> {
  const { records, activeSleep, babyName } = await getWidgetSnapshot();
  const { themeMode, language } = await getWidgetSettings();

  const dictionary = language === 'en' ? en : tr;
  const t: TFunction = (key, params) => interpolate(resolve(dictionary, key), params);
  const scheme = resolveScheme(themeMode);
  const recordColors = scheme === 'dark' ? darkRecordColors : lightRecordColors;
  const palette = scheme === 'dark' ? darkColors : lightColors;

  const stats = getTodayStats(records);

  const lastByType: Partial<Record<RecordType, BabyRecord>> = {};
  for (const record of records) {
    if (!lastByType[record.type]) lastByType[record.type] = record;
  }

  const rows = RECORD_TYPE_ORDER.filter((type) => type !== 'sleep' || !activeSleep).map((type) => {
    const record = lastByType[type];
    const label = t(RECORD_LABEL_KEY[type]);

    if (type === 'sleep' && record?.endedAt && record.durationMinutes) {
      return {
        type,
        text: t('widget.sleepEnded', {
          duration: formatDurationCompact(record.durationMinutes, t),
          elapsed: elapsedLabel(record.endedAt, t),
        }),
        hasRecord: true,
      };
    }

    return {
      type,
      text: record
        ? t('widget.lastRecord', { label, elapsed: elapsedLabel(record.occurredAt, t) })
        : t('widget.noRecord', { label }),
      hasRecord: Boolean(record),
    };
  });

  const todaySummary = t('widget.todaySummary', {
    feed: stats.feed,
    piss: stats.piss,
    poop: stats.poop,
    sleep: formatDurationCompact(stats.sleepMinutes, t),
  });

  const isSleeping = Boolean(activeSleep);

  const quickButtons: BebekWidgetQuickButton[] = [
    ...QUICK_ADD_TYPES.map((type) => ({
      type,
      label: t(RECORD_LABEL_KEY[type]),
      color: recordColors[type].accent,
      showPlus: true,
    })),
    {
      type: 'sleep' as RecordType,
      label: isSleeping ? t('widget.stopLabel') : t('recordTypes.sleep.label'),
      color: isSleeping ? palette.danger : recordColors.sleep.accent,
      showPlus: !isSleeping,
    },
  ];

  return {
    scheme,
    greeting: babyName ? t('widget.greetingNamed', { name: babyName }) : t('widget.greetingAnon'),
    refreshLabel: t('widget.refreshLabel'),
    rows,
    activeSleepText: activeSleep ? t('widget.sleepingBadge', { elapsed: elapsedLabel(activeSleep.startedAt, t) }) : null,
    todaySummary,
    quickButtons,
  };
}

export type { Language };
