import type { Line } from './term'

export { lineText } from './term'

export interface ShellResult {
  output: Line[]
  effect?: 'ring' | 'clear'
}

const HELP: Line[] = [
  ['Commands in this demo:'],
  [['accent', '  pocketdesk status'], ['dim', '        the server, and who is connected']],
  [['accent', '  pocketdesk ring <phone>'], ['dim', '  ring a phone, loudly, for 30 seconds']],
  [['accent', '  echo <words>'], ['dim', '             say something']],
  [['accent', '  clear'], ['dim', '                    start over']],
  [['dim', 'pd is the short name for pocketdesk.']],
]

const STATUS: Line[] = [
  [['ok', '●'], ' Server running   ', ['dim', 'control TCP 1716 · stream UDP 4716']],
  ['  Pixel 8   ', ['dim', 'in a session · home Wi-Fi']],
]

/** The demo terminal's tiny shell: a few real Pocketdesk commands, answered the way the demo can. */
export function runCommand(input: string): ShellResult {
  const line = input.trim()
  if (!line) return { output: [] }
  const [first, ...rest] = line.split(/\s+/)
  const cmd = first === 'pd' ? 'pocketdesk' : first

  switch (cmd) {
    case 'help':
      return { output: HELP }
    case 'clear':
      return { output: [], effect: 'clear' }
    case 'echo':
      return { output: [[rest.join(' ')]] }
    case 'pocketdesk':
      if (rest[0] === 'status') return { output: STATUS }
      if (rest[0] === 'ring') return { output: [['Ringing Pixel 8 for 30 seconds']], effect: 'ring' }
      return { output: [['Try ', ['accent', 'help'], ' to see what this demo knows.']] }
    default:
      return { output: [[`command not found: ${cmd}`]] }
  }
}
