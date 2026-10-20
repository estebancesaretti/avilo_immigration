'use client'

import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Container from '@/components/Container'

const LOCALES = [
  { code: 'en', label: 'EN', available: true },
  { code: 'nl', label: 'NL', available: false },
  { code: 'fr', label: 'FR', available: false },
  { code: 'es', label: 'ES', available: false },
]

function LangSwitcher({ onSelect }: { onSelect?: () => void }) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'none',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-control)',
          padding: '0.375rem 0.625rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: 'var(--color-ink)',
          letterSpacing: '0.04em',
        }}
        aria-label="Switch language"
      >
        {locale.toUpperCase()}
        <ChevronDown
          size={13}
          style={{
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-control)',
            overflow: 'hidden',
            minWidth: '110px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 100,
          }}
        >
          {LOCALES.map(({ code, label, available }) =>
            available ? (
              <IntlLink
                key={code}
                href="/"
                locale={code}
                onClick={() => { setOpen(false); onSelect?.() }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: locale === code ? 700 : 500,
                  fontSize: '0.8125rem',
                  color: locale === code ? 'var(--color-primary)' : 'var(--color-ink)',
                  textDecoration: 'none',
                  backgroundColor: locale === code ? 'var(--color-tint)' : 'transparent',
                }}
              >
                {label}
              </IntlLink>
            ) : (
              <div
                key={code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                  cursor: 'default',
                  gap: '0.5rem',
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: 'var(--color-muted)',
                    opacity: 0.7,
                  }}
                >
                  SOON
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const t = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Absolute paths so the links also work from pages other than the homepage
  const links = [
    { href: '/#services', label: t('services') },
    { href: '/sworn-translations', label: t('swornTranslations') },
    { href: '/#contact', label: t('contact') },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-white)',
        borderBottom: scrolled
          ? '1px solid var(--color-border)'
          : '1px solid transparent',
        transition: 'border-color 0.2s',
      }}
    >
      {/* ── Main bar ── */}
      <Container
        className="grid-cols-[1fr_1fr] md:grid-cols-[1fr_auto_1fr]"
        style={{
          height: '68px',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        {/* Left — Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logos/logo-light.svg"
            alt="Avilo Immigration"
            width={80}
            height={28}
            style={{ height: 'auto' }}
            priority
          />
        </Link>

        {/* Center — nav links (desktop only) */}
        {/* No inline display — Tailwind hidden/flex owns it */}
        <nav
          className="hidden md:flex"
          style={{ gap: '2rem' }}
        >
          {links.map((link) => (
            <IntlLink
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </IntlLink>
          ))}
        </nav>

        {/* Right column */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

          {/* Desktop: CTA + lang switcher (no inline display) */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '0.75rem' }}
          >
            <LangSwitcher />
            <IntlLink
              href="/#contact"
              className="btn-primary"
              style={{
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-control)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('cta')}
            </IntlLink>
          </div>

          {/* Mobile: hamburger only (no inline display) */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-ink)',
              padding: '0.25rem',
              // cancel the padding so the icon sits on the container edge
              marginRight: '-0.25rem',
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <Container
          className="md:hidden"
          style={{
            backgroundColor: 'var(--color-white)',
            borderTop: '1px solid var(--color-border)',
            paddingBlock: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {links.map((link) => (
            <IntlLink
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </IntlLink>
          ))}

          <IntlLink
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{
              color: 'var(--color-white)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-control)',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            {t('cta')}
          </IntlLink>

          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1rem',
            }}
          >
            <LangSwitcher onSelect={() => setMenuOpen(false)} />
          </div>
        </Container>
      )}
    </header>
  )
}
