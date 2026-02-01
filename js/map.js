// Initialize map
const map = L.map('map').setView([-7.8, 110.4], 7); // Indonesia example

// Base map
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marker example
const marker = L.marker([-7.797068, 110.370529])
  .addTo(map)
  .bindPopup('<b>Yogyakarta</b><br>Sample Marker')
  .openPopup();

// GeoJSON layer
fetch('data/sample.geojson')
  .then(res => res.json())
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);

    // Layer control
    L.control.layers(
      { "OpenStreetMap": osm },
      { "GeoJSON Layer": geojsonLayer }
    ).addTo(map);
  });
