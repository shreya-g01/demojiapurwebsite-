import type { ReactNode } from 'react'
import { cx } from '../lib/media'

/**
 * A box laid out exactly like an `object-fit: cover` 9:16 video inside its stage.
 * Anything positioned inside it in % stays locked to the video frame at every screen
 * size — this is how overlay copy and hotspots stay aligned with the artwork.
 */
export function CoverBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="cover-box-wrap">
      <div className={cx('cover-box', className)}>{children}</div>
    </div>
  )
}
