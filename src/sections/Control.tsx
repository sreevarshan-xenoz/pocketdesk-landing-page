import { useRef, useState } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'
import { useInView } from '../hooks/useInView'
import { cx } from '../lib/cx'
import { KeyboardStage } from './control/KeyboardStage'
import { PenStage } from './control/PenStage'
import { TrackpadStage } from './control/TrackpadStage'
import s from './Control.module.css'

type Mode = 'trackpad' | 'keyboard' | 'pen'

const MODES: Array<{ id: Mode; label: string; icon: IconName; hint: string }> = [
  { id: 'trackpad', label: 'Trackpad', icon: 'trackpad', hint: 'Drag on the phone to move the pointer, and tap to click a window.' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keyboard', hint: 'Type on the phone, or click it and use your own keyboard. Try help.' },
  { id: 'pen', label: 'Pen', icon: 'pen', hint: 'Draw on the phone. With a stylus, pressure sets the line.' },
]

export function Control() {
  const [mode, setMode] = useState<Mode>('trackpad')
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, '0px 0px -15% 0px')
  const current = MODES.find((m) => m.id === mode)!

  return (
    <section ref={root} id="control" className={s.section} aria-labelledby="control-title">
      <div className={cx('container', s.grid)}>
        <div className={s.text}>
          <SectionHead
            label="Control"
            id="control-title"
            size="md"
            title={
              <>
                Drive it with <em>your fingertips.</em>
              </>
            }
            lede="Tap the screen itself, or turn the phone into a trackpad, a pen with pressure, a gamepad, an air mouse or a full keyboard, with the keys phones forget: Esc, Tab, Ctrl and the function row."
          />
          <div className={s.tabs} role="tablist" aria-label="Ways to drive it">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`control-tab-${m.id}`}
                aria-selected={mode === m.id}
                aria-controls="control-stage"
                className={cx(s.tab, mode === m.id && s.tabOn)}
                onClick={() => setMode(m.id)}
              >
                <Icon name={m.icon} size={18} />
                {m.label}
              </button>
            ))}
          </div>
          <p className={s.hint} aria-live="polite">
            {current.hint}
          </p>
          <p className={s.more}>
            Also from the phone: direct touch, a gamepad and an air mouse. The computer's sound plays on the phone, and the phone's mic
            can be the computer's.
          </p>
        </div>
        <div id="control-stage" role="tabpanel" aria-labelledby={`control-tab-${mode}`} className={s.stage}>
          {mode === 'trackpad' && <TrackpadStage active={inView} />}
          {mode === 'keyboard' && <KeyboardStage active={inView} />}
          {mode === 'pen' && <PenStage active={inView} />}
        </div>
      </div>
    </section>
  )
}
