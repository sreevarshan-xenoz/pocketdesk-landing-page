// Draws the film's scenes with the site's own components: renders src/film to
// static HTML and pours it, with the stylesheet, into video/src/<scene>.html,
// writing video/compositions/<scene>.html for HyperFrames.
//   node scripts/build-film.mjs
import { execSync } from 'node:child_process'
import { readFile, rm, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const at = (p) => new URL(p, root)
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' })

run('npx vite build --config vite.film.config.ts')
run('npx vite build --config vite.film.config.ts --ssr src/film/render.tsx')

const { renderScenes } = await import(at('dist-film-ssr/render.js').href)
// CSS transitions run on the browser's clock, which a frame-by-frame render cannot seek: drop them.
const css = (await readFile(at('dist-film/film.css'), 'utf8')).replace(/transition:[^;}]*;?/g, '')

// The site's faces, latin subsets, from video/assets/fonts.
const face = (family, file) =>
  `@font-face{font-family:'${family}';font-style:normal;font-display:block;font-weight:100 900;src:url('assets/fonts/${file}') format('woff2')}`
const fonts = [
  face('Funnel Display Variable', 'funnel-display-latin-wght-normal.woff2'),
  face('Funnel Sans Variable', 'funnel-sans-latin-wght-normal.woff2'),
  face('JetBrains Mono Variable', 'jetbrains-mono-latin-wght-normal.woff2'),
  face('Outfit Variable', 'outfit-latin-wght-normal.woff2'),
].join('\n')

const scenes = renderScenes()
for (const [name, html] of Object.entries(scenes)) {
  const template = await readFile(at(`video/src/${name}.html`), 'utf8')
  if (!template.includes('<!--scene-->') || !template.includes('/* film.css */')) {
    throw new Error(`video/src/${name}.html needs a <!--scene--> slot and a /* film.css */ slot`)
  }
  const out = template.replace('/* film.css */', () => `${fonts}\n${css}`).replace('<!--scene-->', () => html)
  await writeFile(at(`video/compositions/${name}.html`), out)
  console.log(`wrote video/compositions/${name}.html`)
}

await rm(at('dist-film'), { recursive: true, force: true })
await rm(at('dist-film-ssr'), { recursive: true, force: true })
