// ===============================
// BASE MAPS
// ===============================

// OpenStreetMap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

// Esri Satellite Imagery
const esriSat = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles © Esri'
  }
);

// Esri Hybrid Overlay (Labels + Borders)
const esriHybrid = L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
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
  layers: [esriSat, esriHybrid]
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
  "Labels & Borders": esriHybrid
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Scale bar
L.control.scale().addTo(map);

// ===============================
// GEOJSON LAYER (FULL FIX)
// ===============================

fetch('data/sample.geojson')
  .then(response => response.json())
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: '#2563eb',
        weight: 2,
        fillColor: '#2563eb',
        fillOpacity: 0.3
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const p = feature.properties;

          const popupContent = `
            <div style="font-size:13px; line-height:1.4;">
              <b>No KKPRL:</b> ${p.NO_KKPRL || '-'}<br>
              <b>Nama Subjek:</b> ${p.NAMA_SUBJ || '-'}<br>
              <b>Kegiatan:</b> ${p.KEGIATAN || '-'}<br>
              <b>Provinsi:</b> ${p.PROVINSI || '-'}<br>
              <b>Perairan:</b> ${p.PERAIRAN || '-'}<br>
              <b>Luas (Ha):</b> ${p.LUAS_HA || '-'}<br>
              <b>Terbit:</b> ${p.TERBIT || '-'}<br>
              <b>Berlaku:</b> ${p.BERLAKU || '-'}<br>
              <b>Penerbit:</b> ${p.PENERBIT || '-'}
            </div>
          `;

          layer.bindPopup(popupContent);

          // Hover highlight
          layer.on('mouseover', () => {
            layer.setStyle({
              weight: 3,
              fillOpacity: 0.6
            });
          });

          layer.on('mouseout', () => {
            geojsonLayer.resetStyle(layer);
          });
        }
      }
    }).addTo(map);

    // Auto zoom to polygon
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(error => {
    console.error('GeoJSON load error:', error);
  });
