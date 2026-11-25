export interface VideoSource {
  mp4: string
  webm?: string
  poster: string
}

export interface EventOverlay {
  enabled: boolean
  /** Vertical position of the copy block, % of the 9:16 video frame. */
  top: number
  /** 'dark' = ink/gold copy for light scenes, 'light' = ivory copy for dark scenes. */
  tone: 'dark' | 'light'
  title: string
  subtitle?: string
  dateNumber: string
  dateSuffix?: string
  monthYear: string
  times: string[]
  venueLabel?: string
  venue?: string
  dressLabel?: string
  dress?: string
  note?: string
}

export interface EventScene {
  id: string
  name: string
  video: VideoSource
  /** How the top edge melts into the previous scene: standard = 104px, shallow = 32px. */
  blend: 'standard' | 'shallow'
  overlay: EventOverlay
}

export interface WardrobeLook {
  name: string
  date: string
  theme: string
  text: string
  x: number
  y: number
  /** Which side of the dot the overlay label sits on (default right). */
  labelSide?: 'left' | 'right'
}

export interface InvitationConfig {
  meta: { title: string; description: string }
  fonts: { scriptFontUrl: string; scriptFontFamily: string }
  shellBackground: { src: string; tileWidth: number; tileHeight: number }
  music: { src: string; startOffset: number; enabled: boolean }
  intro: {
    video: VideoSource
    ariaLabel: string
    scrollCueLabel: string
    overlay: {
      enabled: boolean
      appearAt: number
      monogram: string
      invocation: string
      inviteLine: string
      brideName: string
      brideParents: string[]
      joiner: string
      groomName: string
      groomParents: string[]
      venueLabel: string
      venue: string
    }
  }
  jharokha: {
    artwork: string
    artworkAlt: string
    bird: string
    heading: [string, string]
    date: { day: string; month: string; year: string }
    location: string
  }
  countdown: {
    intro: string
    heading: string
    target: string
    rollForwardYearly: boolean
    frame: string
    units: { months: string; days: string; hours: string }
  }
  events: EventScene[]
  wardrobe: {
    video: VideoSource
    overlay: { enabled: boolean; eyebrow: string; title: string; lines: string[] }
    looks: WardrobeLook[]
  }
  closing: {
    background: string
    petals: boolean
    notes: { heading: string; paragraphs: string[] }[]
    familyFrame: {
      image: string
      alt: string
      overlay: { enabled: boolean; heading: string; family: string; lines: string[]; closing: string }
    }
    venue: {
      map: string
      mapAlt: string
      mapsUrl: string
      linkLabel: string
      rsvpLabel: string
      rsvpHref: string
      credit: string
    }
  }
}
