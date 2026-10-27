# Pocketdesk, the film

GOAL:    a stranger knows, in 36 seconds, that Pocketdesk puts their computer on their Android phone and
         carries everything else between the two, from anywhere, and wants the download.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps.
TIME:    36 s x 30 = 1080 frames. No music bed (no music source on this machine); sound effects only,
         each on a visible action.
LOOK:    the site's own visual system, drawn by the site's own components (scripts/build-film.mjs renders
         src/film to HTML). Ground: the brand's navy as a studio sweep, #121d4a at the wall to #060a1c at
         the floor; a 0.55 contact shadow under each device. Ink #eef1fb; one accent, #74b6ff, on one word
         a title. Display: Funnel Display 600, 92 px (8.5% of the height), -4.5% tracking; body Funnel Sans;
         terminals JetBrains Mono at 30 px when read. The medium is product UI at full size: a desktop at
         1600x900 scaled to the frame, the phone at 2056x956.
OBJECTS: a desktop (night-ridge wallpaper, a terminal running cargo build, an editor open on
         core/src/streaming/bitrate.rs, a music player); an Android phone (punch-hole camera, keys on the
         edge, lock screen with notifications); a laptop; a map of home and away with two routers and a
         relay; the brand's mark (window in a pocket) and wordmark.
MOTION:  arrivals expo.out / power3.out with a 10 px blur in 0.35 s; camera power3.inOut; exits power2.in
         or power3.in. Titles land and hold dead still, then blur out in 0.2 s.
SHOTS:
  0-12 s    desk: the desktop fills the frame and finishes a build; "Your desktop."; the camera pulls back
            2 s until the desktop is a phone's screen; "In your pocket."; push in; a thumb drags the pointer
            to the music player and taps it; it plays. Sound: keys, a short whoosh on the pull back, a tap.
  12-20 s   both: the phone turns upright beside a laptop sliding in; a text lands on the phone, crosses,
            and is answered from the laptop's toast (punch-in to 1.8x while typed); then a 1.8 GB file
            crosses with the same percentage on both screens and is checked. Whip out.
  20-25.5 s anywhere: whip in to the map; the phone leaves home; the road draws through both routers, each
            lit as it passes; the relay fades in as the fallback; packets both ways; zoom into the laptop.
  25.5-31 s scripts: the laptop's screen colour clears to a terminal; pocketdesk ask types; the phone comes
            up with the question; a thumb answers Yes; the terminal prints yes. The phone is carried on.
  31-36 s   pocket: the phone shrinks into the brand's window, which drops into the pocket (impact); the
            mark steps aside and the name wipes in; "Your desktop. Anywhere."; the Download button.
BANNED:  a dark void with small things floating; glow, particles; glass cards; everything centred; every
         element fading and sliding up; text that moves while read; three cards in a row; the logo docked
         in a corner; mockup UI with placeholder bars (the old film's tell).
QA:      0.3 s a full desktop with real text; 6 s the whole phone under "In your pocket."; 15 s the reply
         readable in the toast; 22.75 s the road through both routers; 29.6 s yes in the terminal and the
         green Yes; 34.5 s the lockup and the button.
