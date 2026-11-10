// ---------------------------------------------------------------
// To add a photo: put the .jpg in the images/ folder and add a
// line below with its file name and a caption.
// ---------------------------------------------------------------
const PHOTOS = [
  { file: "photo-7.jpg",  caption: "Robinson Family Reunion 2026" },
  { file: "photo-2.jpg",  caption: "Varnville, SC · 2026" },
  { file: "photo-1.jpg",  caption: "Dancing with the little one" },
  { file: "photo-6.jpg",  caption: "The elders leading the song" },
  { file: "photo-5.jpg",  caption: "Cousins catching up" },
  { file: "photo-3.jpg",  caption: "All smiles" },
  { file: "photo-8.jpg",  caption: "Love Comes Easy!" },
  { file: "photo-4.jpg",  caption: "Family selfie" },
  { file: "photo-12.jpg", caption: "New Orleans · Jackson Square" },
  { file: "photo-13.jpg", caption: "The whole crew in the French Quarter" },
  { file: "photo-17.jpg", caption: "On the steps in New Orleans" },
  { file: "photo-14.jpg", caption: "New Orleans memories" },
  { file: "photo-15.jpg", caption: "New Orleans memories" },
  { file: "photo-18.jpg", caption: "New Orleans memories" },
  { file: "photo-16.jpg", caption: "Riding the tour bus" },
  { file: "photo-11.jpg", caption: "A night out in the Quarter" },
  { file: "photo-9.jpg",  caption: "Around town" },
  { file: "photo-10.jpg", caption: "Around town" },
  { file: "photo-23.jpg", caption: "11th Reunion · Washington, D.C. · 2019" },
  { file: "photo-34.jpg", caption: "Robinson Family Reunion 2019" },
  { file: "photo-29.jpg", caption: "Family by the river" },
  { file: "photo-31.jpg", caption: "The elders" },
  { file: "photo-30.jpg", caption: "The young cousins" },
  { file: "photo-20.jpg", caption: "The ladies in red" },
  { file: "photo-22.jpg", caption: "Little cousins by the river" },
  { file: "photo-21.jpg", caption: "Snuggles with the baby" },
  { file: "photo-32.jpg", caption: "Roller skating fun" },
  { file: "photo-19.jpg", caption: "Seafood at Captain White's" },
  { file: "photo-24.jpg", caption: "Dressed in yellow" },
  { file: "photo-33.jpg", caption: "All smiles in yellow" },
  { file: "photo-25.jpg", caption: "Dinner night" },
  { file: "photo-26.jpg", caption: "Dinner night" },
  { file: "photo-27.jpg", caption: "Dinner night" },
  { file: "photo-28.jpg", caption: "Dinner night" },
  { file: "photo-35.jpg", caption: "Cookout · Varnville, SC · 2023" },
  { file: "photo-36.jpg", caption: "Serving up the food · 2023" },
  { file: "photo-37.jpg", caption: "Love Will Keep Us Together · 2023" },
  { file: "photo-42.jpg", caption: "The ladies of 2023 · Varnville, SC" },
  { file: "photo-50.jpg", caption: "The young cousins · 2023" },
  { file: "photo-39.jpg", caption: "Love Will Keep Us Together" },
  { file: "photo-43.jpg", caption: "All smiles at night" },
  { file: "photo-44.jpg", caption: "Sun hats and smiles" },
  { file: "photo-45.jpg", caption: "Cousins under the carport" },
  { file: "photo-46.jpg", caption: "Family on the porch" },
  { file: "photo-47.jpg", caption: "Front porch selfie" },
  { file: "photo-40.jpg", caption: "Hanging out in the yard" },
  { file: "photo-38.jpg", caption: "Big hugs" },
  { file: "photo-41.jpg", caption: "Dinner under the trees" },
  { file: "photo-49.jpg", caption: "Pretty in florals" },
  { file: "photo-48.jpg", caption: "Still repping the 11th reunion" },
];

const INTERVAL_MS = 5000;

const slidesEl = document.getElementById("slides");
const captionEl = document.getElementById("caption");
const counterEl = document.getElementById("counter");
const playBtn = document.getElementById("play");
const grid = document.getElementById("grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let current = 0;
let timer = null;
let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Build slides
const slides = PHOTOS.map((p, i) => {
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.setAttribute("role", "group");
  slide.setAttribute("aria-label", `${i + 1} of ${PHOTOS.length}`);
  const src = `images/${p.file}`;
  slide.innerHTML = `<div class="bg"></div><img alt="${p.caption}" ${i < 2 ? "" : 'loading="lazy"'}>`;
  slide.querySelector("img").src = src;
  slide.querySelector(".bg").style.backgroundImage = `url("${src}")`;
  slidesEl.appendChild(slide);
  return slide;
});

function show(i) {
  slides[current].classList.remove("active");
  current = (i + PHOTOS.length) % PHOTOS.length;
  slides[current].classList.add("active");
  captionEl.textContent = PHOTOS[current].caption;
  counterEl.textContent = `${current + 1} / ${PHOTOS.length}`;
}

function restart() {
  clearInterval(timer);
  if (playing) timer = setInterval(() => show(current + 1), INTERVAL_MS);
  playBtn.textContent = playing ? "❚❚" : "▶";
  playBtn.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
}

document.getElementById("prev").addEventListener("click", () => { show(current - 1); restart(); });
document.getElementById("next").addEventListener("click", () => { show(current + 1); restart(); });
playBtn.addEventListener("click", () => { playing = !playing; restart(); });

document.addEventListener("keydown", (e) => {
  if (lightbox.open) return;
  if (e.key === "ArrowLeft") { show(current - 1); restart(); }
  if (e.key === "ArrowRight") { show(current + 1); restart(); }
});

// Swipe on phones
let touchX = null;
slidesEl.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
slidesEl.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); restart(); }
  touchX = null;
});

