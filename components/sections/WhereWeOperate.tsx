import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Globe } from 'lucide-react'

const countries = [
  { key: 'be', flagUrl: 'https://flagcdn.com/w80/be.png' },
  { key: 'nl', flagUrl: 'https://flagcdn.com/w80/nl.png' },
  { key: 'lu', flagUrl: 'https://flagcdn.com/w80/lu.png' },
  { key: 'fr', flagUrl: 'https://flagcdn.com/w80/fr.png' },
] as const

export default function WhereWeOperate() {
  const t = useTranslations('whereWeOperate')

  return (
    <section
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: '5rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
          }}
        >
          <Globe size={28} color="var(--color-purple)" />
          {t('title')}
        </h2>

        {/* Country items */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {countries.map(({ key, flagUrl }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '54px',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                }}
              >
                <Image
                  src={flagUrl}
                  alt={t(`countries.${key}`)}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="80px"
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  color: 'var(--color-ink)',
                }}
              >
                {t(`countries.${key}`)}
              </span>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--color-muted)',
            margin: 0,
          }}
        >
          {t('caption')}
        </p>
      </div>
    </section>
  )
}
