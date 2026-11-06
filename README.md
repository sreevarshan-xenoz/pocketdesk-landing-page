# pocketdesk-landing-page

The landing page for [Pocketdesk](https://github.com/sreevarshan-xenoz/Pocketdesk): your Windows or Linux
computer on your Android phone. Live at <https://sreevarshan-xenoz.github.io/pocketdesk-landing-page/>.

A one-page React + Vite site, prerendered at build time, that tells the product's story by scrolling:

| Section | What it does |
|---|---|
| Hero | A desktop wider than the window shrinks into a phone as you scroll: "Your desktop. In your pocket." |
| Control | A demo the visitor drives: a trackpad (drag the laptop's pointer), a keyboard (a tiny shell that knows `pocketdesk status` and `ring`), a pen (draw on the phone, it appears on the laptop). |
| Both ways | Four beats between a laptop and a phone: the clipboard, a text answered from the laptop, a file, ringing the phone. |
| Together | Two screens, a window crossing the seam: one keyboard and mouse across computers, one's screen in a window on another, windows carried across. |
| Anywhere | Home Wi-Fi, Tailscale, then the internet: iroh's path through both routers, with the relay as the fallback. |
| Yours alone | Pairing by QR code (a real one: it opens the source), then per-phone switches, ask-first sessions, private copies. |
| For your terminal | `pocketdesk done`, `ask` and `link`, with the phone answering beside the terminal. |
| New in 0.9.0 | A grid of the release's features: phone apps on the computer, the webcam, approving with the phone, and the rest. |
| Open source, Download, Questions | The README's comparison, downloads from the latest release (and the AUR), the FAQ. |
| Finale | The phone drops into the pocket and becomes the logo. |

Every claim about Pocketdesk on the page comes from the main repository's README. The names, files and
timings inside the scenes (Maya, `holiday.mp4`, a 41.2 s build) are illustrations.

## How it is built

- **Motion**: GSAP ScrollTrigger scrubs each scene from a CSS `position: sticky` stage; Lenis smooths the
  scroll. `index.html` marks `html.motion` before the first paint; without it (reduced motion, or no
  script) every scene is a still layout with the same words.
- **Prerendering**: `npm run build` renders the page into `dist/index.html` (`scripts/prerender.mjs`), so
  the copy is in the HTML before any script runs.
- **Downloads**: one request to GitHub's API for the latest release (`src/lib/release.ts`). The Windows
  installer and the `.deb` come first when a release has them, the `.zip` and `.tar.gz` otherwise; with no
  answer, every button goes to the releases page.
- **Fonts**: Funnel Display, Funnel Sans, JetBrains Mono and Outfit (the wordmark), self-hosted. The page
  asks no font service and runs no analytics.
- **Brand**: colours and the mark from `assets/brand` in the main repository (`src/components/Mark.tsx`).

## Work on it

```sh
npm ci
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests on the production build (Playwright, with Chrome)
npm run build      # dist/, prerendered
```

## The film

`public/video/pocketdesk-film.mp4` (36 s, 1080p) is made with [HyperFrames](https://hyperframes.heygen.com)
from the site's own components: `src/film` draws each scene, `scripts/build-film.mjs` renders them into
`video/compositions`, and each scene's timeline is in `video/src`. `video/SPEC.md` is its brief and
`video/REVIEW.md` its notes. To rebuild it, put the sound effects listed in `video/assets/SOUNDS.md` in
place, then:

```sh
npm run film
```

## Publishing

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`);
pull requests run the tests (`.github/workflows/ci.yml`). In the repository's **Settings → Pages**, the
source is **GitHub Actions**.
