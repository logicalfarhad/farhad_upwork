import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";
L.Marker.prototype.setIcon(L.icon({
    iconUrl: markerIcon
}))
const LeafletMap = ({ coordinates }) => {
    const mapRef = useRef(null);
    useEffect(() => {
        if (!mapRef.current) {
            // Create a map instance
            mapRef.current = L.map('leaflet-map').setView([51.481312, -3.180500], 13);

            // Add a tile layer (OpenStreetMap tiles)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        return () => {
            // Clean up the map instance when the component unmounts
            mapRef.current.remove();
        };
    }, []);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(link);
    }, []);


    useEffect(() => {
        // Clear existing markers and add new ones when the coordinates change
        mapRef.current.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                layer.remove();
            }
        });

        // Iterate over the array of coordinates and create markers with popups
        coordinates.forEach(coord => {
            //    console.log(coord)
            const marker = L.marker(coord.cor).addTo(mapRef.current);
            //L.polygon(coord.vertices).addTo(mapRef.current);
            var polyline = L.polygon(coord.vertices, { "bubblingMouseEvents": true, "color": "red", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "red", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.9, "smoothFactor": 1.0, "stroke": true, "weight": 3 }).addTo(mapRef.current);

            // zoom the map to the polyline
            mapRef.current.fitBounds(polyline.getBounds());
            marker.bindPopup("<h3>" + coord.add + "</h3>");
        });
    }, [coordinates]);

    return (
        <div id="leaflet-map" style={{ height: "400px" }} >
        </div>
    );
};

export default LeafletMap;