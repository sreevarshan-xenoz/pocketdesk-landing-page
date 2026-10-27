import { cx } from '../../../lib/cx'
import { highlightRust } from '../../../lib/highlight'
import s from './apps.module.css'

/* Real code: core/src/streaming/bitrate.rs in the Pocketdesk repository. */
const FIRST_LINE = 431
const SOURCE = `/// The frame rate for a session whose encoder may use \`effective_bps\`
/// (R6f): the highest of the session's own rate and the slow-link steps (30,
/// 15) that leaves each frame [\`BITS_PER_FRAME\`], since for desktop content
/// fewer, sharper frames read better than many blurred ones (as WebRTC's
/// screen sharing keeps resolution and drops frames). From \`current_fps\` it
/// steps down at once and back up only with [\`STEP_UP_HEADROOM\`]. Never above
/// \`configured_fps\`.
pub fn slow_link_fps(configured_fps: u32, current_fps: u32, effective_bps: u32) -> u32 {
    let need = |fps: u32| u64::from(BITS_PER_FRAME) * u64::from(fps);
    let rate = u64::from(effective_bps) as f64;
    let steps: Vec<u32> = std::iter::once(configured_fps)
        .chain(SLOW_LINK_RATES.into_iter().filter(|&r| r < configured_fps))
        .collect();
    let lowest = configured_fps.min(SLOW_LINK_RATES[2]);
    let affordable = steps
        .iter()
        .copied()
        .find(|&fps| rate >= need(fps) as f64)
        .unwrap_or(lowest);`.split('\n')

const CURRENT = 438

export function Editor() {
  return (
    <div className={s.editor}>
      <div className={s.tabs}>
        <span className={cx(s.tab, s.tabOn)}>bitrate.rs</span>
        <span className={s.tab}>session.rs</span>
        <span className={s.tab}>capture.rs</span>
      </div>
      <div className={s.code}>
        {SOURCE.map((line, i) => {
          const n = FIRST_LINE + i
          return (
            <div key={n} className={cx(s.codeLine, n === CURRENT && s.current)}>
              <span className={s.ln}>{n}</span>
              <span>
                {highlightRust(line).map((t, j) => (
                  <span key={j} className={s[`k_${t.kind}`]}>
                    {t.text}
                  </span>
                ))}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
