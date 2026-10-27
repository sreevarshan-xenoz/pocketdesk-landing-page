/*
 * The film's scenes, drawn with the site's own components so the film and the
 * page are one thing. Each scene is a still 1920x1080 frame: scripts/build-film.mjs
 * renders it to HTML for video/compositions/, where a GSAP timeline in
 * video/src/<scene>.html moves the parts named by id below.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Desktop, FitDesktop } from '../components/desktop/Desktop'
import { TermLine } from '../components/desktop/apps/Terminal'
import { Wallpaper } from '../components/desktop/Wallpaper'
import { Window } from '../components/desktop/Window'
import { Laptop } from '../components/device/Laptop'
import { LockScreen, Notice } from '../components/device/LockScreen'
import { Phone } from '../components/device/Phone'
import { Icon } from '../components/Icon'
import { MARK, MarkGradients, PocketFront } from '../components/Mark'
import a from '../components/desktop/apps/apps.module.css'
import { cx } from '../lib/cx'
import type { Line } from '../lib/term'
import aw from '../sections/Anywhere.module.css'
import bw from '../sections/BothWays.module.css'
import h from '../sections/Hero.module.css'
import f from './film.module.css'

/* ---------- shared pieces ---------- */

/** A shell whose next command is typed by the timeline: `--chars` reveals it one character at a time. */
function FilmShell({ id, history, cmd, out, big }: { id: string; history: Line[]; cmd: string; out: Line[]; big?: boolean }) {
  return (
    <div className={cx(a.term, big && f.bigTerm)}>
      {history.map((l, i) => (
        <TermLine key={i} line={l} />
      ))}
      <div className={a.tline}>
        <span className={a.prompt}>~ $</span>{' '}
        <span id={`${id}-cmd`} className={f.typed} style={{ '--chars': 0 } as CSSProperties}>
          {cmd}
        </span>
        <span className={cx(a.caret, f.stillCaret)} />
      </div>
      {out.map((l, i) => (
        <div key={i} id={`${id}-out${i}`} className={f.later}>
          <TermLine line={l} />
        </div>
      ))}
    </div>
  )
}

/** The landscape phone streaming a desktop, as in the site's hero. */
function StreamingPhone({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className={f.device} data-layout-ignore>
      <Phone orientation="landscape" screenClassName={h.screen}>
        <div className={h.stream}>
          <div className={h.side} data-side>
            <span className={h.sideBtn}>
              <Icon name="keyboard" size={54} />
            </span>
            <span className={cx(h.sideBtn, h.sideOn)}>
              <Icon name="trackpad" size={54} />
            </span>
            <span className={h.sideBtn}>
              <Icon name="pen" size={54} />
            </span>
          </div>
          <div className={h.view}>{children}</div>
          <div className={h.side} data-side>
            <span className={h.sideBtn}>
              <Icon name="volume" size={54} />
            </span>
            <span className={h.sideBtn}>
              <Icon name="more" size={54} />
            </span>
          </div>
        </div>
      </Phone>
    </div>
  )
}

const BUILD_HISTORY: Line[] = [
  [['prompt', '~ $'], ' ', ['cmd', 'pocketdesk status']],
  [['ok', '●'], ' Server running   ', ['dim', 'control TCP 1716 · stream UDP 4716']],
  ['  Pixel 8   ', ['dim', 'in a session · home Wi-Fi']],
  [],
]

const BUILD_OUT: Line[] = [
  [['ok', '   Compiling'], ' pocketdesk-core v0.6.0'],
  [['ok', '   Compiling'], ' pocketdesk-server v0.6.0'],
  [['ok', '    Finished'], ' `release` profile [optimized] in 41.2s'],
]

const REPLY = "No rush, I'll grab us a table"

/* ---------- 1. the desktop, into the pocket, under a thumb ---------- */

