import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { invitation } from '../config/invitation'
import { EventFilmStage } from './EventFilmStage'

/** Scene 6 — tall wardrobe-planner film with pulsing hotspots that open outfit cards. */
export function WardrobePlanner() {
  const { video, overlay, looks } = invitation.wardrobe
  const [open, setOpen] = useState<number | null>(null)
  const look = open === null ? null : looks[open]

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <EventFilmStage name="Wardrobe Planner" video={video} blend="soft-both" tall>
      <div className="wardrobe-layer">
        {overlay.enabled && (
          <div className="wardrobe-heading">
            <p className="eyebrow">{overlay.eyebrow}</p>
            <h2>{overlay.title}</h2>
            {overlay.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}

        {looks.map((l, i) => (
          <div className="wardrobe-spot" key={l.name} style={{ left: `${l.x}%`, top: `${l.y}%` }}>
            <button
              type="button"
              className="wardrobe-hotspot"
              onClick={() => setOpen(i)}
              aria-label={`${l.name} outfit guide`}
              aria-expanded={open === i}
            >
              <span className="wardrobe-dot" aria-hidden="true" />
            </button>
            {overlay.enabled && <span className={`wardrobe-spot-label${l.labelSide === 'left' ? ' is-left' : ''}`} aria-hidden="true">{l.name}</span>}
          </div>
        ))}

        {look && (
          <div className="wardrobe-backdrop" onClick={() => setOpen(null)}>
            <div
              role="dialog"
              aria-label={`${look.name} outfit`}
              className="wardrobe-card"
              style={{ top: `${look.y}%` }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="wardrobe-close" onClick={() => setOpen(null)} aria-label="Close" autoFocus>
                <X />
              </button>
              <h3>{look.name}</h3>
              <p className="wardrobe-date">{look.date}</p>
              <p className="wardrobe-theme">{look.theme}</p>
              <p className="wardrobe-text">{look.text}</p>
            </div>
          </div>
        )}
      </div>
    </EventFilmStage>
  )
}
