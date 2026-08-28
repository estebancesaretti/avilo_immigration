'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import Select from 'react-select'

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
  'Visa & Permit Applications',
  'Family Reunification',
  'Integration & Settlement',
  'Asylum & Refugee Support',
  'Document Legalisation',
  'Work Authorization',
  'Student Visas',
  'Appeals & Legal Support',
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

const selectStyles = {
  control: (base: object) => ({
    ...base,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    borderColor: 'var(--color-border)',
    borderRadius: '0.625rem',
    minHeight: '46px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#7c6fcd' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    backgroundColor: state.isSelected ? '#7c6fcd' : state.isFocused ? '#f0effe' : 'white',
    color: state.isSelected ? 'white' : '#1a1a2e',
    cursor: 'pointer',
  }),
  placeholder: (base: object) => ({ ...base, color: '#9ca3af' }),
  singleValue: (base: object) => ({ ...base, color: '#1a1a2e' }),
  menu: (base: object) => ({ ...base, borderRadius: '0.625rem', zIndex: 50 }),
  input: (base: object) => ({ ...base, fontFamily: 'var(--font-body)' }),
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  color: 'var(--color-ink)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.625rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'var(--color-ink)',
  display: 'block',
  marginBottom: '0.375rem',
}

export default function Contact() {
  const t = useTranslations('contact')
  const [form, setForm] = useState<FormState>(initial)
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
        body: JSON.stringify(form),
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
    <section id="contact" style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 1.5rem', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '1rem',
            padding: '2.5rem',
            border: '1px solid var(--color-border)',
          }}
        >
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', textAlign: 'center' }}>
              <CheckCircle size={48} color="var(--color-purple)" />
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
                      style={{ width: '100%' }}
                      inputStyle={{
                        width: '100%',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        color: 'var(--color-ink)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0 0.625rem 0.625rem 0',
                        padding: '0.75rem 1rem',
                        height: 'auto',
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          border: '1px solid var(--color-border)',
                          borderRight: 'none',
                          borderRadius: '0.625rem 0 0 0.625rem',
                          padding: '0 0.625rem',
                          height: '100%',
                          backgroundColor: 'var(--color-white)',
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Nationality + Current Residence + Destination */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div style={{ flex: 1 }}>
                    <label htmlFor="nationality" style={labelStyle}>{t('labelNationality')}</label>
                    <Select
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

                {error && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: submitting ? 'var(--color-muted)' : 'var(--color-ink)',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    width: '100%',
                    transition: 'background-color 0.15s',
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
    </section>
  )
}
