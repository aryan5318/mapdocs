import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import centroid from "@turf/centroid";
import { Recenter, FitBounds } from "./hooks/help";





export default function StateMap() {
  const { stateName } = useParams(); 
  const navigate = useNavigate();

  const [statesData, setStatesData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [stateCenter, setStateCenter] = useState([20, 0]);

  // Load full states GeoJSON
  useEffect(() => {
    fetch("/data/states50m.geojson")
      .then((res) => res.json())
      .then((data) => setStatesData(data));
  }, []);

  // Filter the clicked state
  useEffect(() => {
    if (!statesData) return;
    if (stateName) console.log(stateName)
    const filtered = {
      type: "FeatureCollection",
      features: statesData.features.filter(
        (f) => f.properties.name &&
          stateName &&
          f.properties.name.toLowerCase() === stateName.toLowerCase()

      ),
    };
    setSelectedState(filtered);

    if (filtered.features.length > 0) {
      const centerFeature = centroid(filtered);
      const [lon, lat] = centerFeature.geometry.coordinates;
      setStateCenter([lat, lon]);
    }
  }, [statesData, stateName]);
  useEffect(() => {
    console.log("Selected state updated:", selectedState);
  }, [selectedState]);

  const stateStyle = {
    color: "blue",
    weight: 2,
    fillOpacity: 0,
  };

  return (
    <MapContainer
      center={stateCenter}
      zoom={5}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://tile.openstreetmap.de/{z}/{x}/{y}.png" />
      {selectedState && (
        <GeoJSON data={selectedState} style={stateStyle} />
      )}
      <Recenter center={stateCenter} />
      if(selectedState){
        <FitBounds geojsonData={selectedState} />}
    </MapContainer>
  );
}
