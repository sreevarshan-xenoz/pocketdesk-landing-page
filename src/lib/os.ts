export type OS = 'windows' | 'linux' | 'android' | 'other'

export interface NavigatorLike {
  userAgent: string
  userAgentData?: { platform?: string }
}

/** Which Pocketdesk download fits the visitor. macOS, iOS and ChromeOS have none: 'other'. */
export function detectOS(nav: NavigatorLike): OS {
  const hint = nav.userAgentData?.platform?.toLowerCase() ?? ''
  if (hint === 'windows') return 'windows'
  if (hint === 'android') return 'android'

  const ua = nav.userAgent
  if (/Android/i.test(ua)) return 'android'
  if (/Windows NT/i.test(ua)) return 'windows'
  if (/CrOS/i.test(ua)) return 'other'
  if (/Linux|X11/i.test(ua)) return 'linux'
  return 'other'
}
