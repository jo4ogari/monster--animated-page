"use strict";

const flavors = window.MONSTER_FLAVORS;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const elements = {
  root: document.documentElement,
  track: document.querySelector("#scroll-track"),
  video: document.querySelector("#hero-video"),
  videoStatus: document.querySelector("#video-status"),
  progress: document.querySelector("#video-progress-bar"),
  content: document.querySelector("#product-content"),
  eyebrow: document.querySelector("#flavor-eyebrow"),
  name: document.querySelector("#flavor-name"),
  description: document.querySelector("#flavor-description"),
  detail: document.querySelector("#flavor-detail"),
  price: document.querySelector("#flavor-price"),
  purchaseName: document.querySelector("#purchase-name"),
  buy: document.querySelector("#buy-button"),
  currentIndex: document.querySelector("#current-index"),
  tabs: document.querySelector("#flavor-tabs"),
  particles: document.querySelector("#particles"),
  announcement: document.querySelector("#flavor-announcement"),
};

let activeIndex = 0;
let pointerStartX = null;
let pointerCurrentX = null;
let pendingSeekIndex = null;
let scrollFrameRequested = false;
let isScrollScrubbing = false;
let resumePlaybackTimer = null;

function setPalette(flavor) {
  elements.root.style.setProperty("--background", flavor.palette.background);
  elements.root.style.setProperty("--light", flavor.palette.light);
  elements.root.style.setProperty("--accent", flavor.palette.accent);
  elements.root.style.setProperty("--accent-soft", flavor.palette.accentSoft);
  flavor.palette.particleColors.forEach((color, index) => {
    elements.root.style.setProperty(`--particle-${index}`, color);
  });
}

