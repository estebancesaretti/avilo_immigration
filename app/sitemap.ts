import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, languageAlternates, localizedPath } from '@/i18n/seo'

const PAGES = [
  { path: '/', priority: 1 },
  { path: '/sworn-translations', priority: 0.9 },
  { path: '/privacy', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  )
}
