'use client'

import { useEffect, useState } from 'react'

const DESTINATIONS = ['Belgium', 'Netherlands', 'Luxembourg', 'France']
const DURATION = 2600 // ms per destination

const W = 320
const H = 160
const x1 = 48
const y1 = 120
const x2 = 272
const y2 = 120
const cx = (x1 + x2) / 2
const cy = 30
const ARC = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
const ARC_LENGTH = 310 // approximate path length

export default function ArcAnimation() {
  const [destIndex, setDestIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setDestIndex((i) => (i + 1) % DESTINATIONS.length)
        setFading(false)
      }, 350)
    }, DURATION)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto', userSelect: 'none' }}>
      <style>{`
        @keyframes travel-dot {
          0%   { offset-distance: 0%;   opacity: 0; }
          6%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes fill-arc {
          0%   { stroke-dashoffset: ${ARC_LENGTH}; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse-ring {
          0%   { r: 8;  opacity: 0.5; }
          100% { r: 20; opacity: 0; }
        }
        .arc-dot {
          offset-path: path('${ARC}');
          offset-distance: 0%;
          animation: travel-dot ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .arc-fill {
          stroke-dasharray: ${ARC_LENGTH};
          stroke-dashoffset: ${ARC_LENGTH};
          animation: fill-arc ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .pulse-origin {
          animation: pulse-ring 2s ease-out infinite;
        }
        .pulse-dest {
          animation: pulse-ring 2s ease-out 1s infinite;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Dashed trail */}
        <path d={ARC} fill="none" stroke="#ddd8f7" strokeWidth="2" strokeDasharray="5 4" />

        {/* Animated arc fill */}
        <path
          className="arc-fill"
          d={ARC}
          fill="none"
          stroke="#7c6fcd"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Origin pin */}
        <circle cx={x1} cy={y1} r={8} fill="#7c6fcd" />
        <circle cx={x1} cy={y1} r={3} fill="white" />
        <circle className="pulse-origin" cx={x1} cy={y1} fill="none" stroke="#7c6fcd" strokeWidth="1.5" />

        {/* Destination pin */}
        <g style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}>
          <circle cx={x2} cy={y1} r={8} fill="#7c6fcd" />
          <circle cx={x2} cy={y1} r={3} fill="white" />
          <circle className="pulse-dest" cx={x2} cy={y1} fill="none" stroke="#7c6fcd" strokeWidth="1.5" />
        </g>

        {/* Traveling dot — CSS motion path */}
        <circle className="arc-dot" r={5} fill="#7c6fcd" stroke="white" strokeWidth="2" />

        {/* Labels */}
        <text x={x1} y={y1 + 22} textAnchor="middle" fontSize="11"
          fontFamily="var(--font-body, Arial)" fontWeight="600" fill="#1a1a2e">
          Your country
        </text>
        <text
          x={x2} y={y1 + 22} textAnchor="middle" fontSize="11"
          fontFamily="var(--font-body, Arial)" fontWeight="600" fill="#7c6fcd"
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}
        >
          {DESTINATIONS[destIndex]}
        </text>
      </svg>
    </div>
  )
}