show(0);
restart();

// ---------------------------------------------------------------
// Photo gallery, grouped by reunion (accordion). To add a photo to a
// section, add its file name to that section's list below.
// ---------------------------------------------------------------
const ALBUMS = [
  { title: "Varnville, South Carolina", tag: "2026", note: "Cream reunion shirts",
    files: ["photo-7.jpg", "photo-2.jpg", "photo-1.jpg", "photo-6.jpg", "photo-5.jpg", "photo-3.jpg", "photo-8.jpg", "photo-4.jpg"] },
  { title: "New Orleans, Louisiana", tag: "15th Reunion", note: "Green, purple and yellow shirts",
    files: ["photo-12.jpg", "photo-13.jpg", "photo-17.jpg", "photo-14.jpg", "photo-15.jpg", "photo-18.jpg", "photo-16.jpg", "photo-11.jpg", "photo-9.jpg", "photo-10.jpg"] },
  { title: "Varnville, South Carolina", tag: "2023", note: "White shirts in the backyard",
    files: ["photo-42.jpg", "photo-35.jpg", "photo-36.jpg", "photo-37.jpg", "photo-50.jpg", "photo-39.jpg", "photo-43.jpg", "photo-44.jpg", "photo-45.jpg", "photo-46.jpg", "photo-47.jpg", "photo-40.jpg", "photo-38.jpg", "photo-41.jpg", "photo-49.jpg", "photo-48.jpg"] },
  { title: "Washington, D.C.", tag: "11th Reunion · 2019", note: "Red shirts",
    files: ["photo-23.jpg", "photo-34.jpg", "photo-29.jpg", "photo-31.jpg", "photo-30.jpg", "photo-20.jpg", "photo-22.jpg", "photo-21.jpg", "photo-32.jpg", "photo-19.jpg", "photo-24.jpg", "photo-33.jpg", "photo-25.jpg", "photo-26.jpg", "photo-27.jpg", "photo-28.jpg"] },
];

const captionFor = Object.fromEntries(PHOTOS.map((p) => [p.file, p.caption]));

ALBUMS.forEach((album, idx) => {
  const details = document.createElement("details");
  details.className = "album";
  if (idx === 0) details.open = true;
  details.innerHTML = `
    <summary>
      <span class="album-cover"><img alt="" loading="lazy"></span>
      <span class="album-text">
        <span class="album-tag"></span>
        <span class="album-title"></span>
        <span class="album-note"></span>
      </span>
      <span class="album-count"></span>
      <span class="album-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div class="album-grid"></div>`;
  details.querySelector(".album-cover img").src = `images/${album.files[0]}`;
  details.querySelector(".album-tag").textContent = album.tag;
  details.querySelector(".album-title").textContent = album.title;
  details.querySelector(".album-note").textContent = album.note;
  details.querySelector(".album-count").textContent = `${album.files.length} photos`;
  const albumGrid = details.querySelector(".album-grid");
  album.files.forEach((file) => {
    const caption = captionFor[file] || album.title;
    const btn = document.createElement("button");
    btn.innerHTML = `<img loading="lazy">`;
    const img = btn.querySelector("img");
    img.src = `images/${file}`;
    img.alt = caption;
    btn.setAttribute("aria-label", caption);
    btn.addEventListener("click", () => {
      lightboxImg.src = `images/${file}`;
      lightboxImg.alt = caption;
      lightbox.showModal();
    });
    albumGrid.appendChild(btn);
  });
  grid.appendChild(details);
});
document.getElementById("close").addEventListener("click", () => lightbox.close());

// ---------------------------------------------------------------
// Background music: The O'Jays – "Family Reunion" (the video at the top).
// Browsers block sound until a visitor interacts with the page, so the
// song starts on the first tap/click anywhere and keeps playing while
// they scroll. The ♪ button in the corner pauses or resumes it.
// ---------------------------------------------------------------
(function backgroundMusic() {
  const toggle = document.getElementById("music-toggle");
  let player = null;
  let ready = false;
  let userPaused = false;   // visitor chose to stop the music
  let started = false;

  function setButton(playing) {
    toggle.textContent = playing ? "❚❚ Pause music" : "♪ Play music";
    toggle.setAttribute("aria-pressed", String(playing));
  }

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("yt-music", {
      events: {
        onReady: () => { ready = true; toggle.hidden = false; player.setVolume(70); },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) { started = true; setButton(true); }
          if (e.data === YT.PlayerState.PAUSED) setButton(false);
          if (e.data === YT.PlayerState.ENDED) player.playVideo(); // keep looping
        },
      },
    });
  };
  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(api);

  // Start the song on the visitor's first tap, click or key press.
  function firstInteraction(e) {
    if (e.target === toggle) return; // the button handles itself
    if (!ready || started || userPaused) return;
    player.playVideo();
  }
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    document.addEventListener(ev, firstInteraction, { passive: true })
  );

  toggle.addEventListener("click", () => {
    if (!ready) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      userPaused = true;
      player.pauseVideo();
    } else {
      userPaused = false;
      player.playVideo();
    }
  });
})();

