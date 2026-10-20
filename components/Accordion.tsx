'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type Item = { id: string; title: string; content: string }

// Same look as the Services mobile accordion; one item open at a time.
export default function Accordion({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const baseId = useId()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const buttonId = `${baseId}-${item.id}-button`
        const panelId = `${baseId}-${item.id}-panel`
        return (
          <div
            key={item.id}
            style={{
              border: '1px solid',
              borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
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
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--color-ink)',
                }}>
                  {item.title}
                </span>
                <ChevronDown
                  size={18}
                  color="var(--color-primary)"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.25s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            </h3>

            {/* grid-template-rows 0fr → 1fr animates to the content's real height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem', lineHeight: 1.65,
                  color: 'var(--color-muted)',
                  margin: 0,
                  padding: '0.75rem 1.25rem 1.25rem',
                }}>
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
