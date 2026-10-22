'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Briefcase, Users, GraduationCap, Shield, Languages, Building2, BookOpen, Scale, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Link as IntlLink } from '@/i18n/navigation'
import Container from '@/components/Container'

// A card with `href` links to its own page; its `linkKey` labels the link.
const CARDS: { icon: typeof Briefcase; titleKey: string; descKey: string; href?: string; linkKey?: string }[] = [
  { icon: Briefcase,     titleKey: 'card1.title', descKey: 'card1.description' },
  { icon: Users,         titleKey: 'card2.title', descKey: 'card2.description' },
  { icon: GraduationCap, titleKey: 'card3.title', descKey: 'card3.description' },
  { icon: Shield,        titleKey: 'card4.title', descKey: 'card4.description' },
  { icon: Languages,     titleKey: 'card5.title', descKey: 'card5.description', href: '/sworn-translations', linkKey: 'card5.link' },
  { icon: Building2,     titleKey: 'card6.title', descKey: 'card6.description' },
  { icon: BookOpen,      titleKey: 'card7.title', descKey: 'card7.description' },
  { icon: Scale,         titleKey: 'card8.title', descKey: 'card8.description' },
]

export default function Services() {
  const t = useTranslations('services')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="services" style={{ backgroundColor: 'var(--color-white)', padding: '5rem 0' }}>
      <Container>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
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
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* ── Desktop grid ── */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {CARDS.map(({ icon: Icon, titleKey, descKey, href, linkKey }) => {
            const Card = href ? IntlLink : 'div'
            return (
            <Card
              key={titleKey}
              href={href as string}
              style={{
                backgroundColor: 'var(--color-tint)',
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: href ? 'pointer' : 'default',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 8px 24px color-mix(in srgb, var(--color-primary) 15%, transparent)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '2.5rem', height: '2.5rem',
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-control)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color="white" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--color-ink)', margin: 0,
              }}>
                {t(titleKey)}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem', lineHeight: 1.65,
                color: 'var(--color-muted)', margin: 0,
              }}>
                {t(descKey)}
              </p>
              {linkKey && (
                <span style={{
                  marginTop: 'auto',
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
                  color: 'var(--color-primary)',
                }}>
                  {t(linkKey)}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              )}
            </Card>
            )
          })}
        </div>

        {/* ── Mobile accordion ── */}
        <div className="flex flex-col md:hidden" style={{ gap: '0.875rem' }}>
          {CARDS.map(({ icon: Icon, titleKey, descKey, href, linkKey }, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={titleKey}
                style={{
                  border: '1px solid',
                  borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Row */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '1rem 1.25rem',
                    background: isOpen ? 'var(--color-tint)' : 'var(--color-white)',
                    border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '2.25rem', height: '2.25rem', flexShrink: 0,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-control)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="white" />
                  </div>
                  <span style={{
                    flex: 1,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9375rem', fontWeight: 700,
                    color: 'var(--color-ink)',
                  }}>
                    {t(titleKey)}
                  </span>
                  <ChevronDown
                    size={18}
                    color="var(--color-primary)"
                    style={{
                      flexShrink: 0,
                      transition: 'transform 0.25s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Expandable content */}
                <div style={{
                  maxHeight: isOpen ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem', lineHeight: 1.65,
                    color: 'var(--color-muted)',
                    margin: 0,
                    padding: '0.75rem 1.25rem 1.25rem',
                  }}>
                    {t(descKey)}
                  </p>
                  {href && linkKey && (
                    <IntlLink
                      href={href}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                        margin: '0 1.25rem 1.25rem',
                        fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                        color: 'var(--color-primary)', textDecoration: 'none',
                      }}
                    >
                      {t(linkKey)}
                      <ArrowRight size={15} aria-hidden="true" />
                    </IntlLink>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Catch-all box ── */}
        <Link
          href="#contact"
          style={{ textDecoration: 'none', display: 'block', marginTop: '1.5rem' }}
        >
          <div
            style={{
              border: '2px dashed var(--color-primary)',
              borderRadius: 'var(--radius-card)',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-tint)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <MessageCircle size={28} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 0.25rem',
              }}>
                Don&apos;t see your situation here?
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-muted)',
                margin: 0,
              }}>
                Reach out anyway. We&apos;ll let you know if we can help.
              </p>
            </div>
          </div>
        </Link>

      </Container>
    </section>
  )
}