export function DeskScene() {
  return (
    <div id="desk-scene" className={f.scene}>
      <div className={f.sweep} />
      <div id="desk-shadow" className={f.contact} />
      <StreamingPhone id="desk-device">
        <Desktop idPrefix="desk" focus="terminal" terminal={<FilmShell id="desk-sh" history={BUILD_HISTORY} cmd="cargo build --release" out={BUILD_OUT} />} />
        <span id="desk-ripple" className={f.ripple} />
      </StreamingPhone>
      <span id="desk-finger" className={f.finger} />
      <h2 id="desk-t1" className={cx(f.title, f.deskTitle)}>
        Your desktop.
      </h2>
      <h2 id="desk-t2" className={cx(f.title, f.top)}>
        In your <em>pocket.</em>
      </h2>
      <h2 id="desk-t3" className={cx(f.title, f.top)}>
        Drive it with <em>your thumb.</em>
      </h2>
    </div>
  )
}

/* ---------- 2. both ways: a text answered from the laptop, a file across ---------- */

export function BothScene() {
  return (
    <div id="both-scene" className={f.scene}>
      <div className={f.sweep} />
      {/* The camera's subject: the laptop, the link and the phone, moved as one for the punch-in. */}
      <div id="both-stage" className={f.stage}>
      <div id="both-shadow" className={f.bothShadow} />
      <div id="both-laptop" className={f.bothLaptop} data-layout-ignore>
        <Laptop>
          <FitDesktop scene="bare" app="Messages" cursor={false} fit={0.6017}>
            <div id="both-toast" className={bw.toast}>
              <div className={bw.toastHead}>
                <span className={bw.msgIcon}>
                  <Icon name="chat" size={20} />
                </span>
                Messages <span>· Pixel 8</span>
              </div>
              <b>Maya</b>
              <p>Running five minutes late, save me a seat?</p>
              <div className={bw.replyBox}>
                <span id="both-typed" className={bw.typed}>
                  {REPLY}
                </span>
                <span id="both-send" className={bw.send}>
                  Send
                </span>
              </div>
            </div>
            <div id="both-files" className={f.layer}>
              <Window title="Pocketdesk — Files" focused style={{ left: 290, top: 190, width: 1020, height: 380 }}>
                <div className={bw.files}>
                  <div className={bw.fileRow}>
                    <span className={bw.fileIcon}>
                      <Icon name="file" size={34} />
                    </span>
                    <div className={bw.fileName}>
                      <b>holiday.mp4</b>
                      <span>1.8 GB · to Pixel 8</span>
                    </div>
                    <span id="both-pct" className={bw.pct}>
                      0%
                    </span>
                  </div>
                  <div className={bw.bar}>
                    <b id="both-bar" className={f.barFill} />
                  </div>
                  <div className={bw.fileFoot}>
                    <span>Sending · a dropped link picks up where it stopped</span>
                    <span id="both-done" className={bw.checked}>
                      <Icon name="check" size={20} /> Checked, SHA-256
                    </span>
                  </div>
                </div>
              </Window>
            </div>
          </FitDesktop>
        </Laptop>
      </div>
      <div className={f.bothLink}>
        <span id="both-packet" className={bw.packet} />
      </div>
      <div id="both-phone" className={f.bothPhone} data-layout-ignore>
        <Phone>
          <LockScreen>
            <div id="both-n1" className={f.slot}>
              <Notice
                app="Messages"
                tint="#22c55e"
                icon={<Icon name="chat" />}
                title="Maya"
                body={
                  <>
                    Running five minutes late, save me a seat?
                    <span id="both-sent" className={bw.sentLine}>
                      You: {REPLY} <em>sent from Laptop</em>
                    </span>
                  </>
                }
              />
            </div>
            <div id="both-n2" className={f.slot}>
              <Notice
                app="Pocketdesk"
                tint="#2f7bff"
                icon={<Icon name="download" />}
                title="holiday.mp4 from Laptop"
                body={
                  <>
                    <span className={bw.phoneBar}>
                      <b id="both-pbar" className={f.barFill} />
                    </span>
                    <span className={bw.phoneMeta}>
                      <span id="both-ppct">0%</span> of 1.8 GB
                    </span>
                  </>
                }
              />
            </div>
          </LockScreen>
        </Phone>
      </div>
      </div>
      {/* The last scene's phone exactly as it left it, so the cut does not jump. */}
      <StreamingPhone id="both-landscape">
        <Desktop idPrefix="bl" focus="terminal" terminal={<FilmShell id="bl-sh" history={BUILD_HISTORY} cmd="cargo build --release" out={BUILD_OUT} />} />
      </StreamingPhone>
      <h2 id="both-t1" className={cx(f.title, f.topLeft)}>
        Answer it <em>from your desk.</em>
      </h2>
      <h2 id="both-t2" className={cx(f.title, f.topLeft)}>
        Files, <em>both ways.</em>
      </h2>
    </div>
  )
}

