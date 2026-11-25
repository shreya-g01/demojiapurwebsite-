import { useEffect, useRef, useState } from 'react'

/**
 * Adds the `is-visible` state once the element scrolls into view.
 * Mirrors the reference: IntersectionObserver, fires once, bottom root margin −12%.
 */
export function useRevealOnce<T extends Element = HTMLElement>(threshold = 0.28) {
  const ref = useRef<T | null>(null)
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || isVisible) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -12%' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isVisible, threshold])

  return { ref, isVisible }
}
