import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { invitation } from '../config/invitation'
import { asset } from '../lib/media'

/**
 * Full-viewport scroll container with the tiled paper texture, background music and
 * the floating music toggle. Music behaviour follows the reference: try to autoplay,
 * otherwise start on the first pointer/touch/key/scroll/wheel; pause when the tab is
 * hidden or blurred; resume on focus unless the guest paused it.
 */
export function InvitationShell({ children }: { children: ReactNode }) {
  const { shellBackground, music } = invitation
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !music.enabled) return
    const tryPlay = () => {
      if (userPaused.current || document.hidden || !audio.paused) return
      if (audio.currentTime < music.startOffset) audio.currentTime = music.startOffset
      audio.play().catch(() => undefined)
    }
    const unlockEvents = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'] as const
    const unlock = () => {
      tryPlay()
      if (!audio.paused) unlockEvents.forEach((e) => window.removeEventListener(e, unlock, true))
    }
    const onVisibility = () => (document.hidden ? audio.pause() : tryPlay())
    const pause = () => audio.pause()

    tryPlay()
    unlockEvents.forEach((e) => window.addEventListener(e, unlock, { capture: true, passive: true }))
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', pause)
    window.addEventListener('blur', pause)
    window.addEventListener('focus', tryPlay)
    return () => {
      unlockEvents.forEach((e) => window.removeEventListener(e, unlock, true))
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', pause)
      window.removeEventListener('blur', pause)
      window.removeEventListener('focus', tryPlay)
      audio.pause()
    }
  }, [music.enabled, music.startOffset])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      userPaused.current = false
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      userPaused.current = true
      audio.pause()
      setPlaying(false)
    }
  }

  const style = {
    '--shell-bg': `url("${asset(shellBackground.src)}")`,
    '--shell-tile': `${shellBackground.tileWidth}px ${shellBackground.tileHeight}px`,
  } as CSSProperties

  return (
    <main className="invitation-shell" style={style}>
      {music.enabled && (
        <>
          <audio
            ref={audioRef}
            src={asset(music.src)}
            preload="auto"
            onLoadedMetadata={() => {
              const a = audioRef.current
              if (a && a.currentTime < music.startOffset) a.currentTime = music.startOffset
            }}
            onEnded={() => {
              const a = audioRef.current
              if (!a) return
              a.currentTime = music.startOffset
              if (!document.hidden) a.play().catch(() => undefined)
            }}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
          <button
            type="button"
            className="music-toggle"
            onClick={toggle}
            aria-label={playing ? 'Pause invitation music' : 'Play invitation music'}
            title={playing ? 'Pause music' : 'Play music'}
          >
            {playing ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
        </>
      )}
      {children}
    </main>
  )
}
