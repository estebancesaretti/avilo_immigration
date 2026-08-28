import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-ink)',
        color: 'var(--color-white)',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Logo */}
          <Image
            src="/logos/logo-mono-white.svg"
            alt="Avilo Immigration"
            width={120}
            height={40}
          />

          {/* Links */}
          <nav
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem 1.5rem',
            }}
          >
            {[
              { href: '#services', label: t('links.services') },
              { href: '#contact', label: t('links.contact') },
              { href: '/privacy', label: t('links.privacy') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5rem',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
          }}
        >
          {t('copyright')}
        </div>
      </div>
    </footer>
  )
}
