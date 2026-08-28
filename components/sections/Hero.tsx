import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ArcAnimation from '@/components/ArcAnimation'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: '5rem 1.5rem',
      }}
    >
      <div
        style={{ maxWidth: '1200px', margin: '0 auto' }}
        className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-8"
      >
        {/* Text side */}
        <div className="md:order-1 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Arc animation — mobile only, above eyebrow */}
          <div
            className="md:hidden justify-center"
            style={{
              backgroundColor: 'var(--color-lavender)',
              borderRadius: '1.25rem',
              padding: '1.5rem 1rem',
            }}
          >
            <ArcAnimation />
          </div>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-lavender)',
              color: 'var(--color-purple)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.375rem 0.875rem',
              borderRadius: '2rem',
              width: 'fit-content',
            }}
          >
            {t('eyebrow')}
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {t('headline')}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
              margin: 0,
              maxWidth: '480px',
            }}
          >
            {t('subheadline')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-purple)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
              }}
            >
              {t('ctaPrimary')}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
              }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Arc animation — desktop only */}
        <div
          className="hidden md:flex items-center justify-center order-1 md:order-2"
          style={{
            backgroundColor: 'var(--color-lavender)',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
          }}
        >
          <ArcAnimation />
        </div>
      </div>
    </section>
  )
}
