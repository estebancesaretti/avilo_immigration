'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { CheckCircle, FileText, Lock, Upload, X } from 'lucide-react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Select from 'react-select'
import { inputStyle, labelStyle, phoneInputProps, selectStyles } from '@/components/formStyles'
import {
  DOCUMENT_TYPES,
  EMAIL_RE,
  LANGUAGE_DIRECTIONS,
  TRANSLATIONS_EMAIL,
  UPLOAD,
  UPLOAD_PREFIX,
  formatFileSize,
  safeFileName,
  uploadMonth,
  type DocumentType,
  type LanguageDirection,
} from '@/lib/sworn-translations'

type Status = 'idle' | 'uploading' | 'sending' | 'done'
type Lang = 'en' | 'nl' | 'es' | 'de' | 'fr'

const MB = 1024 * 1024
const LIMITS = {
  maxFiles: UPLOAD.maxFiles,
  maxFileMb: UPLOAD.maxFileBytes / MB,
  maxTotalMb: UPLOAD.maxTotalBytes / MB,
}

const initial = {
  name: '',
  email: '',
  phone: '',
  direction: '' as LanguageDirection | '',
  documentType: '' as DocumentType | '',
  authority: '',
  deadline: '',
  message: '',
  consent: false,
  byEmail: false,
}

const optionalTag = (text: string) => (
  <span style={{ fontWeight: 400, color: 'var(--color-muted)', marginLeft: '0.25rem', fontSize: '0.8125rem' }}>({text})</span>
)

