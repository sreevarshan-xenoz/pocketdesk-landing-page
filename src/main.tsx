import '@fontsource-variable/funnel-display'
import '@fontsource-variable/funnel-sans'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/outfit'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

// Tells index.html's fallback that the scroll scenes will run.
;(window as Window & { __pdReady?: boolean }).__pdReady = true

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The build prerenders the page into #root; the dev server leaves only a comment there.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
