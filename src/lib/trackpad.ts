const SLOW = 0.3 // px/ms: at or under it, the cursor follows the finger 1:1
const FAST = 1.5 // px/ms: at or over it, the gain tops out
const MAX_GAIN = 2.6

/** Pointer acceleration for the trackpad demo: fast flicks cross the screen, slow drags stay precise. */
export function accelerate(dx: number, dy: number, dtMs: number): { x: number; y: number } {
  const dt = dtMs > 0 ? dtMs : 16
  const speed = Math.hypot(dx, dy) / dt
  const t = Math.min(1, Math.max(0, (speed - SLOW) / (FAST - SLOW)))
  const gain = 1 + t * (MAX_GAIN - 1)
  return { x: dx * gain, y: dy * gain }
}
