import { forwardRef, useEffect, useRef } from 'react'
import { invitation } from '../../config/invitation'
import { asset, cx, prefersReducedMotion } from '../../lib/media'
import { useRevealOnce } from '../../hooks/useRevealOnce'
import { ScratchReveal } from './ScratchReveal'

const order = (n: number) => ({ ['--motion-order' as string]: n })

/** Two birds fly in from either side and land on the ledge (Web Animations API). */
function LandingBirds({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const root = ref.current
    const stage = root?.closest('.jharokha-stage')
    if (!root || !stage || prefersReducedMotion()) return
    const birds = Array.from(root.querySelectorAll<HTMLElement>('.landing-bird'))
    let started = false
    const anims: Animation[] = []
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!started) {
            started = true
            birds.forEach((bird, i) => {
              const dir = i === 0 ? -1 : 1
              anims.push(
                bird.animate(
                  [
                    { transform: `translate(${dir * root.clientWidth * 0.48}px, -90px)`, opacity: 0 },
                    { transform: `translate(${dir * root.clientWidth * 0.2}px, -42px)`, opacity: 1, offset: 0.45 },
                    { transform: 'translate(0, 0)', opacity: 1 },
                  ],
                  { duration: 3200, delay: i * 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
                ),
              )
            })
          }
          anims.forEach((a) => a.playState === 'paused' && a.play())
        } else {
          anims.forEach((a) => a.playState === 'running' && a.pause())
        }
      },
      { threshold: 0.35 },
    )
    io.observe(stage)
    return () => {
      io.disconnect()
      anims.forEach((a) => a.cancel())
    }
  }, [])
  return (
    <div ref={ref} className="jharokha-birds" aria-hidden="true">
      <div className="landing-bird is-left">
        <img src={src} alt="" decoding="async" />
      </div>
      <div className="landing-bird is-right">
        <img src={src} alt="" decoding="async" className="is-mirrored" />
      </div>
    </div>
  )
}

/** Heart-shaped steam rising from the tea cups (two looping SVG strokes). */
function HeartSteam() {
  return (
    <svg className="heart-steam" viewBox="0 0 160 110" fill="none" aria-hidden="true">
      <path className="steam steam-left" d="M80 104 C60 86 40 70 46 46 C52 26 74 28 80 46" />
      <path className="steam steam-right" d="M80 104 C100 86 120 70 114 46 C108 26 86 28 80 46" />
    </svg>
  )
}

function RevealPanel() {
  const { heading, date, location } = invitation.jharokha
  const { ref, isVisible } = useRevealOnce<HTMLElement>(0.45)
  return (
    <section ref={ref} className={cx('reveal-panel motion-sequence', isVisible && 'is-visible')}>
      <h2 className="reveal-heading motion-item" style={order(0)}>
        {heading[0]}
        <span>{heading[1]}</span>
      </h2>
      <div className="reveal-dates motion-item" style={order(1)}>
        {([['day', date.day], ['month', date.month], ['year', date.year]] as const).map(([k, v]) => (
          <ScratchReveal key={k} round label={`wedding ${k}`} className="scratch-date">
            <span className="reveal-date-number">{v}</span>
          </ScratchReveal>
        ))}
      </div>
      <div className="reveal-ornament motion-item" style={order(2)} aria-hidden="true">
        <span className="rule" />
        <span className="diamonds">◆ ◆ ◆</span>
        <span className="rule" />
      </div>
      <div className="motion-item" style={order(3)}>
        <ScratchReveal label="wedding location" className="reveal-location-bar">
          <span className="reveal-location">{location}</span>
        </ScratchReveal>
      </div>
    </section>
  )
}

/** Section 2 — jharokha window with scratch-to-reveal date & location, birds and steam. */
export const JharokhaStage = forwardRef<HTMLElement>(function JharokhaStage(_, ref) {
  const { artwork, artworkAlt, bird } = invitation.jharokha
  return (
    <section ref={ref} className="invitation-stage jharokha-stage" aria-label="Scratch to reveal wedding details">
      <img className="jharokha-media" src={asset(artwork)} alt={artworkAlt} />
      <div className="jharokha-artwork-frame">
        <LandingBirds src={asset(bird)} />
        <HeartSteam />
        <RevealPanel />
      </div>
    </section>
  )
})
