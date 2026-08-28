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
        padding: '3.5rem 1.5rem',
      }}
    >
      <div
        style={{ maxWidth: '1200px', margin: '0 auto' }}
        className="flex flex-col md:grid md:grid-cols-2 md:items-center gap-8"
      >
        {/* Text side */}
        <div className="md:order-1 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

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

          <div>
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
              <span className="cta-arrow"><ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>

        {/* Arc animation — below text on mobile, right column on desktop */}
        <div
          className="flex items-center justify-center order-2 md:order-2"
          style={{
            backgroundColor: 'var(--color-lavender)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
          }}
        >
          <ArcAnimation />
        </div>
      </div>
    </section>
  )
}
