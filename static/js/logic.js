let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.7,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Establish Color
    function mapColor(depth) {
      if (depth > 90) return "red";
      if (depth > 70) return "orangered";
      if (depth > 50) return "orange";
      if (depth > 30) return "gold";
      if (depth > 10) return "yellow";
      return "lightgreen";
    }

    // Establish magnitude size
function mapRadius(mag) {
  return Math.sqrt(mag) * 10;
}

// Add earthquake data to the map
L.geoJson(data, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng);
  },
  style: mapStyle,
  onEachFeature: function (feature, layer) {
    layer.bindPopup("<strong>Magnitude:</strong> " + feature.properties.mag + "<br><strong>Location:</strong> " + feature.properties.place + "<br><strong>Depth:</strong> " + feature.geometry.coordinates[2]);
  }
}).addTo(myMap);

// Creating the legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  [-10, 10, 30, 50, 70, 90].forEach(value => {
    div.innerHTML += `<i style="background:${mapColor(value + 1)}"></i> ${value}<br>`;
  });
  return div;
};
legend.addTo(myMap);
});