import type { CSSProperties } from 'react'
import { MapPin } from 'lucide-react'
import { invitation } from '../config/invitation'
import { asset, cx } from '../lib/media'
import { useRevealOnce } from '../hooks/useRevealOnce'

const order = (n: number) => ({ ['--motion-order' as string]: n }) as CSSProperties

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  s: `${9 + ((i * 5) % 7)}px`,
  d: `${9 + ((i * 3) % 6)}s`,
  delay: `${-((i * 1.7) % 12)}s`,
  sway: `${i % 2 ? 28 : -24}px`,
}))

function PetalShower() {
  return (
    <div className="petal-shower" aria-hidden="true">
      <div className="petal-sticky">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{ left: p.left, '--s': p.s, '--d': p.d, '--delay': p.delay, '--sway': p.sway } as CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}

function WardrobeNotes() {
  const { notes } = invitation.closing
  const { ref, isVisible } = useRevealOnce<HTMLElement>(0.2)
  return (
    <section ref={ref} aria-label="Notes on the weather and wardrobe" className={cx('wardrobe-notes motion-sequence', isVisible && 'is-visible')}>
      {notes.map((n, i) => (
        <article className="motion-item" style={order(i)} key={n.heading}>
          <h3>{n.heading}</h3>
          {n.paragraphs.map((p, j) => (
            <p key={j} className={j ? (i === notes.length - 1 ? 'mt-5' : 'mt-4') : undefined}>
              {p}
            </p>
          ))}
        </article>
      ))}
    </section>
  )
}

function FamilyClosing() {
  const { image, alt, overlay } = invitation.closing.familyFrame
  const { ref, isVisible } = useRevealOnce<HTMLElement>(0.2)
  return (
    <section ref={ref} aria-label={overlay.heading} className={cx('family-closing motion-sequence', isVisible && 'is-visible')}>
      <div className="family-closing-frame motion-item" style={order(0)}>
        <img src={asset(image)} alt={overlay.enabled ? '' : alt} loading="lazy" decoding="async" />
        {overlay.enabled && (
          <div className="family-closing-copy">
            <h2>{overlay.heading}</h2>
            <p className="family">{overlay.family}</p>
            <p className="lines">
              {overlay.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
            <p className="close">{overlay.closing}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function VenueMap() {
  const v = invitation.closing.venue
  const { ref, isVisible } = useRevealOnce<HTMLElement>(0.2)
  return (
    <section ref={ref} aria-label="Directions to the venue" className={cx('venue-map motion-sequence', isVisible && 'is-visible')}>
      <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="venue-map-artwork motion-item" aria-label={`${v.mapAlt} — open in Google Maps`}>
        <img src={asset(v.map)} alt={v.mapAlt} loading="lazy" decoding="async" />
      </a>
      <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="venue-map-link motion-item">
        <MapPin aria-hidden="true" />
        {v.linkLabel}
      </a>
      <a href={v.rsvpHref} className="venue-map-rsvp motion-item">
        {v.rsvpLabel}
      </a>
      <p className="invitation-credit motion-item">{v.credit}</p>
    </section>
  )
}

/** Closing — full-width paper backdrop, falling petals, notes, family frame, map, RSVP. */
export function ClosingBackdrop() {
  const { background, petals } = invitation.closing
  return (
    <div className="closing-backdrop" style={{ backgroundImage: `url("${asset(background)}")` }}>
      {petals && <PetalShower />}
      <WardrobeNotes />
      <FamilyClosing />
      <VenueMap />
    </div>
  )
}
