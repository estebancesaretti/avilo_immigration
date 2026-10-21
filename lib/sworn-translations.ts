// Shared by the quote form (client) and the quote/upload API routes (server),
// so both validate against the same lists and limits.

export const TRANSLATIONS_EMAIL = 'translations@aviloimmigration.com'

export const REGISTER_URL = 'https://justsearch.just.fgov.be/national-registry-search/translator'
export const VTI_NUMBER = 'VTI112148467'

// Every combination between these four languages is certified, in both
// directions. This order is used for the language tags and the From/To selects.
export const LANGUAGES = ['nl', 'fr', 'en', 'es'] as const
export type LanguageCode = (typeof LANGUAGES)[number]

export const DOCUMENT_TYPES = ['civilStatus', 'courtJudgment', 'notarialDeed', 'administrativeDecision', 'police', 'other'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const UPLOAD = {
  maxFiles: 10,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  contentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  accept: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
} as const

// Files live under translations/YYYY-MM/<requestId>/ so a cleanup job can
// delete whole months once they are older than six months.
export const UPLOAD_PREFIX = 'translations'
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
export const UPLOAD_PATH_RE = new RegExp(`^${UPLOAD_PREFIX}/(\\d{4}-\\d{2})/(${UUID})/[A-Za-z0-9._-]{1,120}\\.(pdf|jpe?g|png)$`, 'i')

export function uploadMonth(date = new Date()) {
  return date.toISOString().slice(0, 7)
}

export function safeFileName(name: string) {
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'document'
  return `${base}.${ext}`
}

export function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export const EMAIL_RE =/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
