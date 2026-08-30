/**
 * Internationalization (i18n) Type Definitions
 */

export type Locale = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  isDefault: boolean;
}

export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};
