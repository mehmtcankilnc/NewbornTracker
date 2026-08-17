import { useSettingsStore } from '@/stores/useSettingsStore';

import { dictionaries, getDateFnsLocale, interpolate, resolve, type Language, type TFunction } from './core';

export * from './core';

/** Reactive translation hook — re-renders whenever the language setting changes. */
export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const dictionary = dictionaries[language as Language];

  const t: TFunction = (key, params) => interpolate(resolve(dictionary, key), params);

  return { t, language, setLanguage, dateFnsLocale: getDateFnsLocale(language as Language) };
}
