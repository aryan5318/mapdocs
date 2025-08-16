import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import centroid from "@turf/centroid";
import { Recenter,FitBounds } from "./hooks/help";
import IndiaMapSidebar from "./OnPage/sidebar";
import { useMap } from "react-leaflet";
import * as turf from "@turf/turf";
import { useDispatch } from "react-redux";
import { addgeojson } from "./store/geogsonSlice";
import { useSelector } from "react-redux";

 function ForceIndiaZoom({ code }) {
    
 const map=useMap();
  useEffect(() => {
    if (code === "IND") {
      setTimeout(() => {
        map.setZoom(5); // closer zoom for India
      }, 400);
    }
  }, [code, map]);
  return null;
}

export default function CountryMap() {
    const dispatch=useDispatch();
    const { code } = useParams();
    const navigate = useNavigate();
    
    const [statesData, setStatesData] = useState(null);
    const [countryStates, setCountryStates] = useState(null);
    const [countryCenter, setCountryCenter] = useState([20, 0]);
    const [mountainsData, setMountainsData] = useState(null);
    const [indiaPolygon,setindianpolygon]=useState(null);
    const[countries,setcountries]=useState(null);
    const[test,settest]=useState(null);
    const data=useSelector((store)=>store?.data?.addgeojson)
    useEffect(() => {
        fetch("/data/countries10m.geojson")
          .then((res) => res.json())
          .then((data) => setcountries(data));
      }, []);
    
    useEffect(() => {
      fetch("/data/peaks10m.geojson")
        .then((res) => res.json())
        .then((data) => setMountainsData(data));
    }, []);

    // Load states GeoJSON
    useEffect(() => {
        fetch("/data/states50m.geojson")
            .then((res) => res.json())
            .then((data) => setStatesData(data));
    }, []);

    // Filter states for this country once statesData is loaded
    useEffect(() => {
        if (!statesData) return;
        const filtered = {
            type: "FeatureCollection",
            features: statesData.features.filter((f) => f.properties.adm0_a3 === code ),
            
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
    }, [statesData, code]);

    const onEachState = (feature, layer) => {
        layer.on("click", () => {
            navigate(`/state/${feature.properties.name}`);
        });
    };
    const stateStyle = {
        color:"blue",
       
        weight: 1,
        fillOpacity: 0,
    };
 









useEffect(() => {
  if (!countries || !mountainsData) return;

  // 1. Extract India polygon (MultiPolygon)
  let indiaFeature = null;
  for (const f of countries.features) {
    const props = f.properties || {};
    if (
      props.ADMIN === "India" ||
      props.NAME === "India" ||
      props.NAME_LONG === "India" ||
      props.ISO_A3 === "IND"
    ) {
      indiaFeature = f;
      break;
    }
  }

  if (!indiaFeature) {
    console.warn("India polygon not found in dataset");
    return;
  }

  // 2. Loop through Himalayan features & intersect
  const intersections = mountainsData.features
    .filter(mountain =>
      mountain.geometry.type === "Polygon" ||
      mountain.geometry.type === "MultiPolygon"
    )
    .map(mountain => {
      try {
        const result = turf.intersect(turf.featureCollection([indiaFeature, mountain]));
         if (result) {
      result.properties = {
        ...mountain.properties,  // e.g. "Himalaya", "range"
        country: "India"         // add context
      };
    }
        return result || null;
      } catch (e) {
        console.warn("Intersection failed for mountain feature:", e);
        return null;
      }
    })
    .filter(Boolean); // remove nulls

  // 3. Collect all intersections
  if (intersections.length > 0) {
    const result = {
      type: "FeatureCollection",
      features: intersections,
    };
    console.log("✅ Himalaya parts inside India:", result);
    settest(result)
    dispatch(addgeojson(result));
  } else {
    console.warn("⚠️ No intersections found between Himalaya and India.");
  }
}, [countries, mountainsData, dispatch]);



const landformColors = {
  "island": "blue",
  "range/mtn": "brown",
  
  "plain": "black",
  "plateau": "orange",
  "desert":"red",
  "delta":"green",
  "coast":"green",
  "valley":"pink",
  "wetlands":"yellow",
  

};

function getStyle(feature) {
  const type = feature.properties.FEATURECLA?.toLowerCase();
  console.log("Feature type:", type); // <-- DEBUG
  return {
    fillColor: landformColors[type] || "transparent" ,
    
    weight: 1,
    fillOpacity:0.5
  };
}


    return (<>
         <IndiaMapSidebar/>
        <MapContainer center={countryCenter} zoom={4} style={{ height: "100vh", width: "77vw",marginLeft:'310px'}}>
    <TileLayer url="https://tile.openstreetmap.de/{z}/{x}/{y}.png" />
            { countryStates &&
            
            <GeoJSON data={countryStates} onEachFeature={onEachState} style={stateStyle} />}
           {  test  &&
            <GeoJSON data={test} style={getStyle} />}
            <Recenter center={countryCenter} />
            <FitBounds geojsonData={countryStates} />
            
        </MapContainer>

    </>
    );
}
