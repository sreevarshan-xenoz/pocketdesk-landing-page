import { useEffect } from 'react'
import { initMotion } from './lib/motion'

export default function App() {
  useEffect(() => initMotion(), [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <h1>
          Your desktop.
          <br />
          In your pocket.
        </h1>
      </main>
    </>
  )
}
