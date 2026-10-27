# Review

## Calls made
- Built storyline A, *Into the pocket* (STORYLINES.md); B (a day away from the desk) and C (the type
  does the arguing) are written down, not built.
- Every frame is drawn by the site's own components (src/film, rendered by scripts/build-film.mjs), so
  the film shows the same desktop, phone and laptop as the page, with real text: real commands, the
  real `slow_link_fps` from core/src/streaming/bitrate.rs, real port numbers.
- No music bed: this machine has no music source (no HeyGen sign-in, no local model). Sound effects
  only, each on a visible action: keys, taps, whooshes on camera moves and the whip, notification
  sounds, two router clicks, an impact on the mark. Add a bed by dropping a track into assets/ and an
  `<audio>` into index.html (volume around 0.3 under these effects).

## Measured, and looked at
- `hyperframes check`: passes (layout, motion, contrast, audio). Kept warnings: `dead_stretch` at
  20.75–24.63 s is the map, which moves the whole time but is marked `data-layout-ignore` (a diagram,
  so its small labels are texture); `text_below_floor` is the terminal window's own 13 px title bar;
  `duplicate_audio_track` and `negative_z_index` come from reused effects and the site's CSS.
- Looked at: the review sheets (beats, every cut, phone width), and a frame sheet of the rendered MP4.
  The cut at 12 s was jumping (the second scene's phone showed other content); fixed so both sides match.
- `hyperframes audio` on the render: hits land on their pictures (keys 0.55–1.45 s, tap 10.1 s, router
  clicks 22.1 and 22.4 s, the mark's impact peaking at 32.27 s). Measured, not heard.

## Weakest shot
The map (20–25.5 s): clear, but small inside the frame and diagrammatic. With more time it would push in
on the routers as the road punches through, and the phone would travel with a little more distance.
