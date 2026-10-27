// Pocketdesk landing page: theme, reveals, the hero window's tilt, the
// latency chart, the video's sound, and links to the latest release.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var REPO = "sreevarshan-xenoz/Pocketdesk";

  // ---- Theme ----
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  var themeBtn = document.getElementById("theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("pd-theme", next); } catch (e) {}
    });
  }

  // ---- Nav background once scrolled ----
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll, staggered within each parent ----
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  reveals.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i, 6) * 0.08 + "s");
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---- The hero window straightens as it scrolls into view ----
  var win = document.querySelector(".window");
  var stage = document.querySelector(".stage");
  if (win && stage && !reduceMotion) {
    var ticking = false;
    var update = function () {
      ticking = false;
      if (window.innerWidth <= 680) {
        win.style.removeProperty("--tilt");
        win.style.removeProperty("--scale");
        return;
      }
      var r = stage.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 when the stage's top is at the bottom of the screen, 1 at 30% from the top.
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      win.style.setProperty("--tilt", (8 * (1 - p)).toFixed(2) + "deg");
      win.style.setProperty("--scale", (0.94 + 0.06 * p).toFixed(3));
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---- Pointer light on cards ----
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // ---- The launch video: plays while on screen, sound on request ----
  var video = document.getElementById("launch");
  var soundBtn = document.getElementById("sound");
  if (video) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var played = video.play();
            if (played && played.catch) played.catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.25 }).observe(video);
    } else {
      video.controls = true;
    }
  }
  if (video && soundBtn) {
    soundBtn.addEventListener("click", function () {
      var on = video.muted;
      video.muted = !on;
      if (on) {
        // Sound on starts it from the top, the way it was cut.
        video.currentTime = 0;
        var played = video.play();
        if (played && played.catch) played.catch(function () {});
      }
      soundBtn.setAttribute("aria-pressed", String(on));
      soundBtn.setAttribute("aria-label", on ? "Turn the video's sound off" : "Turn the video's sound on");
    });
  }

  // ---- Latency chart: a live-looking trace around 18-24 ms ----
  var line = document.querySelector(".latency__line");
  var area = document.querySelector(".latency__area");
  var readout = document.querySelector("[data-latency]");
  if (line && area) {
    var W = 300, H = 90, N = 40;
    var points = [];
    var value = 20;
    var next = function () {
      value += (Math.random() - 0.5) * 3.2;
      value += (20 - value) * 0.18;
      return Math.max(15, Math.min(27, value));
    };
    for (var k = 0; k < N; k++) points.push(next());
    var draw = function () {
      var step = W / (N - 1);
      var y = function (v) { return H - ((v - 10) / 22) * H; };
      var d = "M0 " + y(points[0]).toFixed(1);
      for (var j = 1; j < N; j++) {
        var x0 = (j - 1) * step, x1 = j * step;
        var cx = (x0 + x1) / 2;
        d += " C" + cx.toFixed(1) + " " + y(points[j - 1]).toFixed(1) + " " + cx.toFixed(1) + " " + y(points[j]).toFixed(1) + " " + x1.toFixed(1) + " " + y(points[j]).toFixed(1);
      }
      line.setAttribute("d", d);
      area.setAttribute("d", d + " L" + W + " " + H + " L0 " + H + " Z");
      if (readout) readout.textContent = Math.round(points[N - 1]);
    };
    draw();
    if (!reduceMotion) {
      setInterval(function () {
        if (document.hidden) return;
        points.shift();
        points.push(next());
        draw();
      }, 700);
    }
  }

  // ---- Highlight the visitor's platform ----
  var ua = navigator.userAgent || "";
  var os = /Android/i.test(ua) ? "android" : /Windows/i.test(ua) ? "windows" : /Linux|X11/i.test(ua) ? "linux" : "";
  if (os) {
    var card = document.querySelector('.dl[data-os="' + os + '"]');
    if (card) card.classList.add("is-you");
    var label = { windows: "Download for Windows", linux: "Download for Linux", android: "Get the Android app" }[os];
    var heroBtn = document.querySelector("#hero-download span");
    if (heroBtn && label) heroBtn.textContent = label;
  }

  // ---- Latest release: version label and direct download links ----
  function formatSize(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";
  }
  if (window.fetch) {
    fetch("https://api.github.com/repos/" + REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (release) {
        if (!release || !release.tag_name) return;
        var labelEl = document.getElementById("release-label");
        if (labelEl) labelEl.textContent = release.tag_name + " is out";
        var note = document.getElementById("release-note");
        if (note && release.published_at) {
          var date = new Date(release.published_at);
          note.textContent = "Pocketdesk " + release.tag_name + ", released " +
            date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) +
            ". Every download comes from GitHub, with SHA-256 checksums alongside.";
        }
        (release.assets || []).forEach(function (asset) {
          document.querySelectorAll("[data-asset]").forEach(function (a) {
            if (asset.name.indexOf(a.dataset.asset) !== -1) {
              a.href = asset.browser_download_url;
              var meta = document.querySelector('[data-meta="' + a.dataset.asset + '"]');
              if (meta) {
                meta.textContent = meta.textContent.split(" · ")[0] + " · " + formatSize(asset.size);
                meta.title = asset.name;
              }
            }
          });
        });
      })
      .catch(function () { /* The links fall back to the releases page. */ });
  }
})();
