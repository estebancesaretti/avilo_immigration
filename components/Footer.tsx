import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import Container from '@/components/Container'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-white)',
        color: 'var(--color-ink)',
        borderTop: '1px solid var(--color-border)',
        padding: '3rem 0',
      }}
    >
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', width: 'fit-content' }}>
            <Image
              src="/logos/logo-dark.svg"
              alt="Avilo Immigration"
              width={64}
              height={23}
              style={{ height: 'auto' }}
            />
          </Link>

          {/* Links: absolute paths so they also work from pages other than the homepage */}
          <nav
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem 1.5rem',
            }}
          >
            {[
              { href: '/#services', label: t('links.services') },
              { href: '/#contact', label: t('links.contact') },
              { href: '/privacy', label: t('links.privacy') },
            ].map((link) => (
              <IntlLink
                key={link.href}
                href={link.href}
                className="link-ink"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </IntlLink>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row md:justify-between gap-2"
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.5rem',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0 }}>{t('copyright')}</p>
          <p style={{ margin: 0 }}>{t('legal')}</p>
        </div>
      </Container>
    </footer>
  )
}
