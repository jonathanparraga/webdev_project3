document.addEventListener("DOMContentLoaded", () => {
  initSlider();
});

function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const slides = slider.querySelectorAll("[data-slide]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");

  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    update();
  });

  update();
}


window.initMap = function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const center = { lat: 41.8781, lng: -87.6298 }; // Chicago

  const map = new google.maps.Map(mapEl, {
    zoom: 11,
    center,
    mapTypeControl: true,
    streetViewControl: false,
  });


  const places = [
    { name: "Downtown Chicago", position: { lat: 41.8781, lng: -87.6298 } },
    { name: "Pilsen", position: { lat: 41.8565, lng: -87.6566 } },
    { name: "Humboldt Park", position: { lat: 41.9026, lng: -87.7226 } },
  ];

 
  const info = new google.maps.InfoWindow();

  places.forEach((p) => {
    const marker = new google.maps.Marker({
      position: p.position,
      map,
      title: p.name,
    });

    marker.addListener("click", () => {
      info.setContent(`<strong>${p.name}</strong>`);
      info.open(map, marker);
    });
  });


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