/* ---------- 3. anywhere ---------- */

export function AnywhereScene() {
  return (
    <div id="any-scene" className={f.scene}>
      <div className={f.mapGround} />
      <div id="any-world" className={f.mapWorld} data-layout-ignore>
        <svg className={f.map} viewBox="0 0 1200 460">
          <defs>
            <pattern id="any-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#1b2650" />
            </pattern>
            <linearGradient id="any-line" x1="232" y1="0" x2="976" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5AD1FF" />
              <stop offset="1" stopColor="#7B6CFF" />
            </linearGradient>
          </defs>
          <rect x="-600" y="-300" width="2400" height="1060" fill="url(#any-dots)" />
          <rect className={aw.block} x="40" y="90" width="380" height="300" rx="28" />
          <text className={aw.blockLabel} x="68" y="128">
            HOME
          </text>
          <rect className={aw.block} x="780" y="90" width="380" height="300" rx="28" />
          <text className={aw.blockLabel} x="808" y="128">
            AWAY
          </text>
          <g id="any-laptop" transform="translate(104 222)">
            <rect className={aw.device} x="0" y="0" width="124" height="80" rx="8" />
            <rect x="8" y="8" width="108" height="64" rx="4" fill="#12245e" />
            <path className={aw.deviceLine} d="M-14 88 H138" />
          </g>
          <path id="any-wifi" d="M232 262 L306 262" fill="none" stroke="url(#any-line)" strokeWidth="4" strokeLinecap="round" />
          <path id="any-punch" d="M232 262 L976 262" fill="none" stroke="url(#any-line)" strokeWidth="4" strokeLinecap="round" />
          <text id="any-punch-label" className={aw.roadLabel} x="600" y="296" textAnchor="middle">
            direct, through both routers
          </text>
          <g id="any-relay">
            <path className={aw.relayPath} d="M232 250 C 330 120, 470 66, 578 66 L 622 66 C 730 66, 870 120, 976 250" />
            <circle className={aw.relay} cx="600" cy="66" r="22" />
            <path className={aw.relayLock} d="M593 66 h14 v10 h-14 z M596 66 v-4 a4 4 0 0 1 8 0 v4" />
            <text className={aw.roadLabel} x="600" y="30" textAnchor="middle">
              or a relay: encrypted bytes only
            </text>
          </g>
          <g transform="translate(420 262)">
            <rect className={aw.router} x="-11" y="-36" width="22" height="72" rx="11" />
            <circle id="any-spark-a" r="26" fill="rgba(223,246,255,.35)" stroke="#dff6ff" strokeWidth="2" opacity="0" />
          </g>
          <g transform="translate(780 262)">
            <rect className={aw.router} x="-11" y="-36" width="22" height="72" rx="11" />
            <circle id="any-spark-b" r="26" fill="rgba(223,246,255,.35)" stroke="#dff6ff" strokeWidth="2" opacity="0" />
          </g>
          <circle id="any-pk1" cx="232" cy="262" r="6" fill="#dff6ff" opacity="0" />
          <circle id="any-pk2" cx="976" cy="262" r="6" fill="#dff6ff" opacity="0" />
          <g id="any-phone" transform="translate(330 262)">
            <rect x="-40" y="-60" width="80" height="120" rx="30" fill="rgba(90,209,255,.1)" />
            <rect className={aw.device} x="-22" y="-42" width="44" height="84" rx="10" />
            <rect x="-17" y="-36" width="34" height="72" rx="6" fill="#12245e" />
          </g>
        </svg>
      </div>
      <h2 id="any-t1" className={cx(f.title, f.top)}>
        From anywhere. <em>No port forward.</em>
      </h2>
    </div>
  )
}

