import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Quote } from 'lucide-react'

const avatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80',
]

export default function Testimonials() {
  const t = useTranslations('testimonials')

  const cards = [
    {
      text: t('card1.text'),
      name: t('card1.name'),
      country: t('card1.country'),
      avatar: avatars[0],
    },
    {
      text: t('card2.text'),
      name: t('card2.name'),
      country: t('card2.country'),
      avatar: avatars[1],
    },
  ]

  return (
    <section
      style={{
        backgroundColor: 'var(--color-lavender)',
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 3rem',
            textAlign: 'center',
          }}
        >
          {t('title')}
        </h2>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {cards.map((card) => (
            <div
              key={card.name}
              style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: '0.75rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Quote icon */}
              <Quote size={24} color="var(--color-purple)" />

              {/* Text */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'var(--color-ink)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {card.text}
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <Image
                    src={card.avatar}
                    alt={card.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="44px"
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--color-ink)',
                      margin: 0,
                    }}
                  >
                    {card.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-muted)',
                      margin: 0,
                    }}
                  >
                    {card.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
