import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from './routing'

export const SITE_URL = 'https://www.aviloimmigration.com'
export const SITE_NAME = 'Avilo Immigration'

// Locale-independent fields shared by every page. Next merges metadata
// shallowly, so anything that overrides openGraph/twitter must spread these.
export const sharedOpenGraph = {
  siteName: SITE_NAME,
  type: 'website',
  images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
} satisfies NonNullable<Metadata['openGraph']>

export const sharedTwitter = {
  card: 'summary_large_image',
  images: ['/images/og-image.jpg'],
} satisfies NonNullable<Metadata['twitter']>

// With localePrefix 'as-needed' the default locale has no prefix.
export function localizedPath(locale: string, path: string = '/') {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return path === '/' ? prefix || '/' : `${prefix}${path}`
}

export function languageAlternates(path: string = '/') {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`])),
    'x-default': `${SITE_URL}${localizedPath(routing.defaultLocale, path)}`,
  }
}

// `namespace` points at a { title, description, shareDescription? } block.
// Site-wide metadata shares as the site name; page-specific metadata shares its own title.
export async function localizedMetadata(
  locale: string,
  path: string = '/',
  namespace: 'metadata' | 'swornTranslations.meta' | 'privacy.meta' = 'metadata',
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })
  const url = `${SITE_URL}${localizedPath(locale, path)}`
  const shareTitle = namespace === 'metadata' ? SITE_NAME : t('title')
  const shareDescription = t.has('shareDescription') ? t('shareDescription') : t('description')

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      ...sharedOpenGraph,
      title: shareTitle,
      description: shareDescription,
      url,
      locale,
    },
    twitter: {
      ...sharedTwitter,
      title: shareTitle,
      description: shareDescription,
    },
  }
}
