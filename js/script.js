"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initSliderWithMap();
});

/* Google Maps callback must be global */
window.initMap = function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const veBounds = new google.maps.LatLngBounds(
    { lat: 0, lng: -74 },
    { lat: 16, lng: -59 }
  );

  const map = new google.maps.Map(mapEl, {
    center: { lat: 6.5, lng: -66.5 },
    zoom: 6,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  });

  map.fitBounds(veBounds);

  const marker = new google.maps.Marker({
    map,
    position: { lat: 6.5, lng: -66.5 },
    title: "Venezuela",
  });

  const info = new google.maps.InfoWindow();

  // Save refs for slider
  window.__veMap = map;
  window.__veMarker = marker;
  window.__veInfo = info;

  // FIX 1: Once the map is ready, immediately sync it with whichever slide is active.
  // This handles the race condition where the slider initializes before Google Maps loads.
  if (typeof window.__veUpdateMap === "function") {
    window.__veUpdateMap();
  }
};

function initSliderWithMap() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");

  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  const places = {
    angel:   { name: "Salto Ángel",      pos: { lat: 5.9672,   lng: -62.5347  } },
    bolivar: { name: "Pico Bolívar",     pos: { lat: 8.54066,  lng: -71.04635 } },
    medanos: { name: "Médanos de Coro",  pos: { lat: 11.60642, lng: -69.73763 } },
    roques:  { name: "Los Roques",       pos: { lat: 11.8545,  lng: -66.7545  } },
  };

  let index = 0;

  // FIX 2: Force every slide to be exactly the same width as the track container.
  // This prevents multiple images from showing side-by-side.
  function syncSlideWidths() {
    const w = track.parentElement.offsetWidth;
    slides.forEach((slide) => {
      slide.style.flex = "0 0 " + w + "px";
      slide.style.width = w + "px";
    });
    // Re-apply transform after resize so the active slide stays visible.
    track.style.transform = `translateX(-${index * w}px)`;
  }

  // Run once on init and again if the window is resized.
  syncSlideWidths();
  window.addEventListener("resize", syncSlideWidths);

  function updateSlider() {
    const w = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${index * w}px)`;
    updateMapFromSlide();
  }

  function updateMapFromSlide() {
    const slide = slides[index];
    const key = slide.getAttribute("data-place");
    const place = places[key];
    if (!place) return;

    const map = window.__veMap;
    const marker = window.__veMarker;
    const info = window.__veInfo;

    // Map may not be ready yet — store the update function so initMap() can call it later.
    if (!map || !marker || !info) return;

    // Move marker to the new place
    marker.setPosition(place.pos);
    marker.setTitle(place.name);

    // Zoom into the specific place instead of showing the whole country
    map.panTo(place.pos);
    map.setZoom(9);

    // Open info window label
    window.clearTimeout(window.__veInfoTimer);
    window.__veInfoTimer = window.setTimeout(() => {
      info.setContent(`<strong>${place.name}</strong>`);
      info.open({ map, anchor: marker });
    }, 250);
  }

  // FIX 3: Expose the map-sync function globally so initMap() can trigger it
  // after Google Maps finishes loading (resolves the async race condition).
  window.__veUpdateMap = updateMapFromSlide;

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  updateSlider();
}
