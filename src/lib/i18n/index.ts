import type { Locale } from '@/types/i18n';
import { DEFAULT_LOCALE, LOCALE_CODES, SUPPORTED_LOCALES } from './config';
import { translations } from './translations';

export * from './config';
export * from './translations';
export * from './glossary';

const PRIMARY_DOMAIN = 'https://lic-calculators.com';

/**
 * Retrieves a translated string by dotted key path (e.g. 'home.heroTitle')
 * Falls back to English if the key is missing in the target locale.
 */
export function t(
  locale: Locale = DEFAULT_LOCALE,
  key: string,
  params: Record<string, string | number> = {}
): string {
  const activeLocale = LOCALE_CODES.includes(locale) ? locale : DEFAULT_LOCALE;
  const dict = translations[activeLocale] || translations[DEFAULT_LOCALE];
  const fallbackDict = translations[DEFAULT_LOCALE];

  const keys = key.split('.');
  let current: unknown = dict;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      current = undefined;
      break;
    }
  }

  // Fallback to default locale if not found in target
  if (typeof current !== 'string') {
    let fallbackCurrent: unknown = fallbackDict;
    for (const k of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === 'object' && k in (fallbackCurrent as Record<string, unknown>)) {
        fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[k];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }
    if (typeof fallbackCurrent === 'string') {
      current = fallbackCurrent;
    } else {
      return key; // return key if completely missing
    }
  }

  let result = current as string;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
  }

  return result;
}

export function getLocalizedPath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  // Handle hash fragments and query strings
  const [baseAndQuery, hash] = path.split('#');
  const [basePath, queryString] = baseAndQuery.split('?');

  const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`;

  // Remove any existing locale prefix
  const pathSegments = cleanPath.split('/').filter(Boolean);
  const firstSegment = pathSegments[0] as Locale | undefined;

  let strippedPath = cleanPath;
  if (firstSegment && LOCALE_CODES.includes(firstSegment)) {
    strippedPath = '/' + pathSegments.slice(1).join('/');
    if (strippedPath === '') strippedPath = '/';
  }

  // Preserve trailing slash if present on input and not root
  const hasTrailingSlash = cleanPath.endsWith('/') && cleanPath !== '/';
  if (hasTrailingSlash && !strippedPath.endsWith('/')) {
    strippedPath = `${strippedPath}/`;
  }

  let finalPath: string;
  if (locale === DEFAULT_LOCALE) {
    finalPath = strippedPath;
  } else {
    finalPath = `/${locale}${strippedPath === '/' ? '' : strippedPath}`;
  }

  const queryPart = queryString ? `?${queryString}` : '';
  const hashPart = hash ? `#${hash}` : '';
  return `${finalPath}${queryPart}${hashPart}`;
}

/**
 * Detects the locale from a URL pathname
 */
export function detectLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] as Locale | undefined;
  if (firstSegment && LOCALE_CODES.includes(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}

export interface HreflangEntry {
  readonly hreflang: string;
  readonly href: string;
}

/**
 * Paths whose content exists only in English (matched against the
 * de-localized path, so both `/faq/` and `/hi/faq/` match). Their localized
 * copies carry no translated body — guide detail stubs, the guides index,
 * the plans directory, FAQ, author pages, contact pages and the editorial
 * policy — so the locale copies must canonicalize to the English original,
 * stay noindexed, stay out of hreflang alternates and out of the sitemap.
 * To translate one of these pages for real: add the translations, then
 * remove its pattern here (and from the sitemap filter in astro.config.mjs).
 */
const ENGLISH_ONLY_PATH =
  /^\/(guides\/([a-z0-9-]+\/?)?|plans\/?|faq\/?|author\/[a-z0-9-]+\/?|contact\/(correction\/?)?|editorial-policy\/?)$/;

export function isEnglishOnlyPath(pathname: string): boolean {
  return ENGLISH_ONLY_PATH.test(getLocalizedPath(pathname, DEFAULT_LOCALE));
}

/**
 * For a localized copy of an English-only page, the absolute URL of the
 * English original it must canonicalize to. Returns null for English pages
 * and for genuinely translated pages (which keep their self-canonical).
 */
export function getEnglishCanonicalUrl(pathname: string): string | null {
  if (detectLocaleFromPath(pathname) === DEFAULT_LOCALE) return null;
  if (!isEnglishOnlyPath(pathname)) return null;
  const enPath = getLocalizedPath(pathname, DEFAULT_LOCALE);
  return `${PRIMARY_DOMAIN}${enPath === '/' ? '' : enPath}`;
}

/**
 * Generates valid hreflang alternate links for SEO
 */
export function getHreflangList(currentPath: string): HreflangEntry[] {
  const list: HreflangEntry[] = [];

  // English-only pages have no translated locale copies, so they are not
  // advertised as hreflang alternates: only the English original and
  // x-default are declared (for both the English and the locale URLs).
  if (isEnglishOnlyPath(currentPath)) {
    const enPath = getLocalizedPath(currentPath, DEFAULT_LOCALE);
    const enHref = `${PRIMARY_DOMAIN}${enPath === '/' ? '' : enPath}`;
    list.push({ hreflang: DEFAULT_LOCALE, href: enHref });
    list.push({ hreflang: 'x-default', href: enHref });
    return list;
  }

  for (const loc of LOCALE_CODES) {
    const locPath = getLocalizedPath(currentPath, loc);
    const locHref = `${PRIMARY_DOMAIN}${locPath === '/' ? '' : locPath}`;
    list.push({
      hreflang: loc,
      href: locHref
    });
  }

  // x-default points to default English route
  const defaultPath = getLocalizedPath(currentPath, DEFAULT_LOCALE);
  list.push({
    hreflang: 'x-default',
    href: `${PRIMARY_DOMAIN}${defaultPath === '/' ? '' : defaultPath}`
  });

  return list;
}

/**
 * Formats a monetary amount in Indian Rupees (INR) deterministically.
 */
export function formatCurrencyINR(rupees: number): string {
  return `₹${Math.round(rupees).toLocaleString('en-IN')}`;
}

/**
 * Formats date string with Intl.DateTimeFormat
 */
export function formatDate(isoDate: string, locale: Locale = DEFAULT_LOCALE): string {
  try {
    const date = new Date(isoDate);
    const localeTag = SUPPORTED_LOCALES[locale]?.code === 'en' ? 'en-IN' : `${locale}-IN`;
    return new Intl.DateTimeFormat(localeTag, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return isoDate;
  }
}
