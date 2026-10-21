'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { geoDistance, geoEquirectangular, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import land110m from 'world-atlas/land-110m.json'
import { GLOBE_FRAME_CLASS, GLOBE_LABEL_MIN_HEIGHT, GLOBE_RADIUS_RATIO } from '@/components/globeFrame'

type LonLat = [number, number]
type Place = { code: string; coords: LonLat }

// Destinations, shown in this order
const DESTINATIONS: Place[] = [
  { code: 'BE', coords: [4.47, 50.5] },
  { code: 'NL', coords: [5.29, 52.13] },
  { code: 'LU', coords: [6.13, 49.81] },
  { code: 'FR', coords: [2.21, 46.23] },
]

// Origins picked at random. Edit freely: ISO alpha-2 code + [lon, lat].
const ORIGINS: Place[] = [
  { code: 'MX', coords: [-102.55, 23.63] },
  { code: 'BR', coords: [-51.93, -14.24] },
  { code: 'IN', coords: [78.96, 20.59] },
  { code: 'US', coords: [-95.71, 37.09] },
  { code: 'CO', coords: [-74.3, 4.57] },
  { code: 'PH', coords: [121.77, 12.88] },
  { code: 'ZA', coords: [22.94, -30.56] },
  { code: 'JP', coords: [138.25, 36.2] },
  { code: 'TR', coords: [35.24, 38.96] },
  { code: 'CA', coords: [-106.35, 56.13] },
  { code: 'NG', coords: [8.68, 9.08] },
  { code: 'AR', coords: [-63.62, -38.42] },
]

// Timeline of one route, in ms
const CYCLE = 5000
const ROTATE_END = 1300
const ARC_IN = 1000
const FILL_START = 1300
const FILL_END = 3000
const PULSE_START = 3000
const PULSE_DURATION = 1000
const FADE_START = 4500

const ARC_SAMPLES = 70
const ARC_LIFT = 0.2
const HALF_PI = Math.PI / 2
const GEO_TIMEOUT = 1200

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const wrap180 = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180

// Land dots are computed once per page load and shared by every instance.
let landDots: LonLat[] | null = null
function getLandDots(): LonLat[] {
  if (landDots) return landDots
  const W = 720, H = 360, STEP = 2.2
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const projection = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2])
  const topo = land110m as unknown as Topology<{ land: GeometryCollection }>
  // Opaque mask only; never displayed, so its colour is irrelevant
  ctx.beginPath()
  geoPath(projection, ctx)(feature(topo, topo.objects.land))
  ctx.fill()
  const alpha = ctx.getImageData(0, 0, W, H).data

  const dots: LonLat[] = []
  for (let lat = -58; lat <= 80; lat += STEP) {
    const lonStep = STEP / Math.cos((lat * Math.PI) / 180)
    for (let lon = -180; lon < 180; lon += lonStep) {
      const [x, y] = projection([lon, lat])!
      const px = Math.min(W - 1, Math.max(0, Math.floor(x)))
      const py = Math.min(H - 1, Math.max(0, Math.floor(y)))
      if (alpha[(py * W + px) * 4 + 3] > 100) dots.push([lon, lat])
    }
  }
  landDots = dots
  return dots
}

// Flags are self-hosted in /public/flags (one SVG per country in DESTINATIONS
// and ORIGINS; add a file there when adding an origin). Each one is preloaded
// and decoded before its label fades in; its natural ratio gives the <img>
// exact width/height attributes.
const FLAG_WIDTH = 20
const FLAG_TIMEOUT = 1500
type FlagSize = { width: number; height: number } | null
const flagUrl = (code: string) => `/flags/${code.toLowerCase()}.svg`
const flagSizes = new Map<string, FlagSize>()
const flagLoads = new Map<string, Promise<void>>()

function loadFlag(code: string) {
  let load = flagLoads.get(code)
  if (!load) {
    const img = new Image()
    img.src = flagUrl(code)
    load = img
      .decode()
      .then(() => {
        flagSizes.set(code, { width: FLAG_WIDTH, height: Math.round((FLAG_WIDTH * img.naturalHeight) / img.naturalWidth) })
      })
      // a failed flag leaves just the country name
      .catch(() => { flagSizes.set(code, null) })
    flagLoads.set(code, load)
  }
  return load
}

// Resolves once both flags are ready, or after a timeout so a slow CDN never holds the label back
function loadRouteFlags(route: Route) {
  return Promise.race([
    Promise.all([loadFlag(route.origin.code), loadFlag(route.destination.code)]),
    new Promise((resolve) => setTimeout(resolve, FLAG_TIMEOUT)),
  ])
}

