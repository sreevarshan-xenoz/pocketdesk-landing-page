// Serves dist/ for the end-to-end tests the way GitHub Pages does: at the project
// path /pocketdesk-landing-page/ (and at / for the rest), with no fallback page,
// so an asset addressed from the wrong root is a 404.
//   node scripts/serve-dist.mjs [port]
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const port = Number(process.argv[2] ?? 4173)
const PROJECT = '/pocketdesk-landing-page'
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
}

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  if (path === PROJECT) {
    res.writeHead(301, { location: `${PROJECT}/` })
    return res.end()
  }
  if (path.startsWith(`${PROJECT}/`)) path = path.slice(PROJECT.length)
  if (path.endsWith('/')) path += 'index.html'
  const file = normalize(join(root, path))
  if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
    res.writeHead(403)
    return res.end()
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('not found')
  }
}).listen(port, '127.0.0.1', () => console.log(`dist on http://127.0.0.1:${port}/ and ${PROJECT}/`))
