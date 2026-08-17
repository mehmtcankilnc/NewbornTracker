import { enUS, tr as trLocale } from 'date-fns/locale';

import { en, tr, type Translations } from './translations';

export type Language = 'tr' | 'en';
export type { Translations };

export const dictionaries: Record<Language, Translations> = { tr, en };

type PathsOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : PathsOf<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = PathsOf<Translations>;

export function resolve(dictionary: Translations, path: string): string {
  const value = path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dictionary);

  return typeof value === 'string' ? value : path;
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in params ? String(params[key]) : match
  );
}

export type TFunction = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function getDateFnsLocale(language: Language) {
  return language === 'en' ? enUS : trLocale;
}
