let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
});

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
streetmap.addTo(map);

let earthquakeLayer = new L.LayerGroup();
earthquakeLayer.addTo(map);

let info = L.control({
    position: "bottomright"
});

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

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(infoRes){

    infoRes.features.forEach(function(earthquake) {
        
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];
        let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

        let marker = L.circleMarker(coordinates, {
            radius: magnitude *2,
            color: getColor(depth),
            fillOpacity: 0.75,
            weight: 1
        });

        earthquakeLayer.addLayer(marker);

    });
});

function getColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850"
};