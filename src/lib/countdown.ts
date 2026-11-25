export interface CountdownParts {
  months: number
  days: number
  hours: number
}

export const ZERO: CountdownParts = { months: 0, days: 0, hours: 0 }

/** Resolve the target date, optionally rolling forward a year once it has passed. */
export function resolveTarget(iso: string, rollForward: boolean, now = new Date()): Date {
  const t = new Date(iso)
  if (Number.isNaN(t.getTime())) return now
  if (!rollForward) return t
  const next = new Date(t)
  while (next.getTime() <= now.getTime()) next.setFullYear(next.getFullYear() + 1)
  return next
}

/** Calendar months, then remaining whole days and hours (reference algorithm). */
export function diffParts(target: Date, now = new Date()): CountdownParts {
  if (target.getTime() <= now.getTime()) return ZERO
  let months = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth()
  // Anchor on the current whole hour (reference behaviour: hours round up).
  const stepped = (m: number) => new Date(now.getFullYear(), now.getMonth() + m, now.getDate(), now.getHours())
  if (stepped(months).getTime() > target.getTime()) months -= 1
  months = Math.max(0, months)
  const anchor = stepped(months)
  const rest = Math.max(0, target.getTime() - anchor.getTime())
  const days = Math.floor(rest / 86_400_000)
  const hours = Math.floor((rest % 86_400_000) / 3_600_000)
  return { months, days, hours }
}

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
