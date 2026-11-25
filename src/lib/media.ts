/** Resolve a /public-relative media path against Vite's base URL (works on sub-path hosting). */
export function asset(path: string): string {
  if (!path) return path
  if (/^(https?:|data:|blob:|\/\/)/.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')
