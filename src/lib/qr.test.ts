import QRCode from 'qrcode'
import { expect, test } from 'vitest'
import { qrPath } from './qr'

const URL = 'https://github.com/sreevarshan-xenoz/Pocketdesk'

test('one square per dark module', () => {
  const dark = [...QRCode.create(URL, { errorCorrectionLevel: 'M' }).modules.data].filter(Boolean).length
  const { d } = qrPath(URL)
  expect(d.match(/M/g)?.length).toBe(dark)
})

test('the size is the code in modules, and the corner finder is dark', () => {
  const { size, d } = qrPath(URL)
  expect(size).toBe(33)
  expect(d.startsWith('M0 0h1v1h-1z')).toBe(true)
})
