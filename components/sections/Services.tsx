import { useTranslations } from 'next-intl'
import { Briefcase, Users, GraduationCap } from 'lucide-react'

const cards = [
  { icon: Briefcase, titleKey: 'card1.title', descKey: 'card1.description' },
  { icon: Users, titleKey: 'card2.title', descKey: 'card2.description' },
  { icon: GraduationCap, titleKey: 'card3.title', descKey: 'card3.description' },
] as const

export default function Services() {
  const t = useTranslations('services')

  return (
    <section
      id="services"
      style={{
        backgroundColor: 'var(--color-white)',
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
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

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {cards.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              style={{
                backgroundColor: 'var(--color-lavender)',
                borderRadius: '0.75rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  backgroundColor: 'var(--color-purple)',
                  borderRadius: '0.625rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color="white" />
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
