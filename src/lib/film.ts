/**
 * The launch film (video/ in this repository holds its source). The paths are relative to the
 * page, written out rather than taken from Vite's BASE_URL: that is './' in the browser but '/'
 * in the prerender, which would send the prerendered poster to the domain's root on Pages.
 */
export const FILM = {
  src: './video/pocketdesk-film.mp4',
  poster: './video/pocketdesk-film.jpg',
  length: '0:36',
}
