'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Select from 'react-select'
import Container from '@/components/Container'
import { inputStyle, labelStyle, phoneInputProps, selectStyles } from '@/components/formStyles'

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Bangladesh',
  'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Cameroon',
  'China', 'Colombia', 'Congo (DRC)', 'Côte d\'Ivoire', 'Ecuador', 'Egypt',
  'Ethiopia', 'France', 'Germany', 'Ghana', 'Guinea', 'Haiti', 'India',
  'Indonesia', 'Iraq', 'Italy', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo',
  'Lebanon', 'Luxembourg', 'Mali', 'Mauritania', 'Mexico', 'Morocco',
  'Mozambique', 'Netherlands', 'Nigeria', 'Pakistan', 'Palestine',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia',
  'Senegal', 'Somalia', 'South Africa', 'Spain', 'Sudan', 'Syria',
  'Thailand', 'Tunisia', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Venezuela', 'Vietnam', 'Yemen', 'Other',
]

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c, label: c }))

const DESTINATION_OPTIONS = [
  'Belgium',
  'Netherlands',
  'Luxembourg',
  'France',
  'Other EU country',
].map((c) => ({ value: c, label: c }))

const SERVICE_OPTIONS = [
  'Residence permits',
  'Family reunification',
  'Integration support',
  'Asylum support',
  'Document legalisation',
  'Work permits',
  'Student visas',
  'Appeals',
  'Other / Not sure yet',
].map((s) => ({ value: s, label: s }))

type FormState = {
  fullName: string
  email: string
  phone: string
  nationality: string
  currentResidence: string
  destinationCountry: string
  service: string
  message: string
}

const initial: FormState = {
  fullName: '',
  email: '',
  phone: '',
  nationality: '',
  currentResidence: '',
  destinationCountry: '',
  service: '',
  message: '',
}

export default function Contact() {
  const t = useTranslations('contact')
  const [form, setForm] = useState<FormState>(initial)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(form.email)) {
      setError(t('invalidEmail'))
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent }),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm(initial)
      } else {
        setError(t('errorMessage'))
      }
    } catch {
      setError(t('errorMessage'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 0', scrollMarginTop: '80px' }}>
      <Container>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Card */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem',
              border: '1px solid var(--color-border)',
            }}
          >
            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', textAlign: 'center' }}>
                <CheckCircle size={48} color="var(--color-primary)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                  {t('successTitle')}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-muted)', margin: 0 }}>
                  {t('successMessage')}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.5rem' }}>
                    {t('title')}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-muted)', margin: 0 }}>
                    {t('subtitle')}
                  </p>
                </div>
  
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" style={labelStyle}>{t('labelName')}</label>
                    <input id="fullName" name="fullName" type="text" required placeholder="John Doe" value={form.fullName} onChange={handleChange} style={inputStyle} />
                  </div>
  
                  {/* Email + Phone */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div style={{ flex: 1 }}>
                      <label htmlFor="email" style={labelStyle}>{t('labelEmail')}</label>
                      <input id="email" name="email" type="email" required placeholder="john@example.com" value={form.email} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>
                        {t('labelPhone')}
                        <span style={{ fontWeight: 400, color: 'var(--color-muted)', marginLeft: '0.25rem', fontSize: '0.8125rem' }}>({t('optional')})</span>
                      </label>
                      <PhoneInput
                        defaultCountry="be"
                        value={form.phone}
                        onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                        {...phoneInputProps}
                      />
                    </div>
                  </div>
  
                  {/* Nationality + Current Residence + Destination */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div style={{ flex: 1 }}>
                      <label htmlFor="nationality" style={labelStyle}>{t('labelNationality')}</label>
                      <Select
                        instanceId="nationality"
                        inputId="nationality"
                        options={COUNTRY_OPTIONS}
                        placeholder={t('placeholderNationality')}
                        value={form.nationality ? { value: form.nationality, label: form.nationality } : null}
                        onChange={(opt) => setForm((prev) => ({ ...prev, nationality: opt?.value ?? '' }))}
                        isSearchable
                        required
                        styles={selectStyles}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="currentResidence" style={labelStyle}>{t('labelResidence')}</label>
                      <Select
                        instanceId="currentResidence"
                        inputId="currentResidence"
                        options={COUNTRY_OPTIONS}
                        placeholder={t('placeholderResidence')}
                        value={form.currentResidence ? { value: form.currentResidence, label: form.currentResidence } : null}
                        onChange={(opt) => setForm((prev) => ({ ...prev, currentResidence: opt?.value ?? '' }))}
                        isSearchable
                        required
                        styles={selectStyles}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="destinationCountry" style={labelStyle}>{t('labelDestination')}</label>
                      <Select
                        instanceId="destinationCountry"
                        inputId="destinationCountry"
                        options={DESTINATION_OPTIONS}
                        placeholder={t('placeholderDestination')}
                        value={form.destinationCountry ? { value: form.destinationCountry, label: form.destinationCountry } : null}
                        onChange={(opt) => setForm((prev) => ({ ...prev, destinationCountry: opt?.value ?? '' }))}
                        styles={selectStyles}
                      />
                    </div>
                  </div>
  
                  {/* Service */}
                  <div>
                    <label htmlFor="service" style={labelStyle}>{t('labelService')}</label>
                    <Select
                      instanceId="service"
                      inputId="service"
                      options={SERVICE_OPTIONS}
                      placeholder={t('placeholderService')}
                      value={form.service ? { value: form.service, label: form.service } : null}
                      onChange={(opt) => setForm((prev) => ({ ...prev, service: opt?.value ?? '' }))}
                      styles={selectStyles}
                    />
                  </div>
  
                  {/* Message */}
                  <div>
                    <label htmlFor="message" style={labelStyle}>{t('labelMessage')}</label>
                    <textarea id="message" name="message" required rows={4} placeholder={t('placeholderMessage')} value={form.message} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>

                  {/* Consent (required) */}
                  <label style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--color-ink)' }}>
                    <input type="checkbox" name="consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }} />
                    <span>
                      {t.rich('consent', {
                        // new tab so a half-filled form isn't lost
                        link: (chunks) => <a href="/privacy" target="_blank" rel="noopener" className="link-ink" style={{ textDecoration: 'underline' }}>{chunks}</a>,
                      })}
                    </span>
                  </label>

                  {error && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
                      {error}
                    </p>
                  )}
  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      ...(submitting && { backgroundColor: 'var(--color-muted)' }),
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      padding: '0.875rem',
                      borderRadius: 'var(--radius-control)',
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      width: '100%',
                    }}
                  >
                    {submitting ? t('sending') : t('submit')}
                  </button>
                </form>
              </>
            )}
          </div>
  
          {/* Direct email note */}
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '1.5rem' }}>
            {t('directEmail')}{' '}
            <a href="mailto:info@aviloimmigration.com" style={{ color: 'var(--color-ink)', fontWeight: 600, textDecoration: 'none' }}>
              info@aviloimmigration.com
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
