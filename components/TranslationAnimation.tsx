'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { LANGUAGES, type LanguageCode } from '@/lib/sworn-translations'

type Lang = LanguageCode
// Same certified languages as the rest of the page
const LANGS: readonly Lang[] = LANGUAGES

// Shown in this order. These titles are part of the illustration, not UI copy,
// so they stay the same in every site locale.
const DOCUMENTS: Record<Lang, string>[] = [
  { nl: 'Geboorteakte', fr: 'Acte de naissance', en: 'Birth certificate', es: 'Acta de nacimiento' },
  { nl: 'Huwelijksakte', fr: 'Acte de mariage', en: 'Marriage certificate', es: 'Acta de matrimonio' },
  { nl: 'Rijbewijs', fr: 'Permis de conduire', en: 'Driving licence', es: 'Permiso de conducir' },
  { nl: 'Diploma', fr: 'Diplôme', en: 'Degree certificate', es: 'Título universitario' },
]

const LINE_LENGTHS = [180, 165, 175, 120, 170, 145, 95]

// Timeline of one cycle, in ms
const CYCLE = 5200
const FADE_IN = [0, 300] as const
const TITLE_OUT = [600, 300] as const
const ERASE_START = 600, ERASE_STAGGER = 60, ERASE_DURATION = 300
const BADGE = [1100, 450] as const
const TITLE_SWAP = 1200
const TITLE_IN = [1500, 300] as const
const DRAW_START = 1500, DRAW_STAGGER = 110, DRAW_DURATION = 380
const STAMP_RING = [2500, 700] as const
const STAMP_INNER = [3000, 300] as const
const STAMP_CHECK = [3100, 350] as const
const PULSE = [3400, 1000] as const
const FADE_OUT = [4700, 500] as const
// Reduced motion shows this moment: translated, stamped, pulse finished
const STATIC_FRAME = 4500

const BADGE_Y = 32, BADGE_SLIDE = 24

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const progress = (t: number, [start, duration]: readonly [number, number]) =>
  easeInOutQuad(Math.min(1, Math.max(0, (t - start) / duration)))

type Pair = { source: Lang; target: Lang; doc: number }

function randomPair(doc: number): Pair {
  const source = LANGS[Math.floor(Math.random() * LANGS.length)]
  const targets = LANGS.filter((l) => l !== source)
  return { source, target: targets[Math.floor(Math.random() * targets.length)], doc }
}

const FIRST: Pair = { source: 'es', target: 'nl', doc: 0 }

