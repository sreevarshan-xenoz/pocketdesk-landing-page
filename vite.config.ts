import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Relative asset paths, so the build works under the Pages project path
// (/pocketdesk-landing-page/) and on a custom domain alike.
export default defineConfig({
  base: './',
  plugins: [react()],
  // GSAP and Lenis ship ESM that Node will not load bare; bundle them into the prerender build.
  ssr: { noExternal: ['gsap', '@gsap/react', 'lenis'] },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
