// Map initialization
let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
});

// Base map layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
streetmap.addTo(map);

// Layer groups
let earthquakeLayer = new L.LayerGroup();
let tectonicPlatesLayer = new L.LayerGroup();

// Add legend control (same as in Part 1)
let info = L.control({ position: "bottomright" });
info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = "<h4>Depth (km)</h4>";
    const depths = [0, 10, 30, 50, 70, 90];
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background:${getColor(depths[i] + 1)}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ` +
            `${depths[i]}${depths[i + 1] ? '&ndash;' + depths[i + 1] : '+'}<br>`;
    }
    return div;
};
info.addTo(map);

// Load tectonic plates data
d3.json("static/data/PB2002_plates.json").then(function(data) {
    console.log(data)
    L.geoJSON(data, {
        style: {
            color: "orange",
            weight: 2
        }
    }).addTo(tectonicPlatesLayer);
});
tectonicPlatesLayer.addTo(map);

// Load earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(infoRes) {
    infoRes.features.forEach(function(earthquake) {
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];
        let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

        let marker = L.circleMarker(coordinates, {
            radius: magnitude * 2,
            color: getColor(depth),
            fillOpacity: 0.75,
            weight: 1
        });

        earthquakeLayer.addLayer(marker);
    });
});
earthquakeLayer.addTo(map);

// Layer controls to toggle between overlays
let baseMaps = { "Street Map": streetmap };
let overlayMaps = { "Earthquakes": earthquakeLayer, "Tectonic Plates": tectonicPlatesLayer };
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

// Color function (same as in Part 1)
function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
}