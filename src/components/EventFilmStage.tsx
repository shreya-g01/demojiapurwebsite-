import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { EventOverlay, VideoSource } from '../config/types'
import { asset, cx } from '../lib/media'
import { CoverBox } from './CoverBox'

type Blend = 'standard' | 'shallow' | 'soft-both'

/**
 * A full-height illustrated film scene.
 *  • Video sources are attached only when the scene is within ~2 screens (lazy).
 *  • The film restarts from 0 each time ≥8% of it enters the viewport and pauses when it leaves.
 *  • Its top edge is masked so it melts into the scene above.
 */
export function EventFilmStage({
  name,
  video,
  blend = 'standard',
  tall = false,
  children,
}: {
  name: string
  video: VideoSource
  blend?: Blend
  /** Tall scenes (wardrobe planner) use the media's own aspect ratio instead of 100svh. */
  tall?: boolean
  children?: ReactNode
}) {
  const stageRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = stageRef.current
    if (!el || armed) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setArmed(true)
          io.disconnect()
        }
      },
      { rootMargin: '200% 0px 200% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed])

  useEffect(() => {
    const el = stageRef.current
    const v = videoRef.current
    if (!el || !v || !armed) return
    v.load()
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          v.currentTime = 0
          v.play().catch(() => undefined)
        } else v.pause()
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed])

  return (
    <section
      ref={stageRef}
      className={cx('invitation-stage event-film-stage', `blend-${blend}`, tall && 'is-tall')}
      aria-label={`${name} celebration details`}
    >
      <video
        ref={videoRef}
        className="stage-media event-film-media"
        muted
        playsInline
        loop={false}
        preload={armed ? 'auto' : 'none'}
        poster={asset(video.poster)}
        aria-label={`Illustrated ${name} celebration setting`}
      >
        {armed && video.webm && <source src={asset(video.webm)} type="video/webm" />}
        {armed && <source src={asset(video.mp4)} type="video/mp4" />}
      </video>
      {children}
    </section>
  )
}

/** Scene copy rendered live on top of the film (for videos that don't carry baked-in text). */
export function EventCopy({ overlay }: { overlay: EventOverlay }) {
  const { ref, visible } = useInView()
  if (!overlay.enabled) return null
  return (
    <CoverBox className={cx('event-copy', `tone-${overlay.tone}`, visible && 'is-visible')}>
      <div ref={ref} className="event-copy-inner" style={{ top: `${overlay.top}%` }}>
        <h2 className="event-title">{overlay.title}</h2>
        {overlay.subtitle && (
          <p className="event-subtitle">
            <span className="rule" />
            {overlay.subtitle}
            <span className="rule" />
          </p>
        )}
        <p className="event-date">
          {overlay.dateNumber}
          {overlay.dateSuffix && <sup>{overlay.dateSuffix}</sup>}
        </p>
        <p className="event-month">{overlay.monthYear}</p>
        {overlay.times.map((t) => (
          <p className="event-time" key={t}>
            {t}
          </p>
        ))}
        {overlay.venue && (
          <>
            <p className="event-label">{overlay.venueLabel}</p>
            <p className="event-value">{overlay.venue}</p>
          </>
        )}
        {overlay.note && <p className="event-note">{overlay.note}</p>}
        {overlay.dress && (
          <>
            <p className="event-label">{overlay.dressLabel}</p>
            <p className="event-value">{overlay.dress}</p>
          </>
        )}
      </div>
    </CoverBox>
  )
}

function useInView() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}
