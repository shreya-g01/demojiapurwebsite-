import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../../lib/media'

/**
 * Gold foil scratch surface (canvas, destination-out brush).
 * Reference behaviour: pointer scratching with a brush of max(15px, 17% of width);
 * double-click / Enter / Space reveals instantly. We additionally auto-clear the foil
 * once ~55% is scratched so touch users get a clean finish.
 */
export function ScratchReveal({
  children,
  label,
  round = false,
  className,
}: {
  children: ReactNode
  label: string
  round?: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const strokes = useRef(0)
  const [revealed, setRevealed] = useState(false)

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    const g = ctx.createLinearGradient(0, 0, rect.width, 0)
    g.addColorStop(0, '#b78e49')
    g.addColorStop(0.2, '#e8cd88')
    g.addColorStop(0.42, '#f2dda4')
    g.addColorStop(0.62, '#d8b565')
    g.addColorStop(0.82, '#eed79a')
    g.addColorStop(1, '#bd9450')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.globalAlpha = 0.09
    ctx.fillStyle = '#fff8d4'
    for (let x = 0; x < rect.width; x += 10) ctx.fillRect(x, 0, 1, rect.height)
    ctx.globalAlpha = 1
  }, [])

  useEffect(() => {
    paint()
    const ro = new ResizeObserver(() => !revealed && paint())
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [paint, revealed])

  const clearedRatio = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return 0
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    const step = 16 // sample every 4th pixel
    for (let i = 3; i < data.length; i += step) if (data[i] === 0) clear++
    return clear / (data.length / step)
  }

  const scratch = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const dpr = canvas.width / rect.width
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr, Math.max(15, rect.width * 0.17) * dpr, 0, Math.PI * 2)
    ctx.fill()
    strokes.current++
    if (strokes.current % 6 === 0 && clearedRatio() > 0.55) setRevealed(true)
  }

  return (
    <div className={cx('scratch-reveal', round ? 'is-round' : 'is-bar', className)}>
      <div className="scratch-copy">{children}</div>
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label={`Scratch to reveal ${label}`}
        className={cx('scratch-canvas', revealed && 'is-revealed')}
        onPointerDown={(e) => {
          drawing.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          scratch(e)
        }}
        onPointerMove={scratch}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
        onDoubleClick={() => setRevealed(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setRevealed(true)
          }
        }}
      />
    </div>
  )
}
