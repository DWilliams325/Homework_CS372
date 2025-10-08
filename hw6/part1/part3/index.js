function initialize() {
  const fenway = { lat: 41.0793, lng: -85.1394 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: fenway,
    zoom: 14,
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      },
    },
  );

  map.setStreetView(panorama);
}

window.initialize = initialize;