export default function TranslationAnimation() {
  const t = useTranslations('swornTranslations.sworn')
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<SVGTextElement>(null)
  const badgeRef = useRef<SVGGElement>(null)
  const badgeRectRef = useRef<SVGRectElement>(null)
  const sourceCodeRef = useRef<SVGTextElement>(null)
  const targetCodeRef = useRef<SVGTextElement>(null)
  const linesRef = useRef<(SVGPathElement | null)[]>([])
  const stampRef = useRef<SVGGElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const innerRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)
  const pulseRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const title = titleRef.current!
    const badge = badgeRef.current!
    const badgeRect = badgeRectRef.current!
    const sourceCode = sourceCodeRef.current!
    const targetCode = targetCodeRef.current!
    const lines = linesRef.current.filter(Boolean) as SVGPathElement[]
    const stamp = stampRef.current!
    const ring = ringRef.current!
    const inner = innerRef.current!
    const check = checkRef.current!
    const pulse = pulseRef.current!
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pair = FIRST
    let raf = 0
    let running = false
    let cycleStart = 0
    let pausedAt = 0
    let inView = true

    function setPair(next: Pair) {
      pair = next
      sourceCode.textContent = next.source.toUpperCase()
      targetCode.textContent = next.target.toUpperCase()
    }

    function draw(time: number) {
      const docTitles = DOCUMENTS[pair.doc]
      const fadeOut = 1 - progress(time, FADE_OUT)

      // Title: source → out → (swap) → target in
      title.textContent = time < TITLE_SWAP ? docTitles[pair.source] : docTitles[pair.target]
      const titleOpacity = time < TITLE_SWAP
        ? progress(time, FADE_IN) * (1 - progress(time, TITLE_OUT))
        : progress(time, TITLE_IN) * fadeOut
      title.setAttribute('opacity', titleOpacity.toFixed(3))

      // Badge: slide codes, switch to the "translated" state halfway
      badge.setAttribute('opacity', (progress(time, FADE_IN) * fadeOut).toFixed(3))
      const slide = progress(time, BADGE)
      sourceCode.setAttribute('y', String(BADGE_Y - BADGE_SLIDE * slide))
      targetCode.setAttribute('y', String(BADGE_Y + BADGE_SLIDE - BADGE_SLIDE * slide))
      const translated = time >= BADGE[0] + BADGE[1] / 2
      badgeRect.setAttribute('fill', translated ? 'var(--color-primary)' : 'var(--color-tint)')
      targetCode.setAttribute('fill', translated ? 'var(--color-white)' : 'var(--color-primary)')

      // Lines: erased bottom → top, redrawn top → bottom (dashoffset 0 = drawn, 1 = hidden)
      lines.forEach((line, i) => {
        const erase = progress(time, [ERASE_START + (lines.length - 1 - i) * ERASE_STAGGER, ERASE_DURATION])
        const redraw = progress(time, [DRAW_START + i * DRAW_STAGGER, DRAW_DURATION])
        const offset = time < DRAW_START ? erase : 1 - redraw
        line.setAttribute('stroke-dashoffset', offset.toFixed(3))
      })

      // Stamp
      stamp.setAttribute('opacity', fadeOut.toFixed(3))
      ring.setAttribute('stroke-dashoffset', (1 - progress(time, STAMP_RING)).toFixed(3))
      inner.setAttribute('opacity', progress(time, STAMP_INNER).toFixed(3))
      check.setAttribute('stroke-dashoffset', (1 - progress(time, STAMP_CHECK)).toFixed(3))
      const p = Math.min(1, Math.max(0, (time - PULSE[0]) / PULSE[1]))
      pulse.setAttribute('r', String(26 + 16 * p))
      pulse.setAttribute('opacity', time >= PULSE[0] && p < 1 ? (0.5 * (1 - p)).toFixed(3) : '0')
    }

    function tick(now: number) {
      if (!cycleStart) cycleStart = now
      let elapsed = now - cycleStart
      if (elapsed >= CYCLE) {
        setPair(randomPair((pair.doc + 1) % DOCUMENTS.length))
        cycleStart = now
        elapsed = 0
      }
      draw(elapsed)
      raf = requestAnimationFrame(tick)
    }

    function start() {
      if (running || reducedMotion) return
      running = true
      if (pausedAt) {
        cycleStart += performance.now() - pausedAt
        pausedAt = 0
      }
      raf = requestAnimationFrame(tick)
    }

    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      pausedAt = performance.now()
    }

    const sync = () => (inView && !document.hidden ? start() : stop())

    setPair(FIRST)
    if (reducedMotion) {
      draw(STATIC_FRAME)
      return
    }
    draw(0)

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div ref={rootRef} className="w-full max-w-[260px] md:max-w-[280px] mx-auto">
      <svg viewBox="0 0 260 300" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <clipPath id="translation-badge-clip">
            <rect x="182" y="20" width="40" height="24" rx="4" />
          </clipPath>
        </defs>

        {/* Document */}
        <rect x="20" y="6" width="220" height="286" rx="12" fill="var(--color-white)" stroke="var(--color-border)" strokeWidth="1" />

        {/* Language badge */}
        <g ref={badgeRef} opacity="0">
          <rect ref={badgeRectRef} x="182" y="20" width="40" height="24" rx="4" fill="var(--color-tint)" />
          <g clipPath="url(#translation-badge-clip)" fontFamily="var(--font-body)" fontSize="13" fontWeight="500" letterSpacing="1" textAnchor="middle" dominantBaseline="central">
            <text ref={sourceCodeRef} x="202" y={BADGE_Y} fill="var(--color-primary)">ES</text>
            <text ref={targetCodeRef} x="202" y={BADGE_Y + BADGE_SLIDE} fill="var(--color-primary)">NL</text>
          </g>
        </g>

        {/* Title + divider */}
        <text ref={titleRef} x="40" y="66" fontFamily="var(--font-heading)" fontSize="14" fill="var(--color-ink)" opacity="0">
          {DOCUMENTS[0].es}
        </text>
        <line x1="40" y1="80" x2="220" y2="80" stroke="var(--color-border)" strokeWidth="1" />

        {/* Text lines */}
        {LINE_LENGTHS.map((length, i) => (
          <path
            key={i}
            ref={(el) => { linesRef.current[i] = el }}
            d={`M 40 ${104 + i * 18} h ${length}`}
            stroke="var(--color-primary)"
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray="1 2"
            strokeDashoffset="0"
          />
        ))}

        {/* Stamp */}
        <g ref={stampRef} transform="translate(186 240)">
          <circle ref={pulseRef} r="26" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0" />
          {/* rotated so the ring is drawn from the top */}
          <circle ref={ringRef} r="26" fill="none" stroke="var(--color-primary)" strokeWidth="2" transform="rotate(-90)" pathLength={1} strokeDasharray="1 2" strokeDashoffset="1" />
          <circle ref={innerRef} r="20" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="2 3" opacity="0" />
          <path ref={checkRef} d="M -8 0 L -2 6 L 9 -6" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 2" strokeDashoffset="1" />
        </g>
      </svg>
      <p className="sr-only">{t('animationDescription')}</p>
    </div>
  )
}
