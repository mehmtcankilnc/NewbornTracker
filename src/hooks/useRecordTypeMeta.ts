import type { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { useAppTheme } from '@/theme/useAppTheme';
import type { RecordType } from '@/types/record';

export interface RecordTypeMeta {
  label: string;
  /** "When did this happen?" phrased for this record type, used as the time-picker sheet title. */
  question: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentBg: string;
}

const ICONS: Record<RecordType, keyof typeof Ionicons.glyphMap> = {
  poop: 'leaf-outline',
  piss: 'water-outline',
  feed: 'restaurant-outline',
  sleep: 'moon-outline',
};

/** Translated + theme-aware record type metadata for the live app UI. (The widget uses the static `RECORD_TYPES` in `constants/recordTypes.ts` instead — it's Turkish/light-only by design.) */
export function useRecordTypeMeta(): Record<RecordType, RecordTypeMeta> {
  const { t } = useTranslation();
  const { recordColors } = useAppTheme();

  return {
    poop: {
      label: t('recordTypes.poop.label'),
      question: t('recordTypes.poop.question'),
      icon: ICONS.poop,
      ...recordColors.poop,
    },
    piss: {
      label: t('recordTypes.piss.label'),
      question: t('recordTypes.piss.question'),
      icon: ICONS.piss,
      ...recordColors.piss,
    },
    feed: {
      label: t('recordTypes.feed.label'),
      question: t('recordTypes.feed.question'),
      icon: ICONS.feed,
      ...recordColors.feed,
    },
    sleep: {
      label: t('recordTypes.sleep.label'),
      question: t('recordTypes.sleep.question'),
      icon: ICONS.sleep,
      ...recordColors.sleep,
    },
  };
}
