// Create the map object
let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Function to determine marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Function to determine marker color based on depth
  function markerColor(depth) {
    return depth > 90 ? "#FF5F65" :
           depth > 70 ? "#FCA35D" :
           depth > 50 ? "#FDB72A" :
           depth > 30 ? "#F7DB11" :
           depth > 10 ? "#DCF400" :
                        "#A3F600";
  }
  
  // Get the data with d3
  d3.json(geoData).then(function(data) {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // Extract depth from the geometry.coordinates array
        let depth = feature.geometry.coordinates[2];
        
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(depth),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
                         <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                         <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(myMap);
  
    // Set up the legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "legend");
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FCA35D", "#FF5F65"];
  
      // Create legend header
      let legendInfo = "<h1>Depth (km)</h1>";
      div.innerHTML = legendInfo;
  
      // Loop through grades and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  });
  