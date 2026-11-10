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