/* ---------- 4. your phone, in your scripts ---------- */

export function ScriptsScene() {
  return (
    <div id="sc-scene" className={f.scene}>
      <div id="sc-world" className={f.scWorld}>
        <Wallpaper className={f.fill} />
        <Window id="sc-term" title="Terminal — ~/pocketdesk" focused style={{ left: 96, top: 236, width: 1220, height: 560 }}>
          <FilmShell
            id="sc-sh"
            big
            history={[[['prompt', '~ $'], ' ', ['cmd', 'git tag v0.6.1']], []]}
            cmd={'pocketdesk ask "Ship v0.6.1 to production?"'}
            out={[[['dim', 'waiting for an answer from your phone…']], [['ok', 'yes']], [['dim', 'exit 0, shipping…']]]}
          />
        </Window>
      </div>
      <div id="sc-phone" className={f.scPhone} data-layout-ignore>
        <Phone>
          <LockScreen>
            <div id="sc-n" className={f.slot}>
              <Notice
                app="Laptop asks"
                tint="#7b6cff"
                icon={<Icon name="shield" />}
                title="Ship v0.6.1 to production?"
                body={
                  <span className={f.askButtons}>
                    <span>No</span>
                    <span id="sc-yes" className={f.yes}>
                      <Icon name="fingerprint" /> Yes
                    </span>
                  </span>
                }
              />
            </div>
          </LockScreen>
        </Phone>
      </div>
      <span id="sc-finger" className={f.finger} />
      {/* The laptop's screen colour, carried in from the map's zoom, clearing as the terminal settles. */}
      <div id="sc-iris" className={f.iris} />
      <h2 id="sc-t1" className={cx(f.title, f.topLeft)}>
        Your phone, <em>in your scripts.</em>
      </h2>
    </div>
  )
}

/* ---------- 5. into the pocket: the mark ---------- */

export function PocketScene() {
  const w = MARK.window
  return (
    <div id="pocket-scene" className={cx(f.scene, f.navy)}>
      <div id="pk-phone" className={f.pkPhone} data-layout-ignore>
        <Phone>
          <LockScreen />
        </Phone>
      </div>
      <svg id="pk-mark" className={f.pkMark} viewBox="0 0 512 512">
        <MarkGradients id="pk" />
        <path id="pk-wall" d={MARK.back} fill="url(#pk-back)" />
        <g id="pk-drop">
          <g transform={`rotate(${w.rotate} ${w.cx} ${w.cy})`}>
            <rect x={w.x} y={w.y} width={w.width} height={w.height} rx={w.rx} fill="#0B1222" stroke="url(#pk-rim)" strokeWidth="12" />
            <circle cx={MARK.dots[0]} cy="140" r="14" fill="#FF5F57" />
            <circle cx={MARK.dots[1]} cy="140" r="14" fill="#FEBC2E" />
            <circle cx={MARK.dots[2]} cy="140" r="14" fill="#28C840" />
          </g>
        </g>
        <g id="pk-front">
          <PocketFront id="pk" />
        </g>
      </svg>
      <div id="pk-word" className={f.pkWord}>
        Pocketdesk
      </div>
      <p id="pk-tag" className={f.pkTag}>
        Your desktop. <em>Anywhere.</em>
      </p>
      <div id="pk-cta" className={f.pkCta}>
        <span className={f.pkButton}>
          <Icon name="download" size={26} />
          Download free
        </span>
        <span className={f.pkPlatforms}>Windows · Linux · Android · open source</span>
      </div>
    </div>
  )
}

export const SCENES = {
  desk: DeskScene,
  both: BothScene,
  anywhere: AnywhereScene,
  scripts: ScriptsScene,
  pocket: PocketScene,
}
