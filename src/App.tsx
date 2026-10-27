import { useEffect, useState } from 'react'
import { FilmModal } from './components/FilmModal'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { initMotion } from './lib/motion'
import { Anywhere } from './sections/Anywhere'
import { BothWays } from './sections/BothWays'
import { Control } from './sections/Control'
import { Download } from './sections/Download'
import { Faq } from './sections/Faq'
import { Finale } from './sections/Finale'
import { Hero } from './sections/Hero'
import { OpenSource } from './sections/OpenSource'
import { Private } from './sections/Private'
import { Scripts } from './sections/Scripts'

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
        <Control />
        <BothWays />
        <Anywhere />
        <Private />
        <Scripts />
        <OpenSource />
        <Download />
        <Faq />
        <Finale />
      </main>
      <Footer />
      <FilmModal open={film} onClose={() => setFilm(false)} />
    </>
  )
}
