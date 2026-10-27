import { useEffect, useState } from 'react'
import { FilmModal } from './components/FilmModal'
import { Nav } from './components/Nav'
import { initMotion } from './lib/motion'
import { Hero } from './sections/Hero'

export default function App() {
  const [film, setFilm] = useState(false)
  useEffect(() => initMotion(), [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero onWatchFilm={() => setFilm(true)} />
        <div style={{ height: '120vh' }} />
      </main>
      <FilmModal open={film} onClose={() => setFilm(false)} />
    </>
  )
}
