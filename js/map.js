// Base maps
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

const esriSat = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles © Esri'
  }
);

// Initialize map (ONLY ONCE)
const map = L.map('map', {
  center: [-7.8, 110.4],
  zoom: 7,
  layers: [osm]
});

// Marker example
L.marker([-7.797068, 110.370529])
  .addTo(map)
  .bindPopup('<b>Yogyakarta</b><br>Sample Marker');

// Layer control
const baseMaps = {
  "OpenStreetMap": osm,
  "Satellite (Esri)": esriSat
};

L.control.layers(baseMaps).addTo(map);

// GeoJSON layer
fetch('data/sample.geojson')
  .then(res => res.json())
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2,
        fillOpacity: 0.3
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);

    // Auto zoom to polygon
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(err => console.error('GeoJSON load error:', err));
