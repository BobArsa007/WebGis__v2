// ===============================
// BASE MAPS
// ===============================

// OpenStreetMap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

// Esri Satellite
const esriSat = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles © Esri'
  }
);

// Esri Reference Layers (Labels & Boundaries)
const esriLabels = L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Esri'
  }
);

const esriBoundaries = L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Esri'
  }
);

// ===============================
// MAP INITIALIZATION
// ===============================

const map = L.map('map', {
  center: [-7.8, 110.4], // Indonesia
  zoom: 7,
  layers: [esriSat, esriLabels, esriBoundaries] // Satellite default
});

// ===============================
// MARKER
// ===============================

L.marker([-7.797068, 110.370529])
  .addTo(map)
  .bindPopup('<b>Yogyakarta</b><br>Sample Marker');

// ===============================
// LAYER CONTROL
// ===============================

const baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": esriSat
};

const overlayMaps = {
  "Labels": esriLabels,
  "Boundaries": esriBoundaries
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Scale bar (nice touch)
L.control.scale().addTo(map);

// ===============================
// GEOJSON LAYER
// ===============================

fetch('data/sample.geojson')
  .then(response => response.json())
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: '#2563eb',
        weight: 2,
        fillOpacity: 0.3
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      }
    }).addTo(map);

    // Auto zoom to GeoJSON
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(error => {
    console.error('Error loading GeoJSON:', error);
  });
