/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  INVITATION CONFIG — the only file you need to edit to customise the site.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Media paths are relative to /public (e.g. "media/intro.mp4" → public/media/intro.mp4).
 *    Each slot lists the pixel size the layout was measured against. Keep the same
 *    aspect ratio and every overlay / hotspot stays aligned.
 *  • Copy fields marked PLACEHOLDER are template text. Replace them with your own.
 *  • `overlay.enabled` on the film scenes: the reference bakes its scene copy into
 *    the videos. While you use placeholder videos, the copy is rendered as live HTML
 *    on top. Once your final videos contain the text, set `enabled: false`.
 */

import type { InvitationConfig } from './types'

export const invitation: InvitationConfig = {
  meta: {
    title: 'Bride & Groom | Wedding Invitation', // PLACEHOLDER
    description: 'A handcrafted interactive wedding invitation.',
  },

  fonts: {
    // The reference uses Bickham Script Pro (a commercial font). Drop your licensed
    // file into public/fonts and set `scriptFontUrl`, e.g. "fonts/BickhamScriptPro-Regular.otf".
    // Until then the free Google font "Pinyon Script" (closest match) is used.
    scriptFontUrl: '',
    scriptFontFamily: 'Bickham Script Pro',
  },

  /** Page background behind the 540px column (tiled). Reference tile: 736×1104. */
  shellBackground: { src: 'media/shell-background.jpg', tileWidth: 736, tileHeight: 1104 },

  music: {
    src: 'media/music.mp3',
    /** Seconds into the track where playback starts and loops back to (reference: 12). */
    startOffset: 0,
    enabled: true,
  },

  // ──────────────────────────────────────────── 1. Intro film (curtain reveal)
  intro: {
    video: { mp4: 'media/intro.mp4', webm: 'media/intro.webm', poster: 'media/intro-poster.jpg' }, // 1080×1920
    ariaLabel: 'Painted wedding curtains opening to reveal the couple’s invitation',
    scrollCueLabel: 'Scroll',
    overlay: {
      enabled: true,
      /** Seconds after the video starts when the copy fades in (curtains open). */
      appearAt: 3.2,
      /** Small crest above the invocation (optional, transparent PNG/SVG). Empty string hides it. */
      monogram: 'media/monogram.png',
      invocation: '॥ Om Ganeshaye Namah ॥',
      inviteLine: 'We cordially invite you to the wedding ceremony of',
      brideName: 'Bride', // PLACEHOLDER
      brideParents: ['D/O Mrs. Mother Name & Mr. Father Name', 'GD/O Mrs. Grandmother & Mr. Grandfather'], // PLACEHOLDER
      joiner: 'and',
      groomName: 'Groom', // PLACEHOLDER
      groomParents: ['S/O Mrs. Mother Name & Mr. Father Name', 'GS/O Mrs. Grandmother & Mr. Grandfather'], // PLACEHOLDER
      venueLabel: 'Venue',
      venue: 'Surpura Bagh, Jodhpur',
    },
  },

  // ──────────────────────────────────────────── 2. Jharokha scratch card
  jharokha: {
    artwork: 'media/jharokha.jpg', // 1080×1920, scratch panel sits in the window at 51.5% height
    artworkAlt: 'Painted jharokha window with two tea cups',
    bird: 'media/bird.webp', // 420×420 animated, transparent; mirrored for the right bird
    heading: ['Scratch to reveal', 'the date & location'],
    date: { day: '21', month: '11', year: '26' },
    location: 'Surpura Bagh',
  },

  // ──────────────────────────────────────────── 3. Countdown
  countdown: {
    intro: 'Join us as we gather to celebrate love, laughter, and the beginning of a beautiful new chapter.',
    heading: 'Countdown',
    /** ISO local date-time of the wedding. Countdown is computed live from this. */
    target: '2026-11-21T00:00:00',
    /** If the date has passed, roll forward to the same date next year (reference behaviour). */
    rollForwardYearly: true,
    frame: 'media/countdown-frame.png', // 1274×1234, transparent
    units: { months: 'Month', days: 'Days', hours: 'Hours' },
  },

  // ──────────────────────────────────────────── 4. Event films (in order)
  events: [
    {
      id: 'haldi',
      name: 'Haldi',
      video: { mp4: 'media/haldi.mp4', webm: 'media/haldi.webm', poster: 'media/haldi-poster.jpg' }, // 720×1280
      blend: 'standard',
      overlay: {
        enabled: true, top: 19.8, tone: 'dark',
        title: 'Haldi', subtitle: 'Shubhaarambh',
        dateNumber: '19', dateSuffix: 'th', monthYear: 'November 2026',
        times: ['11:30 AM onwards'],
        venueLabel: 'Venue', venue: 'Village Lounge, Surpura Bagh',
        dressLabel: 'Dress Code', dress: 'Pastel Poetry',
      },
    },
    {
      id: 'ghoomar',
      name: 'Ghoomar',
      video: { mp4: 'media/ghoomar.mp4', webm: 'media/ghoomar.webm', poster: 'media/ghoomar-poster.jpg' }, // 540×960
      blend: 'standard',
      overlay: {
        enabled: true, top: 19.8, tone: 'light',
        title: 'Ghoomar Night', subtitle: 'An evening of Marwar',
        dateNumber: '19', dateSuffix: 'th', monthYear: 'November 2026',
        times: ['Time to be announced'], // PLACEHOLDER — not legible in the reference
        venueLabel: 'Venue', venue: 'Venue name', // PLACEHOLDER
        dressLabel: 'Dress Code', dress: 'Echoes of Marwar',
      },
    },
    {
      id: 'mehendi',
      name: 'Mehendi',
      video: { mp4: 'media/mehendi.mp4', webm: 'media/mehendi.webm', poster: 'media/mehendi-poster.jpg' }, // 720×1280
      blend: 'standard',
      overlay: {
        enabled: true, top: 19.8, tone: 'dark',
        title: 'Mehendi', subtitle: 'Gulabi Baug',
        dateNumber: '20', dateSuffix: 'th', monthYear: 'November 2026',
        times: ['11:00 AM onwards'],
        venueLabel: 'Venue', venue: 'Village Lounge, Surpura Bagh',
        dressLabel: 'Dress Code', dress: 'Art of Prints',
      },
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      video: { mp4: 'media/sangeet.mp4', webm: 'media/sangeet.webm', poster: 'media/sangeet-poster.jpg' }, // 720×1280
      blend: 'standard',
      overlay: {
        enabled: true, top: 19.8, tone: 'light',
        title: 'Sangeet', subtitle: 'Into the Mystic',
        dateNumber: '20', dateSuffix: 'th', monthYear: 'November 2026',
        times: ['7:00 PM onwards'],
        venueLabel: 'Venue', venue: 'Rasala Lawn, Surpura Bagh',
        dressLabel: 'Dress Code', dress: 'Glam & Couture',
      },
    },
    {
      id: 'wedding',
      name: 'Wedding',
      video: { mp4: 'media/wedding.mp4', webm: 'media/wedding.webm', poster: 'media/wedding-poster.jpg' }, // 540×960
      blend: 'shallow',
      overlay: {
        enabled: true, top: 19.8, tone: 'dark',
        title: 'Wedding', subtitle: 'The Royal Union',
        dateNumber: '21', dateSuffix: 'st', monthYear: 'November 2026',
        times: ['Varmala 8:30 PM onwards', 'Pheras 11:30 PM onwards'],
        venueLabel: 'Venue', venue: 'Jharokha Lawn, Surpura Bagh',
        note: 'Pheras at Village Lawn, Surpura Bagh',
      },
    },
  ],

  // ──────────────────────────────────────────── 5. Wardrobe planner film (6th scene)
  wardrobe: {
    video: { mp4: 'media/wardrobe.mp4', webm: 'media/wardrobe.webm', poster: 'media/wardrobe-poster.jpg' }, // 1080×2802 (540 / 1400 stage)
    overlay: {
      enabled: true,
      eyebrow: 'A suggestive',
      title: 'Style Guide',
      lines: ['To help you plan your attire and pack', 'for the occasions.'],
    },
    /** Hotspots: x / y are % of the 540×1400 stage (dot centre). */
    looks: [
      { name: 'Haldi', date: '19th November, 2026', theme: 'Pastel Poetry', text: 'Skip the yellow and embrace soft pastels. A dreamy Haldi filled with fresh colours and effortless style.', x: 18.5, y: 34.1 },
      { name: 'Ghoomar Night', date: '19th November, 2026', theme: 'Echoes of Marwar', text: 'Celebrate the evening in traditional Rajasthani wear with timeless elegance and heritage.', x: 54.3, y: 42.2 },
      { name: 'Mehendi', date: '20th November, 2026', theme: 'Art of Prints', text: 'Some colours are made to be worn together. Bring on the prints, florals and playful patterns.' /* PLACEHOLDER — reference copy truncated */, x: 34.0, y: 52.1, labelSide: 'left' },
      { name: 'Sangeet', date: '20th November, 2026', theme: 'Glam & Couture', text: 'Step into the night in glamorous, bold style with timeless elegance. Think statement silhouettes and refined details.', x: 62.8, y: 62.7 },
      { name: 'Wedding', date: '21st November, 2026', theme: 'A Royal Reflection', text: 'Dress in majestic traditional wear featuring elegant work, intricate detailing and royal charm.', x: 34.3, y: 74.1 },
    ],
  },

  // ──────────────────────────────────────────── 6. Closing
  closing: {
    background: 'media/closing-background.jpg', // 1080×1920, repeats vertically, spans full width
    petals: true,
    notes: [
      {
        heading: 'A Note on the Weather',
        paragraphs: [
          'November in Jodhpur brings warm, sunny days and pleasantly cool evenings. We recommend carrying a light shawl or jacket for the night while choosing outfits that keep you comfortable throughout the celebrations.',
          'The climb to Chokhelao is quite steep. We recommend wearing comfortable footwear and avoiding heels.',
        ],
      },
      {
        heading: 'A Note on the Wardrobe Planner',
        paragraphs: [
          'Please consider this wardrobe planner as a source of inspiration. Feel free to interpret each theme in your own unique style while keeping comfort in mind.',
          'We can’t wait to celebrate with you!',
        ],
      },
    ],
    familyFrame: {
      image: 'media/closing-frame.png', // 1080×1680
      overlay: {
        enabled: true,
        heading: 'Sharing the Joy',
        family: 'The Bride & Groom Families', // PLACEHOLDER
        lines: ['Warmly invite you to join us', 'as we celebrate the beginning of a', 'beautiful new chapter.'],
        closing: 'We look forward to your presence.',
      },
      alt: 'Sharing the joy — the families warmly invite you to join us as we celebrate the beginning of a beautiful new chapter.',
    },
    venue: {
      map: 'media/venue-map.jpg', // 1557×939
      mapAlt: 'Illustrated map to the venue',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Surpura+Bagh+Jodhpur',
      linkLabel: 'Click for Your Way to Us',
      rsvpLabel: 'RSVP- +91 00000 00000', // PLACEHOLDER
      rsvpHref: 'tel:+910000000000', // PLACEHOLDER
      credit: 'Designed by Your Studio', // PLACEHOLDER
    },
  },
}
