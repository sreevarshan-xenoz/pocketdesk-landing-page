/* Terminal lines: plain text, or a styled run [kind, text]. */
export type SegKind = 'prompt' | 'cmd' | 'ok' | 'dim' | 'warn' | 'accent' | 'bold' | 'err'
export type Seg = string | [SegKind, string]
export type Line = Seg[]

export interface Command {
  cmd: string
  out: Line[]
}

export function lineText(line: Line): string {
  return line.map((seg) => (typeof seg === 'string' ? seg : seg[1])).join('')
}
