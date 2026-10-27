import { type ReactNode, type Ref, useRef } from 'react'
import { useFitScale } from '../../hooks/useFitScale'
import { cx } from '../../lib/cx'
import type { Command, Line } from '../../lib/term'
import { WINDOW_RECTS, type WindowId } from '../../lib/windows'
import { Icon } from '../Icon'
import { Mark } from '../Mark'
import { Editor } from './apps/Editor'
import { Music } from './apps/Music'
import { Terminal } from './apps/Terminal'
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

export interface Click {
  id: number
  x: number
  y: number
}

interface DesktopProps {
  /** 'work': a terminal, an editor and a music player. 'bare': wallpaper and the top bar only. */
  scene?: 'work' | 'bare'
  /** Typing, a wandering cursor and a playing equaliser. */
  live?: boolean
  cursor?: boolean
  /** Hand the cursor to a script: it stops wandering and the ref moves it. */
  cursorRef?: Ref<SVGSVGElement>
  /** The window in front. */
  focus?: WindowId
  /** Replaces the terminal's contents. */
  terminal?: ReactNode
  /** Click ripples to draw, in desktop pixels. */
  clicks?: Click[]
  app?: string
  children?: ReactNode
  className?: string
}

/** A computer's screen at 1600x900. Decorative: the words around it say what it shows. */
export function Desktop({
  scene = 'work',
  live = false,
  cursor = true,
  cursorRef,
  focus = 'terminal',
  terminal,
  clicks = [],
  app,
  children,
  className,
}: DesktopProps) {
  const titles: Record<WindowId, string> = { terminal: 'Terminal', editor: 'bitrate.rs', music: 'Music' }
  const win = (id: WindowId) => ({ ...WINDOW_RECTS[id], zIndex: id === focus ? 3 : 1 })
  return (
    <div className={cx(s.desktop, live && 'live', className)} aria-hidden="true">
      <Wallpaper className={s.wallpaper} />
      <TopBar app={app ?? (scene === 'work' ? titles[focus] : 'Desktop')} />
      {scene === 'work' && (
        <>
          <Window title="Terminal — ~/pocketdesk" focused={focus === 'terminal'} style={win('terminal')}>
            {terminal ?? <Terminal history={HISTORY} script={SCRIPT} live={live} />}
          </Window>
          <Window title="bitrate.rs — pocketdesk/core" focused={focus === 'editor'} style={win('editor')}>
            <Editor />
          </Window>
          <Window title="Music" focused={focus === 'music'} style={win('music')}>
            <Music />
          </Window>
        </>
      )}
      {children}
      {clicks.map((c) => (
        <span key={c.id} className={s.ripple} style={{ left: c.x, top: c.y }} />
      ))}
      {cursor && (
        <svg ref={cursorRef} className={cx(s.cursor, cursorRef && s.held)} viewBox="0 0 24 24" width="30" height="30">
          <path d="M4 2.5 19 13l-7 1.4L8.2 21 4 2.5Z" fill="#fff" stroke="#0b1222" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
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
