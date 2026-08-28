import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  const t = useTranslations('cta')

  return (
    <section
      style={{
        backgroundColor: 'var(--color-purple)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {t('headline')}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.85)',
            margin: 0,
          }}
        >
          {t('subtext')}
        </p>
        <Link
          href="#contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-purple)',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.9375rem',
            padding: '0.75rem 1.75rem',
            borderRadius: '0.75rem',
            textDecoration: 'none',
          }}
        >
          {t('button')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
