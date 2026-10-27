import { describe, expect, test } from 'vitest'
import { detectOS } from './os'

const UA = {
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  androidPhone: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  androidTablet: 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  chromeos: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
}

describe('detectOS', () => {
  test('Windows', () => expect(detectOS({ userAgent: UA.windows })).toBe('windows'))
  test('an Android phone, whose agent also says Linux, is Android', () =>
    expect(detectOS({ userAgent: UA.androidPhone })).toBe('android'))
  test('an Android tablet is Android', () => expect(detectOS({ userAgent: UA.androidTablet })).toBe('android'))
  test('desktop Linux', () => expect(detectOS({ userAgent: UA.linux })).toBe('linux'))
  test('macOS is other', () => expect(detectOS({ userAgent: UA.mac })).toBe('other'))
  test('iPhone is other', () => expect(detectOS({ userAgent: UA.iphone })).toBe('other'))
  test('ChromeOS is other, not Linux', () => expect(detectOS({ userAgent: UA.chromeos })).toBe('other'))
  test('client hints win over a frozen agent string', () =>
    expect(detectOS({ userAgent: UA.linux, userAgentData: { platform: 'Windows' } })).toBe('windows'))
  test('an empty agent is other', () => expect(detectOS({ userAgent: '' })).toBe('other'))
})
