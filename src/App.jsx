import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import WorldMap from "./WorldMap";
import StateMap from "./StateMap";
import CountryMap from "./CountryMap";
import Detail from "./Detail";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorldMap />} />
        <Route path="/country/:code" element={<CountryMap />} />
        <Route path="/state/:stateName" element={<StateMap />} />
        <Route path="/:ccode/:item" element={<Detail/>}/>
      </Routes>
    </Router>
  );
}