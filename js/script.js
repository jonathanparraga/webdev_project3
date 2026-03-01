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
    angel: { name: "Salto Ángel", pos: { lat: 5.9672, lng: -62.5347 } },
    bolivar: { name: "Pico Bolívar", pos: { lat: 8.54066, lng: -71.04635 } },
    medanos: { name: "Médanos de Coro", pos: { lat: 11.60642, lng: -69.73763 } },
    roques: { name: "Los Roques", pos: { lat: 11.8545, lng: -66.7545 } },
  };

  let index = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
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

    // Map may not be ready yet if user clicks fast
    if (!map || !marker || !info) return;

    // Move single marker
    marker.setPosition(place.pos);
    marker.setTitle(place.name);

    // Fit country view
    const veBounds = new google.maps.LatLngBounds(
      { lat: 0, lng: -74 },
      { lat: 16, lng: -59 }
    );
    map.fitBounds(veBounds);

    // Open label
    window.setTimeout(() => {
      info.setContent(`<strong>${place.name}</strong>`);
      info.open({ map, anchor: marker });
    }, 250);
  }

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
