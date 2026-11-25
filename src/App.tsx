import { useEffect, useRef } from 'react'
import { invitation } from './config/invitation'
import { asset } from './lib/media'
import { InvitationShell } from './components/InvitationShell'
import { IntroStage } from './components/IntroStage'
import { JharokhaStage } from './components/jharokha/JharokhaStage'
import { CountdownStage } from './components/CountdownStage'
import { EventCopy, EventFilmStage } from './components/EventFilmStage'
import { WardrobePlanner } from './components/WardrobePlanner'
import { ClosingBackdrop } from './components/ClosingBackdrop'

/** Loads the licensed script font if one is configured (falls back to Pinyon Script). */
function useScriptFont() {
  useEffect(() => {
    const { scriptFontUrl, scriptFontFamily } = invitation.fonts
    document.title = invitation.meta.title
    if (!scriptFontUrl) return
    const style = document.createElement('style')
    style.textContent = `@font-face{font-family:"${scriptFontFamily}";src:url("${asset(scriptFontUrl)}");font-weight:400;font-style:normal;font-display:swap}`
    document.head.appendChild(style)
    return () => style.remove()
  }, [])
}

export default function App() {
  useScriptFont()
  const jharokhaRef = useRef<HTMLElement | null>(null)
  return (
    <InvitationShell>
      <IntroStage nextRef={jharokhaRef} />
      <JharokhaStage ref={jharokhaRef} />
      <CountdownStage />
      {invitation.events.map((e) => (
        <EventFilmStage key={e.id} name={e.name} video={e.video} blend={e.blend}>
          <EventCopy overlay={e.overlay} />
        </EventFilmStage>
      ))}
      <WardrobePlanner />
      <ClosingBackdrop />
    </InvitationShell>
  )
}
