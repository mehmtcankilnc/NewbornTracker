import { useEffect } from 'react';
import { colorScheme as nativeWindColorScheme, useColorScheme } from 'nativewind';

import { useSettingsStore, type ThemeMode } from '@/stores/useSettingsStore';

import { darkColors, darkRecordColors, lightColors, lightRecordColors } from './colors';

export function useAppTheme() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const { colorScheme } = useColorScheme();
  const scheme: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';

  // Keeps NativeWind's runtime color scheme (which drives every `dark:` className
  // in the app) in sync with the persisted preference. Cheap to re-run on every
  // mount since it's a no-op when already in sync.
  useEffect(() => {
    nativeWindColorScheme.set(themeMode);
  }, [themeMode]);

  return {
    scheme,
    isDark: scheme === 'dark',
    colors: scheme === 'dark' ? darkColors : lightColors,
    recordColors: scheme === 'dark' ? darkRecordColors : lightRecordColors,
    themeMode,
    setThemeMode: (mode: ThemeMode) => setThemeMode(mode),
  };
}
