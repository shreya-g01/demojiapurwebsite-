import { useEffect, useRef, useState } from 'react'
import { invitation } from '../config/invitation'
import { asset, cx, prefersReducedMotion } from '../lib/media'
import { diffParts, easeOutCubic, resolveTarget, ZERO, type CountdownParts } from '../lib/countdown'
import { useRevealOnce } from '../hooks/useRevealOnce'

const COUNT_MS = 1500
const STAGGER_MS = 190

function compute(): CountdownParts {
  const { target, rollForwardYearly } = invitation.countdown
  return diffParts(resolveTarget(target, rollForwardYearly))
}

/** Section 3 — live months / days / hours countdown with an eased count-up on first view. */
export function CountdownStage() {
  const { intro, heading, frame, units } = invitation.countdown
  const [live, setLive] = useState<CountdownParts>(compute)
  const [shown, setShown] = useState<CountdownParts>(ZERO)
  const { ref, isVisible } = useRevealOnce<HTMLElement>(0.34)
  const animated = useRef(false)

  useEffect(() => {
    const tick = () => setLive(compute())
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!isVisible || animated.current) return
    animated.current = true
    const end = compute()
    if (prefersReducedMotion()) {
      setShown(end)
      return
    }
    const start = performance.now()
    let raf = 0
    const frameFn = (now: number) => {
      const t = now - start
      const p = (delay: number) => easeOutCubic(Math.min(1, Math.max(0, (t - delay) / COUNT_MS)))
      setShown({
        months: Math.round(end.months * p(0)),
        days: Math.round(end.days * p(STAGGER_MS)),
        hours: Math.round(end.hours * p(STAGGER_MS * 2)),
      })
      if (t < COUNT_MS + STAGGER_MS * 2) raf = requestAnimationFrame(frameFn)
      else setShown(compute())
    }
    raf = requestAnimationFrame(frameFn)
    return () => cancelAnimationFrame(raf)
  }, [isVisible])

  useEffect(() => {
    if (animated.current) setShown(live)
  }, [live])

  const cells: Array<[number, string]> = [
    [shown.months, units.months],
    [shown.days, units.days],
    [shown.hours, units.hours],
  ]

  return (
    <section
      ref={ref}
      className={cx('invitation-stage countdown-stage motion-sequence', isVisible && 'is-visible')}
      aria-label="Countdown to the wedding"
    >
      <div className="countdown-content">
        <p className="countdown-intro motion-item" style={{ ['--motion-order' as string]: 0 }}>
          {intro}
        </p>
        <h2 className="countdown-heading motion-item motion-title" style={{ ['--motion-order' as string]: 1 }}>
          {heading}
        </h2>
        <div className="countdown-grid motion-item" style={{ ['--motion-order' as string]: 2 }} role="timer" aria-live="off">
          {cells.map(([value, unit]) => (
            <div className="countdown-frame" key={unit}>
              <img src={asset(frame)} alt="" aria-hidden="true" />
              <div className="countdown-value">
                <strong className="countdown-number">{value}</strong>
                <span className="countdown-unit">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