function renderFlavor(index, announce = true) {
  const nextIndex = (index + flavors.length) % flavors.length;
  if (nextIndex === activeIndex && elements.name.textContent) return;
  activeIndex = nextIndex;
  const flavor = flavors[activeIndex];

  setPalette(flavor);
  elements.eyebrow.textContent = flavor.eyebrow;
  elements.name.textContent = flavor.shortName;
  elements.description.textContent = flavor.description;
  elements.detail.textContent = flavor.detail;
  elements.price.textContent = window.formatMonsterPrice(flavor.price);
  elements.purchaseName.textContent = flavor.shortName;
  elements.buy.href = `./checkout.html?flavor=${encodeURIComponent(flavor.id)}`;
  elements.buy.setAttribute("aria-label", `Comprar ${flavor.name} por ${window.formatMonsterPrice(flavor.price)}`);
  elements.currentIndex.textContent = String(activeIndex + 1).padStart(2, "0");

  [...elements.tabs.children].forEach((tab, tabIndex) => {
    const selected = tabIndex === activeIndex;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  if (!reducedMotion.matches) {
    elements.content.animate(
      [
        { opacity: .18, filter: "blur(4px)" },
        { opacity: 1, filter: "blur(0)" },
      ],
      { duration: 560, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }

  if (announce) elements.announcement.textContent = `${flavor.name} selecionado.`;
}

function seekToFlavor(index) {
  const nextIndex = (index + flavors.length) % flavors.length;
  renderFlavor(nextIndex);
  const maxScroll = Math.max(1, elements.track.offsetHeight - window.innerHeight);
  const trackTop = elements.track.offsetTop;
  const segmentCenter = (nextIndex + .5) / flavors.length;
  window.scrollTo({
    top: trackTop + maxScroll * segmentCenter,
    behavior: reducedMotion.matches ? "auto" : "smooth",
  });
  pendingSeekIndex = Number.isFinite(elements.video.duration) ? null : nextIndex;
}

function syncVideoWithScroll() {
  const maxScroll = Math.max(1, elements.track.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, (window.scrollY - elements.track.offsetTop) / maxScroll));
  elements.progress.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  const syncedIndex = Math.min(flavors.length - 1, Math.floor(progress * flavors.length));
  renderFlavor(syncedIndex, false);
  elements.videoStatus.textContent = `Scroll ${Math.round(progress * 100)}%`;

  if (Number.isFinite(elements.video.duration) && elements.video.duration > 0) {
    isScrollScrubbing = true;
    elements.video.pause();
    const targetTime = progress * Math.max(0, elements.video.duration - .04);
    if (Math.abs(elements.video.currentTime - targetTime) > .025) {
      elements.video.currentTime = targetTime;
    }

    window.clearTimeout(resumePlaybackTimer);
    resumePlaybackTimer = window.setTimeout(() => {
      isScrollScrubbing = false;
      if (!reducedMotion.matches) elements.video.play().catch(() => {});
    }, 180);
  }
}

function syncInterfaceWithPlayback() {
  if (isScrollScrubbing || !Number.isFinite(elements.video.duration) || elements.video.duration <= 0) return;
  const progress = elements.video.currentTime / elements.video.duration;
  elements.progress.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  renderFlavor(Math.min(flavors.length - 1, Math.floor(progress * flavors.length)), false);
  elements.videoStatus.textContent = "Em reprodução";
}

function requestScrollSync() {
  if (scrollFrameRequested) return;
  scrollFrameRequested = true;
  requestAnimationFrame(() => {
    syncVideoWithScroll();
    scrollFrameRequested = false;
  });
}

function createTabs() {
  const fragment = document.createDocumentFragment();
  flavors.forEach((flavor, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "flavor-tab";
    button.setAttribute("role", "tab");
    button.innerHTML = `<span>0${index + 1}</span><strong>${flavor.shortName}</strong>`;
    button.setAttribute("aria-label", `Ver ${flavor.name}`);
    button.addEventListener("click", () => seekToFlavor(index));
    fragment.append(button);
  });
  elements.tabs.append(fragment);
}

function createParticles() {
  const positions = [[12,12,3],[82,17,2],[72,38,4],[18,58,2],[88,69,3],[61,84,2],[28,88,3]];
  const fragment = document.createDocumentFragment();
  positions.forEach(([left, top, size], index) => {
    const particle = document.createElement("i");
    particle.dataset.color = String(index % 3);
    particle.style.cssText = `left:${left}%;top:${top}%;width:${size}px;height:${size}px;animation-delay:${index * .28}s`;
    fragment.append(particle);
  });
  elements.particles.append(fragment);
}

elements.video.addEventListener("loadedmetadata", () => {
  if (pendingSeekIndex !== null) seekToFlavor(pendingSeekIndex);
  syncInterfaceWithPlayback();
  if (!reducedMotion.matches) elements.video.play().catch(() => {});
});
elements.video.addEventListener("timeupdate", syncInterfaceWithPlayback);

elements.video.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
  pointerCurrentX = event.clientX;
  elements.video.setPointerCapture(event.pointerId);
});
elements.video.addEventListener("pointermove", (event) => {
  if (pointerStartX !== null) pointerCurrentX = event.clientX;
});
elements.video.addEventListener("pointerup", () => {
  if (pointerStartX === null) return;
  const offset = pointerCurrentX - pointerStartX;
  if (Math.abs(offset) > 45) seekToFlavor(activeIndex + (offset < 0 ? 1 : -1));
  pointerStartX = null;
  pointerCurrentX = null;
});
elements.video.addEventListener("pointercancel", () => {
  pointerStartX = null;
  pointerCurrentX = null;
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") seekToFlavor(activeIndex + 1);
  if (event.key === "ArrowLeft") seekToFlavor(activeIndex - 1);
});

window.addEventListener("scroll", requestScrollSync, { passive: true });
window.addEventListener("resize", requestScrollSync);

createTabs();
createParticles();
renderFlavor(0, false);
if (reducedMotion.matches) elements.video.pause();
else elements.video.play().catch(() => {});
