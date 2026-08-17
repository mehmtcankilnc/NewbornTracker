import type { RecordType } from '@/types/record';

/**
 * Mirrors the hex values in tailwind.config.js (`-night` suffixed tokens).
 * Kept as plain objects (not read from the config file) so this stays a simple,
 * dependency-free source for the handful of places that need raw hex instead of
 * a className — Ionicons `color`, TextInput `placeholderTextColor`,
 * react-native-date-picker's `theme` prop, etc.
 */
export interface AppColors {
  surface: string;
  surfaceElevated: string;
  ink: string;
  muted: string;
  border: string;
  primary: string;
  primaryDark: string;
  highlight: string;
  danger: string;
  white: string;
}

export const lightColors: AppColors = {
  surface: '#F2F0E3',
  surfaceElevated: '#E9E6D5',
  ink: '#1C1B16',
  muted: '#8D8975',
  border: '#DCD8C3',
  primary: '#4B5723',
  primaryDark: '#3A4319',
  highlight: '#C1512F',
  danger: '#B23B3B',
  white: '#FFFFFF',
};

export const darkColors: AppColors = {
  surface: '#141310',
  surfaceElevated: '#221F17',
  ink: '#F2EFE6',
  muted: '#A7A18E',
  border: '#332F24',
  primary: '#8FA352',
  primaryDark: '#6B7A3B',
  highlight: '#E38356',
  danger: '#E0605E',
  white: '#FFFFFF',
};

export interface RecordTypeColorSet {
  accent: string;
  accentBg: string;
}

type RecordTypeColors = Record<RecordType, RecordTypeColorSet>;

export const lightRecordColors: RecordTypeColors = {
  poop: { accent: '#A9744F', accentBg: '#EFE6DB' },
  piss: { accent: '#B08A1E', accentBg: '#F3EDD8' },
  feed: { accent: '#5C6B2E', accentBg: '#E6E9D8' },
  sleep: { accent: '#6E6B8F', accentBg: '#E6E5EE' },
};

export const darkRecordColors: RecordTypeColors = {
  poop: { accent: '#C99872', accentBg: '#2B2119' },
  piss: { accent: '#D4B354', accentBg: '#2C2717' },
  feed: { accent: '#8FA352', accentBg: '#232819' },
  sleep: { accent: '#9C99C2', accentBg: '#211F2B' },
};
