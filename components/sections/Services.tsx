'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Briefcase, Users, GraduationCap, Shield, FileCheck, Building2, BookOpen, Scale, ChevronDown, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const CARDS = [
  { icon: Briefcase,     titleKey: 'card1.title', descKey: 'card1.description' },
  { icon: Users,         titleKey: 'card2.title', descKey: 'card2.description' },
  { icon: GraduationCap, titleKey: 'card3.title', descKey: 'card3.description' },
  { icon: Shield,        titleKey: 'card4.title', descKey: 'card4.description' },
  { icon: FileCheck,     titleKey: 'card5.title', descKey: 'card5.description' },
  { icon: Building2,     titleKey: 'card6.title', descKey: 'card6.description' },
  { icon: BookOpen,      titleKey: 'card7.title', descKey: 'card7.description' },
  { icon: Scale,         titleKey: 'card8.title', descKey: 'card8.description' },
] as const

export default function Services() {
  const t = useTranslations('services')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="services" style={{ backgroundColor: 'var(--color-white)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
          {CARDS.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              style={{
                backgroundColor: 'var(--color-lavender)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 8px 24px rgba(124,111,205,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '2.5rem', height: '2.5rem',
                backgroundColor: 'var(--color-purple)',
                borderRadius: '0.625rem',
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
            </div>
          ))}
        </div>

        {/* ── Mobile accordion ── */}
        <div className="flex flex-col md:hidden" style={{ gap: '0.875rem' }}>
          {CARDS.map(({ icon: Icon, titleKey, descKey }, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={titleKey}
                style={{
                  border: '1px solid',
                  borderColor: isOpen ? 'var(--color-purple)' : 'var(--color-border)',
                  borderRadius: '0.75rem',
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
                    background: isOpen ? 'var(--color-lavender)' : 'var(--color-white)',
                    border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '2.25rem', height: '2.25rem', flexShrink: 0,
                    backgroundColor: 'var(--color-purple)',
                    borderRadius: '0.5rem',
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
                    color="var(--color-purple)"
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
              border: '2px dashed var(--color-purple)',
              borderRadius: '0.75rem',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-lavender)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <MessageCircle size={28} color="var(--color-purple)" style={{ flexShrink: 0 }} />
            <div>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 0.25rem',
              }}>
                Don't see your situation here?
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-muted)',
                margin: 0,
              }}>
                Reach out anyway — we'll let you know if we can help.
              </p>
            </div>
          </div>
        </Link>

      </div>
    </section>
  )
}
