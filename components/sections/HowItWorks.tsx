import { useTranslations } from 'next-intl'
import { ClipboardList, CalendarCheck, CheckCircle } from 'lucide-react'

const steps = [
  { icon: ClipboardList, num: 1, titleKey: 'step1.title', descKey: 'step1.description' },
  { icon: CalendarCheck, num: 2, titleKey: 'step2.title', descKey: 'step2.description' },
  { icon: CheckCircle, num: 3, titleKey: 'step3.title', descKey: 'step3.description' },
] as const

export default function HowItWorks() {
  const t = useTranslations('howItWorks')

  return (
    <section
      style={{
        backgroundColor: 'var(--color-white)',
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: '0 0 0.75rem',
            }}
          >
            {t('title')}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              color: 'var(--color-muted)',
              margin: 0,
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}
        >
          {steps.map(({ icon: Icon, num, titleKey, descKey }) => (
            <div
              key={num}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              {/* Step number + icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--color-purple)',
                    lineHeight: 1,
                  }}
                >
                  {num}
                </span>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'var(--color-lavender)',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color="var(--color-purple)" />
                </div>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  margin: 0,
                }}
              >
                {t(titleKey)}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  color: 'var(--color-muted)',
                  margin: 0,
                }}
              >
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
