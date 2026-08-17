import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { syncWidget } from '@/widgets/syncWidget';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'tr' | 'en';

interface SettingsState {
  themeMode: ThemeMode;
  language: Language;
  notificationsEnabled: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      language: 'tr',
      notificationsEnabled: true,

      setThemeMode: (themeMode) => {
        set({ themeMode });
        syncWidget();
      },

      setLanguage: (language) => {
        set({ language });
        syncWidget();
      },

      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: 'bebektakibi-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
