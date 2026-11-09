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

// Gallery + lightbox
PHOTOS.forEach((p) => {
  const btn = document.createElement("button");
  btn.innerHTML = `<img loading="lazy" alt="${p.caption}">`;
  btn.querySelector("img").src = `images/${p.file}`;
  btn.addEventListener("click", () => {
    lightboxImg.src = `images/${p.file}`;
    lightboxImg.alt = p.caption;
    lightbox.showModal();
  });
  grid.appendChild(btn);
});
document.getElementById("close").addEventListener("click", () => lightbox.close());

// ---------------------------------------------------------------
// Background music: The O'Jays – "Family Reunion" (YouTube).
// Browsers don't allow sound to start by itself, so it plays when
// a visitor taps the music button. To change the song, replace the
// video ID below (the part after youtu.be/ in a YouTube link).
// ---------------------------------------------------------------
const MUSIC_VIDEO_ID = "i6zsg2GbLqc";

const musicBtn = document.getElementById("music-btn");
const musicPanel = document.getElementById("music-panel");
let ytPlayer = null;

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();
    window.onYouTubeIframeAPIReady = resolve;
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
}

function showMusicFallback() {
  document.querySelector(".music-player").innerHTML =
    `<p class="music-fallback">This song can't play here.<br>
     <a href="https://youtu.be/${MUSIC_VIDEO_ID}" target="_blank" rel="noopener">Listen on YouTube</a></p>`;
}

musicBtn.addEventListener("click", async () => {
  musicBtn.hidden = true;
  musicPanel.hidden = false;
  musicBtn.setAttribute("aria-expanded", "true");
  if (ytPlayer) { ytPlayer.playVideo(); return; }
  await loadYouTubeApi();
  ytPlayer = new YT.Player("yt-player", {
    videoId: MUSIC_VIDEO_ID,
    playerVars: { autoplay: 1, loop: 1, playlist: MUSIC_VIDEO_ID, playsinline: 1, rel: 0 },
    events: {
      onReady: (e) => { e.target.setVolume(60); e.target.playVideo(); },
      onError: showMusicFallback,
    },
  });
});

document.getElementById("music-close").addEventListener("click", () => {
  if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  musicPanel.hidden = true;
  musicBtn.hidden = false;
  musicBtn.setAttribute("aria-expanded", "false");
});
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
