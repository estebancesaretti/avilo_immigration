import { useTranslations } from 'next-intl'

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const

export default function HowItWorks() {
  const t = useTranslations('howItWorks')

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            color: 'var(--color-muted)',
            margin: 0,
            maxWidth: '600px',
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((key, i) => (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '0 2rem',
                position: 'relative',
              }}
            >
              {/* Left — number + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Number bubble */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '0.04em',
                  }}>
                    {t(`${key}.num`)}
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '2rem',
                    backgroundColor: 'var(--color-border)',
                    margin: '4px 0',
                  }} />
                )}
              </div>

              {/* Right — content */}
              <div style={{
                paddingBottom: i < STEPS.length - 1 ? '3rem' : '0',
                paddingTop: '0.75rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-purple)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.375rem',
                }}>
                  {t(`${key}.tagline`)}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  margin: '0 0 0.75rem',
                }}>
                  {t(`${key}.title`)}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'var(--color-muted)',
                  margin: 0,
                  maxWidth: '640px',
                }}>
                  {t(`${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
