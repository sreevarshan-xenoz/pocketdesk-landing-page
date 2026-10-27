import { expect, test } from 'vitest'
import { highlightRust } from './highlight'

test('a doc comment is one comment token', () => {
  expect(highlightRust('/// The frame rate for a session')).toEqual([{ kind: 'comment', text: '/// The frame rate for a session' }])
})

test('keywords, types, functions and numbers are told apart', () => {
  expect(highlightRust('pub fn slow_link_fps(configured_fps: u32) -> u32 {')).toEqual([
    { kind: 'keyword', text: 'pub' },
    { kind: 'plain', text: ' ' },
    { kind: 'keyword', text: 'fn' },
    { kind: 'plain', text: ' ' },
    { kind: 'function', text: 'slow_link_fps' },
    { kind: 'plain', text: '(configured_fps: ' },
    { kind: 'type', text: 'u32' },
    { kind: 'plain', text: ') -> ' },
    { kind: 'type', text: 'u32' },
    { kind: 'plain', text: ' {' },
  ])
})

test('a number and a trailing comment', () => {
  expect(highlightRust('let lowest = 15; // the floor')).toEqual([
    { kind: 'keyword', text: 'let' },
    { kind: 'plain', text: ' lowest = ' },
    { kind: 'number', text: '15' },
    { kind: 'plain', text: '; ' },
    { kind: 'comment', text: '// the floor' },
  ])
})

test('the text survives tokenizing unchanged', () => {
  const line = '    .find(|&fps| rate >= need(fps) as f64 * STEP_UP_HEADROOM)'
  expect(highlightRust(line).map((t) => t.text).join('')).toBe(line)
})
