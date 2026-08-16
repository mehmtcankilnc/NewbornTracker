import type { Ionicons } from '@expo/vector-icons';

import type { RecordType } from '@/types/record';

interface RecordTypeMeta {
  label: string;
  /** "When did this happen?" phrased for this record type, used as the time-picker sheet title. */
  question: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentBg: string;
}

export const RECORD_TYPES: Record<RecordType, RecordTypeMeta> = {
  poop: {
    label: 'Kaka',
    question: 'Kaka ne zaman oldu?',
    icon: 'leaf-outline',
    accent: '#A9744F',
    accentBg: '#EFE6DB',
  },
  piss: {
    label: 'Çiş',
    question: 'Çiş ne zaman oldu?',
    icon: 'water-outline',
    accent: '#B08A1E',
    accentBg: '#F3EDD8',
  },
  feed: {
    label: 'Mama',
    question: 'Mama ne zaman verildi?',
    icon: 'restaurant-outline',
    accent: '#5C6B2E',
    accentBg: '#E6E9D8',
  },
  sleep: {
    label: 'Uyku',
    question: 'Uyku ne zaman başladı?',
    icon: 'moon-outline',
    accent: '#6E6B8F',
    accentBg: '#E6E5EE',
  },
};

export const RECORD_TYPE_ORDER: RecordType[] = ['poop', 'piss', 'feed', 'sleep'];
