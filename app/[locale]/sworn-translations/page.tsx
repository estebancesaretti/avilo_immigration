import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { localizedMetadata } from '@/i18n/seo'
import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import Accordion from '@/components/Accordion'
import QuoteForm from '@/components/sworn-translations/QuoteForm'
import TranslationAnimation from '@/components/TranslationAnimation'
import { ArrowRight, BadgeCheck, Clock, ExternalLink, Gavel, Landmark, ScrollText, ShieldCheck, Stamp } from 'lucide-react'
import { LANGUAGES, REGISTER_URL, VTI_NUMBER } from '@/lib/sworn-translations'

type Props = {
  params: Promise<{ locale: string }>
}

const DOCUMENT_GROUPS = [
  { key: 'civilStatus', icon: ScrollText },
  { key: 'courtJudgment', icon: Gavel },
  { key: 'notarialDeed', icon: Stamp },
  { key: 'administrativeDecision', icon: Landmark },
  { key: 'police', icon: ShieldCheck },
] as const

const SWORN_POINTS = ['fidelity', 'certification', 'delivery', 'legalization'] as const
const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5'] as const
const FAQ = ['original', 'acceptance', 'belgianDutch', 'apostille', 'payment', 'privacy', 'otherLanguages'] as const

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
  fontWeight: 700,
  color: 'var(--color-ink)',
  margin: '0 0 2.5rem',
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '1.0625rem',
  lineHeight: 1.7,
  color: 'var(--color-muted)',
  margin: 0,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return localizedMetadata(locale, '/sworn-translations', 'swornTranslations.meta')
}

export default async function SwornTranslationsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('swornTranslations')

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((key) => ({
      '@type': 'Question',
      name: t(`faq.${key}.q`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.${key}.a`) },
    })),
  }

  return (
    <>
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
        />

        {/* ── Hero ── */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '4.5rem 0' }}>
          {/* Text left, document animation right; animation below the text on mobile */}
          <Container className="flex flex-col md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center gap-10">
            <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--color-ink)',
                margin: 0,
              }}>
                {t('hero.title')}
              </h1>
              <p style={{ ...bodyStyle, maxWidth: '600px' }}>{t('hero.sub')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a
                  href="#quote"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-control)',
                    textDecoration: 'none',
                  }}
                >
                  {t('hero.ctaQuote')}
                  <span className="cta-arrow"><ArrowRight size={16} /></span>
                </a>
                <a
                  href="#pricing"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-ink)',
                    border: '1px solid var(--color-border)',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-control)',
                    textDecoration: 'none',
                  }}
                >
                  {t('hero.ctaPricing')}
                </a>
              </div>
            </div>
            <TranslationAnimation />
          </Container>
        </section>

        {/* ── Your translator ── */}
        <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 0' }}>
          <Container className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-10 md:gap-16 items-center">
            <figure style={{ margin: 0 }}>
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 'var(--radius-card)', overflow: 'hidden', maxWidth: '320px' }}>
                <Image src="/images/elouise.jpg" alt={t('translator.photoAlt')} fill loading="eager" sizes="(min-width: 768px) 320px, 90vw" style={{ objectFit: 'cover' }} />
              </div>
              <figcaption style={{ marginTop: '1rem' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-ink)' }}>
                  Elouise Verheyen
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                  {t('translator.role', { vti: VTI_NUMBER })}
                </span>
              </figcaption>
            </figure>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '640px' }}>
              <h2 style={{ ...h2Style, margin: 0 }}>{t('translator.title')}</h2>
              <p style={bodyStyle}>{t('translator.body')}</p>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                {LANGUAGES.map((code) => (
                  <li key={code} style={{
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-badge)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1,
                    padding: '0.4375rem 0.875rem',
                  }}>
                    {t(`languages.${code}`)}
                  </li>
                ))}
              </ul>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-ink"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'underline', width: 'fit-content' }}
              >
                {t('translator.registerLink')}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </Container>
        </section>

        {/* ── Documents we translate ── */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 0' }}>
          <Container>
            <h2 style={h2Style}>{t('documents.title')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {DOCUMENT_GROUPS.map(({ key, icon: Icon }) => (
                <li key={key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '2.5rem', height: '2.5rem', flexShrink: 0,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-control)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color="white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.375rem' }}>
                      {t(`documents.${key}.title`)}
                    </h3>
                    <p style={{ ...bodyStyle, fontSize: '0.9375rem', lineHeight: 1.65 }}>{t(`documents.${key}.items`)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p style={{ ...bodyStyle, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', maxWidth: '760px' }}>
              {t('documents.uses')}
            </p>
          </Container>
        </section>

        {/* ── What makes it a sworn translation ── */}
        <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 0' }}>
          <Container>
            <h2 style={h2Style}>{t('sworn.title')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {SWORN_POINTS.map((key) => (
                <li key={key} style={{
                  display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.5rem',
                }}>
                  <BadgeCheck size={22} color="var(--color-primary)" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                  <p style={{ ...bodyStyle, fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-ink)' }}>{t(`sworn.${key}`)}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* ── How it works ── */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 0' }}>
          <Container>
            <h2 style={h2Style}>{t('steps.title')}</h2>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {STEPS.map((key, i) => (
                <li key={key} className="flex md:flex-col gap-4" style={{ alignItems: 'flex-start' }}>
                  <span style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 700,
                    color: 'white',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ ...bodyStyle, fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-ink)', paddingTop: '0.625rem' }}>
                    {t(`steps.${key}`)}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" style={{ backgroundColor: 'var(--color-tint)', padding: '5rem 0', scrollMarginTop: '68px' }}>
          <Container>
            <h2 style={h2Style}>{t('pricing.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
              <div style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-card)',
                padding: '2rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.75rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {t('pricing.price')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-ink)', fontWeight: 600 }}>
                    {t('pricing.unit')}
                  </span>
                </p>
                <p style={{ ...bodyStyle, fontSize: '0.9375rem', lineHeight: 1.65 }}>{t('pricing.minimum')}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
                <p style={{ ...bodyStyle, color: 'var(--color-ink)' }}>{t('pricing.factors')}</p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Clock size={20} color="var(--color-primary)" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <p style={{ ...bodyStyle, color: 'var(--color-ink)' }}>
                    <strong style={{ fontWeight: 700 }}>{t('pricing.turnaroundTitle')}: </strong>
                    {t('pricing.turnaround')}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ── */}
        <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 0' }}>
          <Container>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <h2 style={h2Style}>{t('faq.title')}</h2>
              <Accordion items={FAQ.map((key) => ({ id: key, title: t(`faq.${key}.q`), content: t(`faq.${key}.a`) }))} />
            </div>
          </Container>
        </section>

        {/* ── Quote request ── */}
        <section id="quote" style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 0', scrollMarginTop: '68px' }}>
          <Container>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                border: '1px solid var(--color-border)',
              }}>
                <h2 style={{ ...h2Style, margin: '0 0 0.5rem' }}>{t('form.title')}</h2>
                <p style={{ ...bodyStyle, fontSize: '0.9375rem', marginBottom: '2rem' }}>{t('form.intro')}</p>
                <QuoteForm />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
