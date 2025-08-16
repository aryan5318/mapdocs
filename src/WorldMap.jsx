import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

export default function WorldMap() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState(null);
  const [showMountains, setShowMountains] = useState(false);
const [mountainsData, setMountainsData] = useState(null);

useEffect(() => {
  fetch("/data/peaks10m.geojson")
    .then((res) => res.json())
    .then((data) => setMountainsData(data));
}, []);

  useEffect(() => {
    fetch("/data/countries10m.geojson")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  const onEachCountry = (feature, layer) => {
    layer.on({
      click: () => {
           const code = feature.properties.ISO_A3 ; 
        navigate(`/country/${code}`);
      },
     
    });
  };

  const countryStyle = {
    fillColor: "blue",
    weight: 1,
    color: "blue",
    fillOpacity: 0,
  };

  return (
    <>
    <div style={{position:'absolute',zIndex:'2000'}}>
      <button onClick={()=>{setShowMountains(!showMountains)}}  style={{color:'green',width:"25px",height:"15px",marginTop:'100px'}}>Mountains</button>
    </div>
    <MapContainer
      center={[38, 26]}
      zoom={3}
      style={{ height: "100vh", width: "100vw" }}
    >
       <TileLayer url="https://tile.openstreetmap.de/{z}/{x}/{y}.png" />

      {countries && (
        <GeoJSON
          data={countries}
          onEachFeature={onEachCountry}
          style={countryStyle}
        />
      )}
       {showMountains && mountainsData && (
    <GeoJSON
      data={{
      ...mountainsData,
      features: mountainsData.features.filter(
        feature =>
          feature.properties.FEATURECLA &&
          feature.properties.FEATURECLA.toLowerCase().includes("range/mtn")
      )
    }}
      style={{
      fillColor: "brown",
      weight: 2,
      opacity: 1,
      color: "darkred",
      fillOpacity: 0.5
    }}
       onEachFeature={(feature, layer) => {
    layer.bindTooltip(feature.properties.NAME, {
      permanent: true,      // always visible
      direction: "center",  // label position
      className: "mountain-label" // custom CSS class
    });
  }}
    />
  )}
    </MapContainer>
    </>
  );
}
