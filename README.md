# Wedding Invitation — Scroll-Film Template

A React + TypeScript + Vite rebuild of the layout, motion and interactions of a scroll-driven
illustrated wedding invitation: a 540 px phone column centred on a paper background, with
these sections in order:

1. **Intro film**: a curtain-reveal video that plays once and holds, invitation copy that fades in, and a "Scroll" cue.
2. **Jharokha scratch card**: three gold-foil coins (day / month / year) and a venue bar (canvas scratch, plus double-click / Enter / Space), two birds that fly in and land, and heart-shaped steam.
3. **Countdown**: live months / days / hours from a configured date, with an eased count-up on first view.
4. **Five event films** (Haldi, Ghoomar, Mehendi, Sangeet, Wedding). Each lazy-loads, plays from the start whenever it enters view and pauses when it leaves. The scenes' top edges melt into each other.
5. **Wardrobe planner film**: a tall 540:1400 scene with pulsing hotspots that open outfit cards (Esc / click outside closes them).
6. **Closing**: a full-width paper backdrop, falling petals, weather and wardrobe notes, a framed family note, an illustrated map linking to Google Maps, an RSVP phone link and a credit.

There's also background music with a floating play/pause toggle. It starts on the guest's first interaction, pauses when the tab is hidden, and loops from a configurable offset.

All placeholder artwork in `public/media/` is **original** and sized to match the slot it stands in for. Replace it with your own (or licensed) files.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build locally
```

Requires Node 18+.

## Customise: one file

**Everything editable is in `src/config/invitation.ts`**: names, dates, venues, event copy, outfit cards, notes, links, the RSVP number, the countdown target and every media path. The layout components never need touching.

### Media slots

Put files in `public/media/` (or anywhere under `public/`) and point the config at them.
**Keep the aspect ratio** so the overlays and hotspots stay aligned.

| Slot (config key) | Reference size | Notes |
|---|---|---|
| `shellBackground.src` | 736×1104 tile | Repeating paper texture behind the column |
| `intro.video` (mp4 + webm + poster) | 1080×1920 (9:16) | Plays once, holds the last frame. Muted. |
| `intro.overlay.monogram` | ~240×240 PNG/SVG, transparent | Optional crest above the invocation |
| `jharokha.artwork` | 1080×1920 | The window opening should frame the area around 51.5% height × 31% width (the scratch panel) |
| `jharokha.bird` | 420×420 animated WebP, transparent | Mirrored automatically for the right-hand bird |
| `countdown.frame` | 1274×1234 PNG, transparent | Ring around each number |
| `events[n].video` | 9:16 (720×1280 or 540×960) | One per event, mp4 + webm + poster |
| `wardrobe.video` | 1080×2802 (540:1400) | Hotspot `x`/`y` in `wardrobe.looks` are % of this frame |
| `closing.background` | 1080×1920 | Tiles vertically, spans the full width |
| `closing.familyFrame.image` | 1080×1680 PNG, transparent | Ornate frame for the family note |
| `closing.venue.map` | 1557×939 | Illustrated map (links to `mapsUrl`) |
| `music.src` | MP3 | Set `startOffset` to skip an intro |

### Text baked into videos vs. live text

The original design paints the scene copy (names, dates, venues) into its videos and frame images.
For a template that's awkward, so every such slot also has a live-HTML **overlay** in the config:

- `intro.overlay.enabled`
- `events[n].overlay.enabled`
- `wardrobe.overlay.enabled`
- `closing.familyFrame.overlay.enabled`

Leave these `true` while your media has no text. If your final videos or images already contain the text, set them to `false`.
For each event overlay, `top` (% of the frame) and `tone` (`dark`/`light`) let you fit the copy to your art.

### Fonts

Fonts measured on the original: **Cinzel** (details), **Cormorant Garamond** (numerals) and **Bickham Script Pro** (script).
Cinzel and Cormorant are bundled (self-hosted via `@fontsource`). Bickham Script Pro is a commercial font. If you own a licence, put the file in `public/fonts/` and set `fonts.scriptFontUrl`. Until then, Pinyon Script is used, metric-adjusted (`size-adjust: 74%`) to take up the same space.

## Project structure

```
src/
  config/invitation.ts      ← all content + media paths (edit this)
  config/types.ts           ← config schema
  components/
    InvitationShell.tsx     scroll container, music + toggle
    IntroStage.tsx          intro film, overlay copy, scroll cue
    CoverBox.tsx            keeps overlays locked to an object-fit:cover 9:16 frame
    jharokha/               scratch card, birds, steam
    CountdownStage.tsx
    EventFilmStage.tsx      lazy film scene + optional live copy
    WardrobePlanner.tsx     hotspots + outfit cards
    ClosingBackdrop.tsx     petals, notes, family frame, map, RSVP, credit
  hooks/useRevealOnce.ts    IntersectionObserver reveal (once)
  lib/countdown.ts          months/days/hours maths
  styles/tokens.css         palette, fonts, motion tokens
  styles/base.css           shell, stage, reveal system, music toggle
  styles/sections.css       per-section layout and animation
public/media/               placeholder media (replace)
```

## Behaviour details

- **Reveals:** items fade in from 14 px below with a 1.5 px blur over 0.7 s `cubic-bezier(.22,1,.36,1)`, staggered 90 ms by `--motion-order`.
- **Films:** sources are attached when a scene is within 2 screens; each film restarts when ≥8% of it is visible and pauses otherwise.
- **Scratch:** the brush radius is max(15 px, 17% of the coin). The foil clears automatically at about 55% scratched. Double-click, Enter or Space reveals instantly for keyboard users.
- **Countdown:** recalculates every minute. `rollForwardYearly` moves a past date to next year.
- **Reduced motion:** copy shows immediately, and the birds, petals and looping cues are disabled.
- **Responsive:** the 540 px column is centred on wide screens and full-bleed on phones. Stages are `100svh`, clamped to 560–960 px.

## Deploy

`npm run build` produces a static `dist/` folder with relative paths (`base: './'`), so it works on:

- **Vercel / Netlify / Cloudflare Pages:** build command `npm run build`, output `dist`.
- **GitHub Pages:** push `dist/` to a `gh-pages` branch, or use the Pages GitHub Action with `dist` as the artifact. It works from a sub-path.
- **Any static host:** upload the contents of `dist/`.

Videos: supply **both** WebM (VP9, smallest) and MP4 (H.264 for Safari/iOS), plus a poster JPG. Keep each film under ~5 MB for mobile.
