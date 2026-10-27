import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds the film's stylesheet (`vite build`) and its scene renderer (`vite build --ssr`)
// with the same CSS module names, for scripts/build-film.mjs.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  logLevel: 'warn',
  build: isSsrBuild
    ? { outDir: 'dist-film-ssr', emptyOutDir: true }
    : {
        outDir: 'dist-film',
        emptyOutDir: true,
        cssCodeSplit: false,
        lib: { entry: 'src/film/styles.ts', formats: ['es'], fileName: 'film', cssFileName: 'film' },
      },
  ssr: { noExternal: ['gsap', '@gsap/react', 'lenis'] },
}))
