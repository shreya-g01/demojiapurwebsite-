import { useEffect, useRef, useState, type RefObject } from 'react'
import { ChevronDown } from 'lucide-react'
import { invitation } from '../config/invitation'
import { asset, cx, prefersReducedMotion } from '../lib/media'
import { CoverBox } from './CoverBox'

/** Vertical centre of a line, as % of the 9:16 video frame (measured on the reference). */
const y = (pct: number) => ({ ['--y' as string]: `${pct}%` })

/** Section 1 — full-height intro film (curtains open once, holds the last frame) + scroll cue. */
export function IntroStage({ nextRef }: { nextRef: RefObject<HTMLElement | null> }) {
  const { video, ariaLabel, scrollCueLabel, overlay } = invitation.intro
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showCopy, setShowCopy] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (!overlay.enabled || showCopy) return
    const v = videoRef.current
    const reveal = () => setShowCopy(true)
    const onTime = () => v && v.currentTime >= overlay.appearAt && reveal()
    v?.addEventListener('timeupdate', onTime)
    v?.addEventListener('ended', reveal)
    // Fallback if autoplay is blocked (e.g. iOS low-power mode).
    const t = window.setTimeout(reveal, (overlay.appearAt + 1.5) * 1000)
    return () => {
      v?.removeEventListener('timeupdate', onTime)
      v?.removeEventListener('ended', reveal)
      window.clearTimeout(t)
    }
  }, [overlay.enabled, overlay.appearAt, showCopy])

  const scrollNext = () =>
    nextRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'start' })

  return (
    <section className="invitation-stage intro-stage" aria-label="Wedding invitation">
      <video
        ref={videoRef}
        className="stage-media"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={asset(video.poster)}
        aria-label={ariaLabel}
      >
        {video.webm && <source src={asset(video.webm)} type="video/webm" />}
        <source src={asset(video.mp4)} type="video/mp4" />
      </video>

      {overlay.enabled && (
        <CoverBox className={cx('intro-copy', showCopy && 'is-shown')}>
          {overlay.monogram && (
            <div className="at intro-monogram" style={y(12.4)}>
              <img src={asset(overlay.monogram)} alt="" />
            </div>
          )}
          <p className="at intro-invocation" style={y(15.2)}>{overlay.invocation}</p>
          <p className="at intro-invite" style={y(19)}>{overlay.inviteLine}</p>
          <h1 className="intro-names">
            <span className="at intro-name" style={y(25.6)}>{overlay.brideName}</span>
            <span className="at intro-parents" style={y(31.9)}>
              {overlay.brideParents.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className="at intro-joiner" style={y(36.3)}>{overlay.joiner}</span>
            <span className="at intro-name" style={y(41.7)}>{overlay.groomName}</span>
            <span className="at intro-parents" style={y(47)}>
              {overlay.groomParents.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </h1>
          <p className="at intro-venue-label" style={y(51.7)}>{overlay.venueLabel}</p>
          <p className="at intro-venue" style={y(53.5)}>{overlay.venue}</p>
        </CoverBox>
      )}

      <button type="button" className="scroll-cue" aria-label="Scroll down to reveal wedding details" onClick={scrollNext}>
        <span className="scroll-cue-label">{scrollCueLabel}</span>
        <span className="scroll-cue-arrow" aria-hidden="true">
          <ChevronDown size={17} strokeWidth={2.4} />
        </span>
      </button>
    </section>
  )
}
