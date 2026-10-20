import { get } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { Resend } from 'resend'
import { routing } from '@/i18n/routing'
import { escapeHtml } from '@/lib/html'
import {
  DOCUMENT_TYPES,
  EMAIL_RE,
  LANGUAGE_DIRECTIONS,
  TRANSLATIONS_EMAIL,
  UPLOAD,
  UPLOAD_PATH_RE,
  UPLOAD_PREFIX,
  formatFileSize,
  type DocumentType,
  type LanguageDirection,
} from '@/lib/sworn-translations'

type Attachment = { filename: string; content: Buffer; contentType: string }

const FROM = 'Avilo Translations <form-sender@aviloimmigration.com>'

type QuoteRequest = {
  locale: string
  requestId: string
  name: string
  email: string
  phone: string
  direction: LanguageDirection
  documentType: DocumentType
  authority: string
  deadline: string
  message: string
  consent: boolean
  byEmail: boolean
  files: { pathname: string; name: string }[]
}

const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function parse(body: Record<string, unknown>): QuoteRequest | string {
  const files = Array.isArray(body.files) ? body.files : []
  const req: QuoteRequest = {
    locale: routing.locales.includes(body.locale as never) ? (body.locale as string) : routing.defaultLocale,
    requestId: str(body.requestId, 36),
    name: str(body.name, 200),
    email: str(body.email, 320),
    // the phone widget sends just the country code when left empty
    phone: str(body.phone, 40).replace(/^\+\d{1,4}$/, ''),
    direction: body.direction as LanguageDirection,
    documentType: body.documentType as DocumentType,
    authority: str(body.authority, 300),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(str(body.deadline)) ? str(body.deadline) : '',
    message: str(body.message, 5000),
    consent: body.consent === true,
    byEmail: body.byEmail === true,
    files: files.slice(0, UPLOAD.maxFiles + 1).map((f) => ({ pathname: str(f?.pathname, 300), name: str(f?.name, 200) })),
  }

  if (!req.name) return 'Missing name.'
  if (!EMAIL_RE.test(req.email)) return 'Invalid email address.'
  if (!LANGUAGE_DIRECTIONS.includes(req.direction)) return 'Invalid language pair.'
  if (!DOCUMENT_TYPES.includes(req.documentType)) return 'Invalid document type.'
  if (!req.consent) return 'Consent is required.'
  if (req.files.length > UPLOAD.maxFiles) return 'Too many files.'
  if (!req.byEmail && req.files.length === 0) return 'At least one file is required.'
  for (const f of req.files) {
    const match = UPLOAD_PATH_RE.exec(f.pathname)
    // every file must belong to this request's folder
    if (!match || match[2] !== req.requestId) return 'Invalid file reference.'
  }
  return req
}

async function loadAttachments(files: QuoteRequest['files']) {
  const attachments: Attachment[] = []
  let total = 0
  for (const f of files) {
    const result = await get(f.pathname, { access: 'private', useCache: false })
    if (!result || result.statusCode !== 200) throw new Error(`File not found: ${f.pathname}`)
    const content = Buffer.from(await new Response(result.stream).arrayBuffer())
    const type = result.blob.contentType ?? ''
    if (!(UPLOAD.contentTypes as readonly string[]).includes(type)) throw new Error(`Unexpected file type: ${type}`)
    if (content.byteLength > UPLOAD.maxFileBytes) throw new Error('File too large.')
    total += content.byteLength
    if (total > UPLOAD.maxTotalBytes) throw new Error('Files too large in total.')
    // explicit type so mail clients preview the PDF/image instead of a generic file
    attachments.push({ filename: f.name || f.pathname.split('/').pop()!, content, contentType: type })
  }
  return { attachments, total }
}

