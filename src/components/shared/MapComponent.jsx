import React, {useEffect} from 'react';
import L from "leaflet";
import "leaflet-draw";

const MapComponent = () => {

    useEffect(() => {
        const map = L.map("map").setView([43,
            -83.37146759033203], 14);


        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const drawControl = new L.Control.Draw({
            position: "topleft"
        });


        const drawn_items = L.featureGroup([]).addTo(map);

        const layer_group = L.featureGroup([]).addTo(map);
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function (event) {
            let layer = event.layer;
            drawn_items.addLayer(layer);
        });
    })

    return (
        <div>
            {/* <div id="map"/> */}
        </div>
    );
}

export default MapComponent;