function randomOrigin(exclude?: string) {
  const pool = ORIGINS.filter((o) => o.code !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

function targetRotation(origin: LonLat, destination: LonLat): [number, number] {
  const [midLon, midLat] = geoInterpolate(origin, destination)(0.5)
  return [-midLon, -midLat * 0.7]
}

type Route = { origin: Place; destination: Place; fromVisitor: boolean }
// Flag sizes are captured when the label is revealed, so a flag that finishes
// loading later can never pop in while the label is showing.
type Label = { route: Route; originFlag: FlagSize; destinationFlag: FlagSize }

function Flag({ code, size }: { code: string; size: FlagSize }) {
  if (!size) return null
  return (
    // Plain <img>: tiny local SVG, already decoded; next/image adds nothing here
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(code)}
      width={size.width}
      height={size.height}
      alt=""
      style={{
        display: 'block',
        width: `${size.width}px`,
        height: 'auto',
        borderRadius: '2px',
        outline: '1px solid var(--color-border)',
        flexShrink: 0,
      }}
    />
  )
}

export default function GlobeAnimation() {
  const t = useTranslations('hero.globe')
  const locale = useLocale()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [label, setLabel] = useState<Label | null>(null)
  const [labelVisible, setLabelVisible] = useState(false)

  const regionNames = new Intl.DisplayNames([locale], { type: 'region' })

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const css = getComputedStyle(document.documentElement)
    const color = {
      primary: css.getPropertyValue('--color-primary').trim(),
      white: css.getPropertyValue('--color-white').trim(),
      border: css.getPropertyValue('--color-border').trim(),
    }
    const dots = getLandDots()
    const projection = geoOrthographic().clipAngle(90)

    let size = 0
    let current: Route | null = null
    let upcoming: Route | null = null
    let fromRot: [number, number] = [0, -20]
    let toRot: [number, number] = [0, -20]
    let rot: [number, number] = [0, -20]
    let raf = 0
    let running = false
    let cycleStart = 0
    let pausedAt = 0
    let labelShown = false
    let inView = true
    let disposed = false

    function beginRoute(next: Route) {
      current = next
      fromRot = rot
      toRot = targetRotation(next.origin.coords, next.destination.coords)

      // Pick the following route now so its flags preload during this cycle
      upcoming = {
        origin: randomOrigin(next.origin.code),
        destination: DESTINATIONS[(DESTINATIONS.indexOf(next.destination) + 1) % DESTINATIONS.length],
        fromVisitor: false,
      }
      loadRouteFlags(upcoming)

      // Swap the (hidden) label and fade it in only once this route's flags are ready
      loadRouteFlags(next).then(() => {
        if (disposed || current !== next) return
        setLabel({
          route: next,
          originFlag: flagSizes.get(next.origin.code) ?? null,
          destinationFlag: flagSizes.get(next.destination.code) ?? null,
        })
        setLabelVisible(true)
        labelShown = true
      })
    }

    function advance() {
      beginRoute(upcoming!)
    }

    function draw(elapsed: number) {
      const s = size
      if (!s) return
      const cx = s / 2, cy = s / 2, r = s * GLOBE_RADIUS_RATIO
      ctx.clearRect(0, 0, s, s)

      // Rotation: shortest path in longitude, eased
      const e = easeInOutQuad(clamp01(elapsed / ROTATE_END))
      rot = [fromRot[0] + wrap180(toRot[0] - fromRot[0]) * e, fromRot[1] + (toRot[1] - fromRot[1]) * e]
      projection.scale(r).translate([cx, cy]).rotate(rot)
      const center: LonLat = [-rot[0], -rot[1]]

      // Disc
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = color.white
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = color.border
      ctx.stroke()

      // Land dots, fainter towards the limb
      ctx.fillStyle = color.primary
      for (const dot of dots) {
        const d = geoDistance(dot, center)
        if (d >= HALF_PI) continue
        const [x, y] = projection(dot)!
        ctx.globalAlpha = 0.15 + 0.5 * Math.cos(d)
        ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8)
      }

      // Destination markers
      ctx.globalAlpha = 1
      for (const place of DESTINATIONS) {
        if (geoDistance(place.coords, center) >= HALF_PI) continue
        const [x, y] = projection(place.coords)!
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!current || elapsed < ARC_IN) return

      const fade = elapsed > FADE_START ? 1 - clamp01((elapsed - FADE_START) / (CYCLE - FADE_START)) : clamp01((elapsed - ARC_IN) / 200)
      const interpolate = geoInterpolate(current.origin.coords, current.destination.coords)
      const points: { x: number; y: number; visible: boolean }[] = []
      for (let i = 0; i < ARC_SAMPLES; i++) {
        const tt = i / (ARC_SAMPLES - 1)
        const p = interpolate(tt)
        const [x, y] = projection(p)!
        const k = 1 + ARC_LIFT * Math.sin(Math.PI * tt)
        points.push({ x: cx + (x - cx) * k, y: cy + (y - cy) * k, visible: geoDistance(p, center) < HALF_PI })
      }

      // Only draw segments whose both ends are on the visible hemisphere
      const strokeArc = (upTo: number) => {
        ctx.beginPath()
        let penDown = false
        const last = Math.floor(upTo)
        for (let i = 0; i <= last && i < points.length; i++) {
          const p = points[i]
          if (!p.visible) { penDown = false; continue }
          if (penDown) ctx.lineTo(p.x, p.y)
          else { ctx.moveTo(p.x, p.y); penDown = true }
        }
        // fractional tip between two samples
        const frac = upTo - last
        if (penDown && frac > 0 && last + 1 < points.length && points[last + 1].visible) {
          const a = points[last], b = points[last + 1]
          ctx.lineTo(a.x + (b.x - a.x) * frac, a.y + (b.y - a.y) * frac)
        }
        ctx.stroke()
      }

      ctx.strokeStyle = color.primary
      ctx.lineCap = 'round'

      // Full dashed route
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.3 * fade
      strokeArc(ARC_SAMPLES - 1)
      ctx.setLineDash([])

      // Solid fill + traveler
      const progress = easeInOutQuad(clamp01((elapsed - FILL_START) / (FILL_END - FILL_START)))
      const tip = progress * (ARC_SAMPLES - 1)
      ctx.globalAlpha = fade
      if (elapsed >= FILL_START) {
        ctx.lineWidth = 2
        strokeArc(tip)
      }

      const origin = points[0], dest = points[ARC_SAMPLES - 1]
      if (origin.visible) {
        ctx.beginPath()
        ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color.white
        ctx.fill()
        ctx.lineWidth = 2
        ctx.stroke()
      }

      if (elapsed >= FILL_START && elapsed < FILL_END) {
        const i = Math.floor(tip), f = tip - i
        const a = points[i], b = points[Math.min(i + 1, ARC_SAMPLES - 1)]
        if (a.visible) {
          const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = color.primary
          ctx.fill()
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = color.white
          ctx.fill()
        }
      }

      if (elapsed >= PULSE_START && dest.visible) {
        const pulse = (elapsed - PULSE_START) / PULSE_DURATION
        if (pulse < 1) {
          ctx.beginPath()
          ctx.arc(dest.x, dest.y, 5 + 14 * pulse, 0, Math.PI * 2)
          ctx.globalAlpha = (1 - pulse) * fade
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        ctx.globalAlpha = fade
        ctx.beginPath()
        ctx.arc(dest.x, dest.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color.primary
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function tick(now: number) {
      if (!cycleStart) cycleStart = now
      let elapsed = now - cycleStart
      if (elapsed >= CYCLE) {
        advance()
        cycleStart = now
        elapsed = 0
      }
      if (elapsed >= FADE_START && labelShown) {
        labelShown = false
        setLabelVisible(false)
      }
      draw(elapsed)
      raf = requestAnimationFrame(tick)
    }

    function start() {
      if (running || reducedMotion || !current) return
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

    function resize() {
      const next = Math.round(wrap.clientWidth)
      if (!next || next === size) return
      size = next
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // keep the current frame on screen while paused or in reduced motion
      draw(reducedMotion ? CYCLE - 1000 : running ? performance.now() - cycleStart : 0)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(wrap)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    intersectionObserver.observe(wrap)
    document.addEventListener('visibilitychange', sync)
    resize()

    // First route starts from the visitor's country when it is one of the origins
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GEO_TIMEOUT)
    fetch('/api/geo', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { country: null }))
      .catch(() => ({ country: null }))
      .then(({ country }: { country: string | null }) => {
        clearTimeout(timeout)
        if (disposed) return
        const visitor = ORIGINS.find((o) => o.code === country)
        const first: Route = {
          origin: visitor ?? randomOrigin(),
          destination: DESTINATIONS[0],
          fromVisitor: Boolean(visitor),
        }
        // Animated: the first route rotates in from the neutral starting view.
        // Reduced motion: jump straight to the route and draw one still frame.
        if (reducedMotion) rot = targetRotation(first.origin.coords, first.destination.coords)
        beginRoute(first)
        if (reducedMotion) {
          // route fully drawn, after the arrival pulse
          draw(CYCLE - 1000)
        } else {
          sync()
        }
      })

    return () => {
      disposed = true
      controller.abort()
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div className={GLOBE_FRAME_CLASS}>
      <div ref={wrapRef} style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
        <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <div
        aria-hidden="true"
        style={{
          minHeight: GLOBE_LABEL_MIN_HEIGHT,
          textAlign: 'center',
          opacity: labelVisible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
          margin: '0 0 0.25rem',
          visibility: label?.route.fromVisitor ? 'visible' : 'hidden',
        }}>
          {t('yourLocation')}
        </p>
        <p style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: '0.5rem',
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: 1.5,
          color: 'var(--color-ink)',
          margin: 0,
        }}>
          {label ? (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Flag code={label.route.origin.code} size={label.originFlag} />
                {regionNames.of(label.route.origin.code)}
              </span>
              <span>→</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Flag code={label.route.destination.code} size={label.destinationFlag} />
                {regionNames.of(label.route.destination.code)}
              </span>
            </>
          ) : ' '}
        </p>
      </div>
    </div>
  )
}
