import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Users, Heart } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 1.5rem' }}>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '5rem',
              alignItems: 'center',
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-lavender)',
                color: 'var(--color-purple)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.375rem 0.875rem',
                borderRadius: '2rem',
                width: 'fit-content',
              }}>
                About Avilo
              </span>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--color-ink)',
                margin: 0,
              }}>
                Immigration should feel manageable — not overwhelming.
              </h1>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--color-muted)',
                margin: 0,
              }}>
                Avilo was built on a simple belief: that every person navigating immigration deserves clear guidance, honest advice, and someone who actually understands their specific situation.
              </p>
            </div>

            {/* Photo */}
            <div style={{
              position: 'relative',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              aspectRatio: '4/5',
              maxHeight: '520px',
            }} className="hidden md:block">
              <Image
                src="/images/elouise.jpg"
                alt="Elouise Verheyen — Founder of Avilo Immigration"
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="50vw"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(124, 111, 205, 0.06)',
              }} />
              {/* Name card */}
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '0.875rem 1.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', margin: '0 0 0.125rem' }}>
                  Elouise Verheyen
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0 }}>
                  Founder, Avilo Immigration
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
            }}>
              Why Avilo exists
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-muted)', margin: 0 }}>
              Immigration is complicated — and many people struggle to understand what actually applies to their specific situation. After years of working with companies, clients, and universities across different immigration cases, Elouise saw the same problem repeat itself: people were either overwhelmed by bureaucracy, given fragmented information, or sold a service before anyone had taken the time to understand their situation.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-muted)', margin: 0 }}>
              Avilo was created to do things differently. We start with the person — their circumstances, their goals, and what they actually need — before anything else. Not a list of standard services. Not a generic intake form. A real assessment of the case.
            </p>
          </div>
        </section>

        {/* ── What makes Avilo different ── */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: '0 0 3rem',
              textAlign: 'center',
            }}>
              How we work
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }} className="grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: 'Understand first, propose second',
                  desc: 'We review your situation before recommending anything. If we can help, we explain exactly what that looks like and what it costs. No surprises.',
                },
                {
                  icon: Heart,
                  title: 'Personal from start to finish',
                  desc: 'Elouise is directly involved in every case. You deal with the person who knows your situation — not a different contact each time.',
                },
                {
                  icon: MapPin,
                  title: 'Honest about what we do',
                  desc: 'Where a case requires regulated legal expertise beyond our scope, we say so and involve the right specialist. We never overstate what we can do.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  <div style={{
                    width: '2.75rem', height: '2.75rem',
                    backgroundColor: 'var(--color-lavender)',
                    borderRadius: '0.625rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color="var(--color-purple)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                    {title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-muted)', margin: 0 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Where we operate ── */}
        <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
            }}>
              Where we operate
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-muted)', margin: 0 }}>
              Our primary focus is Belgium and the Netherlands, with services centered around immigration, residency, and related administrative procedures. We are a small, focused team — and we prefer it that way. It means every client gets the same level of attention, regardless of case complexity.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-muted)', margin: 0 }}>
              Avilo is a young, founder-led company. We are not a large immigration firm with dozens of case managers. We are building something intentionally smaller — where the personal approach is not a marketing line, but how things actually work.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ backgroundColor: 'var(--color-lavender)', padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
            }}>
              Ready to talk about your situation?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'var(--color-muted)', margin: 0 }}>
              Start with the contact form — we'll take it from there.
            </p>
            <Link
              href="/#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-purple)',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
              }}
            >
              Contact us
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
