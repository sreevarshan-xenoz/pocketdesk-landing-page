import { expect, test } from 'vitest'
import { windowAt } from './windows'

test('a point inside the terminal is the terminal', () => {
  expect(windowAt(300, 300, 'editor')).toBe('terminal')
})

test('the wallpaper under every window is nothing', () => {
  expect(windowAt(200, 820, 'terminal')).toBeNull()
})

test('the window in front wins where two would overlap', () => {
  // The editor (836..1560 across, 66..536 down) and the music player (from 562 down) do not overlap,
  // so the front one is checked first but any hit is its own.
  expect(windowAt(900, 600, 'editor')).toBe('music')
  expect(windowAt(900, 100, 'music')).toBe('editor')
})
