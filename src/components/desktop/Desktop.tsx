import { type ReactNode, useRef } from 'react'
import { useFitScale } from '../../hooks/useFitScale'
import { cx } from '../../lib/cx'
import { Icon } from '../Icon'
import { Mark } from '../Mark'
import { type Command, type Line, Terminal } from './apps/Terminal'
import { Editor } from './apps/Editor'
import { Music } from './apps/Music'
import { Wallpaper } from './Wallpaper'
import { Window } from './Window'
import s from './Desktop.module.css'

export const DESKTOP_W = 1600
export const DESKTOP_H = 900

const HISTORY: Line[] = [
  [['prompt', '~ $'], ' ', ['cmd', 'pocketdesk status']],
  [['ok', '●'], ' Server running   ', ['dim', 'control TCP 1716 · stream UDP 4716']],
  ['  Pixel 8   ', ['dim', 'in a session · home Wi-Fi']],
  [],
  [['prompt', '~ $'], ' ', ['cmd', 'cargo build --release']],
  [['ok', '   Compiling'], ' pocketdesk-core v0.6.0'],
  [['ok', '   Compiling'], ' pocketdesk-server v0.6.0'],
  [['ok', '    Finished'], ' `release` profile [optimized] in 41.2s'],
  [],
]

const SCRIPT: Command[] = [
  { cmd: 'pocketdesk ring "Pixel 8"', out: [[['accent', '♪'], ' Ringing Pixel 8 for 30 seconds']] },
  { cmd: 'pocketdesk send "Pixel 8" holiday.mp4', out: [[['ok', '✓'], ' holiday.mp4 · 1.8 GB · sent and checked']] },
]

function TopBar({ app }: { app: string }) {
  return (
    <div className={s.topbar}>
      <div className={s.tbLeft}>
        <span className={s.ws}>
          <i className={s.wsOn}>1</i>
          <i>2</i>
          <i>3</i>
          <i>4</i>
        </span>
        <span className={s.app}>{app}</span>
      </div>
      <div className={s.clock}>Tue Oct 27 · 9:41</div>
      <div className={s.tbRight}>
        <span className={s.tray}>
          <Mark size={20} />
          <i />
        </span>
        <Icon name="wifi" size={17} />
        <Icon name="volume" size={17} />
        <span className={s.batt}>
          <Icon name="battery" size={19} />
          86%
        </span>
      </div>
    </div>
  )
}

function Cursor() {
  return (
    <svg className={s.cursor} viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <path d="M4 2.5 19 13l-7 1.4L8.2 21 4 2.5Z" fill="#fff" stroke="#0b1222" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

interface DesktopProps {
  /** 'work': a terminal, an editor and a music player. 'bare': wallpaper and the top bar only. */
  scene?: 'work' | 'bare'
  /** Typing, a wandering cursor and a playing equaliser. */
  live?: boolean
  cursor?: boolean
  app?: string
  children?: ReactNode
  className?: string
}

/** A computer's screen at 1600x900. Decorative: the words around it say what it shows. */
export function Desktop({ scene = 'work', live = false, cursor = true, app, children, className }: DesktopProps) {
  return (
    <div className={cx(s.desktop, live && 'live', className)} aria-hidden="true">
      <Wallpaper className={s.wallpaper} />
      <TopBar app={app ?? (scene === 'work' ? 'Terminal' : 'Desktop')} />
      {scene === 'work' && (
        <>
          <Window title="Terminal — ~/pocketdesk" focused style={{ left: 40, top: 66, width: 770, height: 500 }}>
            <Terminal history={HISTORY} script={SCRIPT} live={live} />
          </Window>
          <Window title="bitrate.rs — pocketdesk/core" style={{ left: 836, top: 66, width: 724, height: 470 }}>
            <Editor />
          </Window>
          <Window title="Music" style={{ left: 836, top: 562, width: 476, height: 186 }}>
            <Music />
          </Window>
        </>
      )}
      {children}
      {cursor && <Cursor />}
    </div>
  )
}

/** The desktop scaled to the width of whatever holds it. */
export function FitDesktop({ className, ...props }: DesktopProps) {
  const ref = useRef<HTMLDivElement>(null)
  useFitScale(ref, DESKTOP_W)
  return (
    <div ref={ref} className={cx(s.fit, className)}>
      <Desktop {...props} />
    </div>
  )
}
