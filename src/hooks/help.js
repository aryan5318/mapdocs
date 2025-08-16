
import React from "react";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
export function Recenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] !== null) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export function FitBounds({ geojsonData }) {
    const map = useMap();

    React.useEffect(() => {
        if (geojsonData) {
            const layer = L.geoJSON(geojsonData);
            map.fitBounds(layer.getBounds());
        }
    }, [geojsonData, map]);

    return null;
}