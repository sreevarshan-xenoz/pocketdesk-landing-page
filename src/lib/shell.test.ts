import { describe, expect, test } from 'vitest'
import { lineText, runCommand } from './shell'

const texts = (line: string) => runCommand(line).output.map(lineText)

describe('runCommand', () => {
  test('help lists what the demo understands', () => {
    const out = texts('help').join('\n')
    expect(out).toContain('pocketdesk status')
    expect(out).toContain('pocketdesk ring')
    expect(out).toContain('clear')
  })

  test('an unknown command says so', () => {
    expect(texts('rm -rf /')).toEqual(['command not found: rm'])
  })

  test('an empty line prints nothing', () => {
    expect(runCommand('   ')).toEqual({ output: [] })
  })

  test('clear asks the terminal to clear', () => {
    expect(runCommand('clear')).toEqual({ output: [], effect: 'clear' })
  })

  test('ringing a phone rings the phone beside it', () => {
    const r = runCommand('pocketdesk ring "Pixel 8"')
    expect(r.effect).toBe('ring')
    expect(r.output.map(lineText)).toEqual(['Ringing Pixel 8 for 30 seconds'])
  })

  test('pd is the short name', () => {
    expect(runCommand('pd ring pixel').effect).toBe('ring')
    expect(texts('pd status')).toEqual(texts('pocketdesk status'))
  })

  test('status names the server and the phone', () => {
    const out = texts('pocketdesk status').join('\n')
    expect(out).toContain('Server running')
    expect(out).toContain('Pixel 8')
  })

  test('echo prints its words back', () => {
    expect(texts('echo hello there')).toEqual(['hello there'])
  })
})
