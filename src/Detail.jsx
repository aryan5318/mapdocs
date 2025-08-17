import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import centroid from "@turf/centroid";
import { Recenter, FitBounds } from "./hooks/help";
import IndiaMapSidebar from "./OnPage/sidebar";



export default function Detail() {
  const { ccode,item } = useParams();
  const navigate = useNavigate();
  const { BaseLayer } = LayersControl;
  const [statesData, setStatesData] = useState(null);
  const [countryStates, setCountryStates] = useState(null);
  const [countryCenter, setCountryCenter] = useState([20, 0]);
  const [peaks,setpeaks]=useState(null);
  const [showPeaks,setshowPeaks]=useState(false);


   useEffect(() => {
    fetch("/data/states50m.geojson")
      .then((res) => res.json())
      .then((data) => setStatesData(data));
  }, []);

  useEffect(() => {
    fetch("/data/india_peaks.geojson")
      .then((res) => res.json())
      .then((data) => setpeaks(data));
  }, []);

  useEffect(()=>{
  if(item === "Mountain Peaks in India"){
    setshowPeaks(true);
  }
  },[item])

  // Filter states for this country once statesData is loaded
  useEffect(() => {
    if (!statesData) return;
    const filtered = {
      type: "FeatureCollection",
      features: statesData.features.filter((f) => f.properties.adm0_a3 === ccode),

    };
    setCountryStates(filtered);


    if (filtered.features.length > 0) {
      const centerFeature = centroid({
        type: "FeatureCollection",
        features: filtered.features,
      });
      const [lon, lat] = centerFeature.geometry.coordinates;
      setCountryCenter([lat, lon]);
    }
  }, [statesData, ccode]);

  const onEachState = (feature, layer) => {
    layer.on("click", () => {
      navigate(`/state/${feature.properties.name}`);
    });
  };
  const stateStyle = {
    color: "blue",

    weight: 1,
    fillOpacity: 0,
  };


  return (<>
    <IndiaMapSidebar ccode={ccode} />

    <MapContainer
      center={countryCenter}
      zoom={4}
      style={{
        height: "100vh",
        width: "77vw",
        marginLeft: "310px",
      }}
    >
      <LayersControl position="topright">
        {/* OpenStreetMap */}
        <BaseLayer  name="OpenStreetMap">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors © CARTO"
            subdomains={["a", "b", "c", "d"]}
            maxZoom={19}
          />
        </BaseLayer>

        {/* OpenTopoMap - Terrain Relief */}
        <BaseLayer checked name="Terrain (OpenTopoMap)">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://opentopomap.org">OpenTopoMap</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </BaseLayer>

        {/* Esri Satellite Imagery */}
        <BaseLayer name="Satellite (Esri)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
          />
        </BaseLayer>
      </LayersControl>
       
      {/* States Layer */}
       {showPeaks &&
              <GeoJSON
                data={peaks}
                pointToLayer={(feature, latlng) =>
                  L.marker(latlng, {
                    icon: L.divIcon({
  className: "peak-icon",
  html: "⛰️",
  iconSize: [30, 30],          // keep reasonable size
  iconAnchor: [15, 15],        // half of width & height → centers it
})

                  }).bindPopup(
                    `<b>${feature.properties.name}</b><br/>
                     Height: ${feature.properties.height}<br/>
                     Range: ${feature.properties.range}`
                  )
                }
              />
              }
      {countryStates && (
        <>
          <GeoJSON
            data={countryStates}
            onEachFeature={onEachState}
            style={stateStyle}
          />
          <Recenter center={countryCenter} />
          <FitBounds geojsonData={countryStates} />
        </>
      )}
    </MapContainer>
  </>
  );
}