"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initSliderWithMap();
});


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


  window.__veMap = map;
  window.__veMarker = marker;
  window.__veInfo = info;


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

  function syncSlideWidths() {
    const w = track.parentElement.offsetWidth;
    slides.forEach((slide) => {
      slide.style.flex = "0 0 " + w + "px";
      slide.style.width = w + "px";
    });
    
    track.style.transform = `translateX(-${index * w}px)`;
  }

 
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

 
    if (!map || !marker || !info) return;

   
    marker.setPosition(place.pos);
    marker.setTitle(place.name);

 
    map.panTo(place.pos);
    map.setZoom(8);

    window.clearTimeout(window.__veInfoTimer);
    window.__veInfoTimer = window.setTimeout(() => {
      info.setContent(
        `<div style="font-family:'Montserrat',Arial,sans-serif;padding:4px 6px;min-width:120px;">
           <div style="font-size:0.78rem;color:#888;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:2px;">Venezuela</div>
           <div style="font-size:1rem;font-weight:700;color:#1a1a1a;">${place.name}</div>
         </div>`
      );
      info.open({ map, anchor: marker });
    }, 250);
  }


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
