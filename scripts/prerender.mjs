// Puts the rendered page into dist/index.html, so the copy is there before any
// script runs (search engines, link previews, slow phones), then drops the
// server bundle that rendered it.
import { readFile, rm, writeFile } from 'node:fs/promises'

const page = new URL('../dist/index.html', import.meta.url)
const serverBundle = new URL('../dist-ssr/', import.meta.url)

const { render } = await import(new URL('entry-server.js', serverBundle).href)
const template = await readFile(page, 'utf8')
if (!template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html has no <!--app-html--> slot to fill')
}
await writeFile(page, template.replace('<!--app-html-->', render()))
await rm(serverBundle, { recursive: true, force: true })
console.log('prerendered dist/index.html')
