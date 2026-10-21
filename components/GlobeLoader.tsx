'use client'

import dynamic from 'next/dynamic'
import { GLOBE_FRAME_CLASS, GLOBE_LABEL_MIN_HEIGHT, GLOBE_RADIUS_RATIO } from '@/components/globeFrame'

// Same box as the globe: a white disc with the border, plus the label row
function GlobePlaceholder() {
  return (
    <div className={GLOBE_FRAME_CLASS} aria-hidden="true">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
        <div style={{
          position: 'absolute',
          inset: `${(0.5 - GLOBE_RADIUS_RATIO) * 100}%`,
          borderRadius: '50%',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-border)',
        }} />
      </div>
      <div style={{ minHeight: GLOBE_LABEL_MIN_HEIGHT }} />
    </div>
  )
}

// `ssr: false` is only allowed in Client Components, so the Hero (a Server
// Component) renders this wrapper instead of calling next/dynamic itself.
const GlobeAnimation = dynamic(() => import('@/components/GlobeAnimation'), {
  ssr: false,
  loading: GlobePlaceholder,
})

export default function GlobeLoader() {
  return <GlobeAnimation />
}
