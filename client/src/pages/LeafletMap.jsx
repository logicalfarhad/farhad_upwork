import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";

// Set the default icon for markers
L.Marker.prototype.setIcon(L.icon({
    iconUrl: markerIcon
}));

const LeafletMap = ({ coordinates }) => {
    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

    useEffect(() => {
        // Initialize the map only once
        if (!mapRef.current) {
            mapRef.current = L.map('leaflet-map').setView([51.481312, -3.180500], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);

            // Initialize a layer group for markers and polygons
            markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
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
        // Clear existing markers and polygons
        markersLayerRef.current.clearLayers();

        // Iterate over the array of coordinates and create markers with popups
        coordinates.forEach(coord => {
            const marker = L.marker(coord.cor).addTo(markersLayerRef.current);

            const polygon = L.polygon(coord.vertices, {
                color: "red",
                fillColor: "red",
                fillOpacity: 0.2,
                weight: 3
            }).addTo(markersLayerRef.current);

            // Adjust the map view to fit the bounds of the polygon
            mapRef.current.fitBounds(polygon.getBounds());
            marker.bindPopup("<h3>" + coord.add + "</h3>");
        });
    }, [coordinates]);

    return (
        <div id="leaflet-map" style={{
            position: 'relative',
            width: '100.0%',
            height: '400px',
            left: '0',
            top: '0'
        }} />
    );
};

export default LeafletMap;
