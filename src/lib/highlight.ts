export type TokenKind = 'plain' | 'comment' | 'keyword' | 'type' | 'function' | 'number' | 'string' | 'constant'

export interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set(
  'as async await break const continue crate dyn else enum false fn for if impl in let loop match mod move mut pub ref return self static struct super trait true type unsafe use where while'.split(
    ' ',
  ),
)
const TYPES = new Set('u8 u16 u32 u64 u128 usize i8 i16 i32 i64 i128 isize f32 f64 bool char str String Vec Option Result Self Box'.split(' '))
const PATTERN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g

function kindOfWord(word: string, next: string | undefined): TokenKind {
  if (KEYWORDS.has(word)) return 'keyword'
  if (TYPES.has(word)) return 'type'
  if (next === '(') return 'function'
  if (/^[A-Z][A-Z0-9_]+$/.test(word)) return 'constant'
  return 'plain'
}

/** One line of Rust as coloured tokens, for the editor window. Joining the texts gives the line back. */
export function highlightRust(line: string): Token[] {
  const out: Token[] = []
  const push = (kind: TokenKind, text: string) => {
    if (!text) return
    const last = out[out.length - 1]
    if (kind === 'plain' && last?.kind === 'plain') last.text += text
    else out.push({ kind, text })
  }
  let i = 0
  for (const m of line.matchAll(PATTERN)) {
    const [text, comment, str, num, word] = m
    push('plain', line.slice(i, m.index))
    if (comment) push('comment', text)
    else if (str) push('string', text)
    else if (num) push('number', text)
    else if (word) push(kindOfWord(word, line[m.index + word.length]), text)
    i = m.index + text.length
  }
  push('plain', line.slice(i))
  return out
}
