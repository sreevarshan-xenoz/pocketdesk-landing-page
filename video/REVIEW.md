# Notes on the film

## The cut
- Storyline A, *Into the pocket* (STORYLINES.md), 36 s. B and C are written down, not made.
- Every frame comes from the site's own components (src/film, rendered by scripts/build-film.mjs), so
  the film shows the page's desktop, phone and laptop with real text: real commands, the real
  `slow_link_fps` from core/src/streaming/bitrate.rs, the real ports.
- Sound effects only, each on a visible action: keys, taps, whooshes on the camera moves and the whip,
  notification sounds, two router clicks, an impact on the mark. There is no music bed yet; to add one,
  put a track in assets/ and an `<audio>` in index.html, around volume 0.3 under the effects.

## Checks
- `hyperframes check` passes: layout, motion, contrast and audio. Warnings kept on purpose:
  `dead_stretch` at 20.75–24.63 s is the map, which moves throughout but is excluded from the layout
  audit (a diagram, its small labels are texture); `text_below_floor` is the terminal's 13 px title bar.
- The cut at 12 s matches on both sides (the second scene's phone starts exactly as the first ends).
- The sound's hits land on their pictures in the render: keys 0.55–1.45 s, the tap at 10.1 s, the
  router clicks at 22.1 and 22.4 s, the mark's impact peaking at 32.27 s.

## Next
The map (20–25.5 s) is the quietest shot: it could push in on the routers as the road punches
through, and give the phone's trip a little more distance.
