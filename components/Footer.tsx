import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, AtSign } from 'lucide-react'

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
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.5rem',
          }}
        >
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
              gap: '1.5rem',
            }}
          >
            {[
              { href: '#services', label: t('links.services') },
              { href: '#about', label: t('links.about') },
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

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <ExternalLink size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <AtSign size={20} />
            </a>
          </div>
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