export default function QuoteForm() {
  const t = useTranslations('swornTranslations')
  const locale = useLocale()
  const [form, setForm] = useState(initial)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const busy = status === 'uploading' || status === 'sending'
  const today = new Date().toISOString().slice(0, 10)

  const directionOptions = LANGUAGE_DIRECTIONS.map((d) => {
    const [from, to] = d.split('-') as [Lang, Lang]
    return { value: d, label: `${t(`languages.${from}`)} → ${t(`languages.${to}`)}` }
  })
  const documentOptions = DOCUMENT_TYPES.map((d) => ({ value: d, label: t(`documents.${d}.title`) }))

  function set<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    setError('')
    const next = [...files]
    for (const file of Array.from(list)) {
      if (!(UPLOAD.contentTypes as readonly string[]).includes(file.type)) {
        setError(t('form.errors.fileType', { name: file.name }))
        continue
      }
      if (file.size > UPLOAD.maxFileBytes) {
        setError(t('form.errors.fileSize', { name: file.name, ...LIMITS }))
        continue
      }
      if (next.length >= UPLOAD.maxFiles) {
        setError(t('form.errors.tooMany', LIMITS))
        break
      }
      if (next.reduce((sum, f) => sum + f.size, 0) + file.size > UPLOAD.maxTotalBytes) {
        setError(t('form.errors.totalSize', LIMITS))
        break
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size)) next.push(file)
    }
    setFiles(next)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!EMAIL_RE.test(form.email)) return setError(t('form.errors.invalidEmail'))
    if (files.length === 0 && !form.byEmail) return setError(t('form.errors.filesRequired'))

    const requestId = crypto.randomUUID()
    const folder = `${UPLOAD_PREFIX}/${uploadMonth()}/${requestId}`
    const uploaded: { pathname: string; name: string }[] = []

    try {
      if (files.length) {
        setStatus('uploading')
        for (const file of files) {
          const blob = await upload(`${folder}/${safeFileName(file.name)}`, file, {
            access: 'private',
            handleUploadUrl: '/api/translations/upload',
            contentType: file.type,
            multipart: file.size > 5 * MB,
          })
          uploaded.push({ pathname: blob.pathname, name: file.name })
        }
      }
    } catch {
      setStatus('idle')
      return setError(t('form.errors.upload'))
    }

    try {
      setStatus('sending')
      const res = await fetch('/api/translations/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, requestId, files: uploaded }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('idle')
      setError(t('form.errors.generic', { email: TRANSLATIONS_EMAIL }))
    }
  }

  if (status === 'done') {
    return (
      <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', textAlign: 'center' }}>
        <CheckCircle size={48} color="var(--color-primary)" />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--color-ink)', margin: 0, maxWidth: '440px' }}>
          {t('form.success')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Name */}
      <div>
        <label htmlFor="quote-name" style={labelStyle}>{t('form.name')}</label>
        <input id="quote-name" type="text" required autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} style={inputStyle} />
      </div>

      {/* Email + Phone */}
      <div className="flex flex-col md:flex-row gap-4">
        <div style={{ flex: 1 }}>
          <label htmlFor="quote-email" style={labelStyle}>{t('form.email')}</label>
          <input id="quote-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>{t('form.phone')}{optionalTag(t('form.optional'))}</label>
          <PhoneInput defaultCountry="be" value={form.phone} onChange={(phone) => set('phone', phone)} {...phoneInputProps} />
        </div>
      </div>

      {/* Language pair + Document type */}
      <div className="flex flex-col md:flex-row gap-4">
        <div style={{ flex: 1 }}>
          <label htmlFor="quote-direction" style={labelStyle}>{t('form.languagePair')}</label>
          <Select
            instanceId="quote-direction"
            inputId="quote-direction"
            options={directionOptions}
            placeholder={t('form.languagePairPlaceholder')}
            value={directionOptions.find((o) => o.value === form.direction) ?? null}
            onChange={(opt) => set('direction', opt?.value ?? '')}
            isSearchable={false}
            styles={selectStyles}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="quote-document" style={labelStyle}>{t('form.documentType')}</label>
          <Select
            instanceId="quote-document"
            inputId="quote-document"
            options={documentOptions}
            placeholder={t('form.documentTypePlaceholder')}
            value={documentOptions.find((o) => o.value === form.documentType) ?? null}
            onChange={(opt) => set('documentType', opt?.value ?? '')}
            isSearchable={false}
            styles={selectStyles}
            required
          />
        </div>
      </div>

      {/* Authority + Deadline */}
      <div className="flex flex-col md:flex-row gap-4">
        <div style={{ flex: 2 }}>
          <label htmlFor="quote-authority" style={labelStyle}>{t('form.authority')}{optionalTag(t('form.optional'))}</label>
          <input id="quote-authority" type="text" placeholder={t('form.authorityPlaceholder')} value={form.authority} onChange={(e) => set('authority', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="quote-deadline" style={labelStyle}>{t('form.deadline')}{optionalTag(t('form.optional'))}</label>
          <input id="quote-deadline" type="date" min={today} value={form.deadline} onChange={(e) => set('deadline', e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* Files */}
      <div>
        <span id="quote-files-label" style={labelStyle}>{t('form.files')}</span>
        {!form.byEmail && (
          <>
            <label
              htmlFor="quote-files"
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1.5rem 1rem',
                border: `1px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-control)',
                backgroundColor: dragging ? 'var(--color-tint)' : 'var(--color-bg)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background-color 0.15s, border-color 0.15s',
              }}
            >
              <Upload size={22} color="var(--color-primary)" aria-hidden="true" />
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                {t('form.filesButton')}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                {t('form.filesHint', LIMITS)}
              </span>
            </label>
            <input
              id="quote-files"
              ref={fileInput}
              type="file"
              multiple
              accept={UPLOAD.accept}
              aria-labelledby="quote-files-label"
              onChange={(e) => addFiles(e.target.files)}
              className="sr-only"
            />

            {files.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {files.map((file, i) => (
                  <li key={`${file.name}-${file.size}`} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-control)',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-ink)',
                  }}>
                    <FileText size={16} color="var(--color-primary)" aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <span style={{ color: 'var(--color-muted)', flexShrink: 0 }}>{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      aria-label={t('form.filesRemove', { name: file.name })}
                      disabled={busy}
                      style={{ background: 'none', border: 'none', padding: '0.125rem', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Security note */}
        <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: '0.75rem 0 0', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--color-muted)' }}>
          <Lock size={14} color="var(--color-primary)" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
          {t('form.security')}
        </p>

        {/* Email alternative */}
        <label style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', marginTop: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-ink)' }}>
          <input type="checkbox" checked={form.byEmail} onChange={(e) => set('byEmail', e.target.checked)} style={{ marginTop: '0.25rem', accentColor: 'var(--color-primary)' }} />
          <span>
            {t('form.emailInstead')}
            {form.byEmail && (
              <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                {t.rich('form.emailInsteadHint', {
                  email: TRANSLATIONS_EMAIL,
                  mail: (chunks) => <a href={`mailto:${TRANSLATIONS_EMAIL}`} className="link-ink" style={{ fontWeight: 600 }}>{chunks}</a>,
                })}
              </span>
            )}
          </span>
        </label>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="quote-message" style={labelStyle}>{t('form.message')}{optionalTag(t('form.optional'))}</label>
        <textarea id="quote-message" rows={4} placeholder={t('form.messagePlaceholder')} value={form.message} onChange={(e) => set('message', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {/* Consent */}
      <label style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--color-ink)' }}>
        <input type="checkbox" required checked={form.consent} onChange={(e) => set('consent', e.target.checked)} style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }} />
        <span>
          {t.rich('form.consent', {
            link: (chunks) => <a href="/privacy" target="_blank" rel="noopener" className="link-ink" style={{ textDecoration: 'underline' }}>{chunks}</a>,
          })}
        </span>
      </label>

      {error && (
        <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary"
        style={{
          ...(busy && { backgroundColor: 'var(--color-muted)' }),
          color: 'var(--color-white)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.9375rem',
          padding: '0.875rem',
          borderRadius: 'var(--radius-control)',
          border: 'none',
          cursor: busy ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {status === 'uploading' ? t('form.uploading') : status === 'sending' ? t('form.sending') : t('form.submit')}
      </button>
    </form>
  )
}