// Same visual frame as the contact form emails.
function renderEmail(heading: string, intro: string[], rows: [string, string][], footer: string) {
  const rowHtml = rows
    .map(([label, value]) => `
      <tr><td style="padding:12px 0;border-bottom:1px solid #e3e2dd;">
        <p style="margin:0;font-size:11px;color:#5b5f69;text-transform:uppercase;letter-spacing:0.06em;font-family:Arial,sans-serif;">${escapeHtml(label)}</p>
        <p style="margin:4px 0 0;font-size:15px;color:#14161f;font-weight:600;font-family:Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(value) || '—'}</p>
      </td></tr>`)
    .join('')
  const introHtml = intro
    .map((p) => `<p style="margin:0 0 14px;font-size:15px;color:#14161f;line-height:1.6;font-family:Arial,sans-serif;">${escapeHtml(p)}</p>`)
    .join('')
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background-color:#e6e8f2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e6e8f2;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="background-color:#2f3a7a;padding:28px 40px;border-radius:12px 12px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.8);letter-spacing:0.1em;text-transform:uppercase;font-family:Arial,sans-serif;">Avilo Immigration</p>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;font-family:Arial,sans-serif;">${escapeHtml(heading)}</h1>
        </td></tr>
        <tr><td style="background-color:#ffffff;padding:32px 40px;border-radius:0 0 12px 12px;">
          ${introHtml}
          <table width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>
          <p style="margin:24px 0 0;font-size:13px;color:#5b5f69;line-height:1.6;font-family:Arial,sans-serif;white-space:pre-line;">${escapeHtml(footer)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const data = parse(body)
  if (typeof data === 'string') return NextResponse.json({ error: data }, { status: 400 })

  let attachments: Attachment[] = []
  let totalBytes = 0
  if (data.files.length > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[translations] BLOB_READ_WRITE_TOKEN is not set')
      return NextResponse.json({ error: 'File storage is not configured.' }, { status: 500 })
    }
    try {
      ;({ attachments, total: totalBytes } = await loadAttachments(data.files))
    } catch (error) {
      console.error('[translations] attachment error', error)
      return NextResponse.json({ error: 'Could not read the uploaded files.' }, { status: 400 })
    }
  }

  // Internal notification is always in English; the client's auto-reply uses their locale
  const en = await getTranslations({ locale: 'en', namespace: 'swornTranslations' })
  const t = await getTranslations({ locale: data.locale, namespace: 'swornTranslations' })
  const pair = (tr: typeof t) => {
    const [from, to] = data.direction.split('-') as ['en' | 'nl' | 'es' | 'de' | 'fr', 'en' | 'nl' | 'es' | 'de' | 'fr']
    return `${tr(`languages.${from}`)} → ${tr(`languages.${to}`)}`
  }
  const recipient = process.env.TRANSLATIONS_EMAIL || TRANSLATIONS_EMAIL
  const fileList = attachments.map((a) => `${a.filename} (${formatFileSize(a.content.byteLength)})`).join('\n')

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM,
    to: recipient,
    replyTo: data.email,
    subject: `Sworn translation quote request from ${data.name}`,
    html: renderEmail(
      'New sworn translation quote request',
      [],
      [
        [en('form.name'), data.name],
        [en('form.email'), data.email],
        [en('form.phone'), data.phone],
        [en('form.languagePair'), pair(en)],
        [en('form.documentType'), en(`documents.${data.documentType}.title`)],
        [en('form.authority'), data.authority],
        [en('form.deadline'), data.deadline],
        [en('form.message'), data.message],
        [en('form.files'), data.byEmail && attachments.length === 0 ? 'Client will send the documents by email.' : fileList],
        ['Site language', data.locale],
      ],
      `Request ID: ${data.requestId}\n` +
        (attachments.length
          ? `Files attached (${formatFileSize(totalBytes)} total). Stored privately under ${UPLOAD_PREFIX}/…/${data.requestId}/ and to be deleted six months after delivery.`
          : 'No files attached.'),
    ),
    attachments,
  })
  if (error) {
    console.error('[translations] notification failed', error)
    return NextResponse.json({ error: 'Could not send the request.' }, { status: 500 })
  }

  // The request is already delivered; a failed auto-reply shouldn't fail the form
  const { error: replyError } = await resend.emails.send({
    from: FROM,
    to: data.email,
    replyTo: recipient,
    subject: t('email.subject'),
    html: renderEmail(
      t('email.subject'),
      [t('email.greeting', { name: data.name.split(' ')[0] }), t('email.body')],
      [
        [t('form.languagePair'), pair(t)],
        [t('form.documentType'), t(`documents.${data.documentType}.title`)],
        [t('form.files'), attachments.length ? t('email.filesCount', { count: attachments.length }) : t('email.byEmail', { email: TRANSLATIONS_EMAIL })],
      ],
      `${t('email.reply')}\n\n${t('email.signoff')}\n${t('email.team')}`,
    ),
  })
  if (replyError) console.error('[translations] auto-reply failed', replyError)

  return NextResponse.json({ ok: true })
}
