export type WindowId = 'terminal' | 'editor' | 'music'

/** Where the desktop scene's windows sit, in its 1600x900 pixels. */
export const WINDOW_RECTS: Record<WindowId, { left: number; top: number; width: number; height: number }> = {
  terminal: { left: 40, top: 66, width: 770, height: 500 },
  editor: { left: 836, top: 66, width: 724, height: 470 },
  music: { left: 836, top: 562, width: 476, height: 186 },
}

const ALL: WindowId[] = ['terminal', 'editor', 'music']

/** The window under a point, front-most first; null over the wallpaper. */
export function windowAt(x: number, y: number, focus: WindowId): WindowId | null {
  const order = [focus, ...ALL.filter((w) => w !== focus)]
  return (
    order.find((id) => {
      const r = WINDOW_RECTS[id]
      return x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height
    }) ?? null
  )
}
