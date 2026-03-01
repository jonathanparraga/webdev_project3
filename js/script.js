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

  window.__veMap = new google.maps.Map(mapEl, {
    center: { lat: 6.5, lng: -66.5 },
    zoom: 6,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  });

  
  window.__veMap.fitBounds(veBounds);

  
  window.__veMarker = new google.maps.Marker({
    map: window.__veMap,
    position: { lat: 6.5, lng: -66.5 },
    title: "Venezuela",
  });

  window.__veInfo = new google.maps.InfoWindow();
};

function initSliderWithMap() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const slides = slider.querySelectorAll("[data-slide]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  const places = {
    angel: {
      name: "Salto Ángel",
      pos: { lat: 5.9672, lng: -62.5347 },
    },
    bolivar: {
      name: "Pico Bolívar",
      pos: { lat: 8.54066, lng: -71.04635 },
    },
    medanos: {
      name: "Médanos de Coro",
      pos: { lat: 11.60642, lng: -69.73763 },
    },
    roques: {
      name: "Los Roques",
      pos: { lat: 11.8545, lng: -66.7545 },
    },
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

 
    if (!map || !marker || !info) return;

    marker.setPosition(place.pos);
    marker.setTitle(place.name);


    const veBounds = new google.maps.LatLngBounds(
      { lat: 0, lng: -74 },
      { lat: 16, lng: -59 }
    );
    map.fitBounds(veBounds);


    window.setTimeout(() => {
      map.panTo(place.pos);
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

  map.addListener("click", (e) => {
    new google.maps.Marker({
      position: e.latLng,
      map,
      title: "Custom marker",
    });
  });


  const btn = document.createElement("button");
  btn.textContent = "Center on my location";
  btn.style.padding = "0.6rem 0.8rem";
  btn.style.margin = "0.7rem";
  btn.style.borderRadius = "0.6rem";
  btn.style.border = "0";
  btn.style.cursor = "pointer";

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(btn);

  btn.addEventListener("click", () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(me);
        new google.maps.Marker({ position: me, map, title: "You are here" });
      },
      () => {
      
      }
    );
  });
};