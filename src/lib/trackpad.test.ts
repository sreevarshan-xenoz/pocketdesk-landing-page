import { expect, test } from 'vitest'
import { accelerate } from './trackpad'

test('a slow drag moves the cursor as far as the finger', () => {
  expect(accelerate(3, 0, 20)).toEqual({ x: 3, y: 0 })
})

test('a fast flick is multiplied by 2.6', () => {
  expect(accelerate(40, 0, 20)).toEqual({ x: 104, y: 0 })
})

test('in between, the gain grows with speed', () => {
  // 18 px in 20 ms is 0.9 px/ms: halfway from 0.3 to 1.5, so a gain of 1.8
  const { x, y } = accelerate(18, 0, 20)
  expect(x).toBeCloseTo(32.4)
  expect(y).toBe(0)
})

test('direction is kept on both axes', () => {
  const { x, y } = accelerate(-30, 40, 20)
  expect(x).toBeCloseTo(-78)
  expect(y).toBeCloseTo(104)
})

test('a move with no time between events counts as one frame', () => {
  expect(accelerate(3, 0, 0)).toEqual({ x: 3, y: 0 })
})
