import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";

const indiaSidebarData = [
  {
    category: "A. Physical Geography of India",
    items: [
      "India: Size & Location",
      "Physiographic Divisions of India",
      "Division of Himalaya",
      "Regional Division of Himalaya",
      "Glaciers in India",
      "Mountain Peaks in India",
      "Mountain Passes in India",
      "Regional Division of Plains",
      "Peninsular Plateau of India",
      "Hills of Peninsular India",
      "Western Ghats of India",
      "Eastern Ghats of India",
      "Coastal Plains of India",
      "Coastal Features in India",
      "Islands of India",
      "Hill Stations in India",
      "Valleys in India",
    ],
  },
  {
    category: "B. River Systems & Water Resources",
    items: [
      "Drainage System of India",
      "Interlinking of Rivers",
      "Multipurpose Projects",
      "Hydro-Electric Projects",
    ],
  },
  {
    category: "C. Climate & Natural Regions",
    items: [
      "Köppen Climate Classification of India",
      "Agro-Climate Regions of India",
      "Agro-Ecological Regions of India",
    ],
  },
  {
    category: "D. Land Use & Soils",
    items: ["Land Utilization in India", "Soils of India"],
  },
  {
    category: "E. Agriculture & Vegetation",
    items: [
      "Major Crops in India",
      "Natural Vegetation in India",
      "Mangrove Vegetation in India",
    ],
  },
  {
    category: "F. Forests, Biodiversity & Conservation",
    items: [
      "National Parks in India",
      "Biosphere Reserves in India",
      "Tiger Reserves in India",
      "Elephant Reserves in India",
      "Ramsar Sites in India",
      "UNESCO World Heritage Sites (Natural)",
    ],
  },
  {
    category: "G. Natural Hazards & Disasters",
    items: [
      "Earthquake Zones in India",
      "Cyclones in India",
      "Drought-Prone Areas in India",
      "Desertification in India",
    ],
  },
  {
    category: "H. Minerals & Energy Resources",
    items: [
      "Major Minerals in India",
      "Coal Reserves of India",
      "Iron Ore Deposits in India",
      "Manganese Deposits in India",
      "Limestone Deposits in India",
      "Mica Deposits in India",
      "Dolomite in India",
      "Lead-Zinc Deposits in India",
      "Bauxite Deposits in India",
      "Copper Deposits in India",
    ],
  },
  {
    category: "I. Power & Energy Infrastructure",
    items: [
      "Thermal Power Plants in India",
      "Nuclear Plants in India",
      "Geothermal Energy Plants in India",
      "Solar Parks in India",
      "Ultra Mega Power Projects",
      "Major Refineries in India",
      "Major Pipelines in India",
    ],
  },
  {
    category: "J. Transport & Industrial Geography",
    items: [
      "National Waterways in India",
      "Major Industrial Regions in India",
      "Industrial Corridors in India",
      "Iron and Steel Industry in India",
      "Silk Textile Industry in India",
      "Woollen Textile Industry in India",
      "Automobile Industry in India",
      "Cement Industry in India",
      "Fertilizer Industry in India",
      "Sugar Industry in India",
      "Jute Industry in India",
      "Cotton Textile Industry",
      "Paper Industry in India",
      "Mega Food Parks in India",
    ],
  },
  {
    category: "K. Transport Networks",
    items: [
      "Roadways in India",
      "Bharatmala Pariyojana",
      "Railway Zones in India",
      "Sea Ports in India",
    ],
  },
  {
    category: "L. Demography & Society",
    items: [
      "Literacy Rates in India",
      "Population Density in India",
      "Sex Ratio in India",
      "Particular Vulnerable Tribal Groups (PVTGs)",
      "Scheduled Tribes in India",
    ],
  },
  {
    category: "M. State-wise Maps",
    items: ["Physical Maps of Indian States & UTs"],
  },
];

export default function IndiaMapSidebar({ccode}) {
  const navigate=useNavigate();

  const [openCategory, setOpenCategory] = useState(null);
  console.log(ccode);
  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div style={{zIndex:'2000'}} className="w-80 bg-gray-100 h-screen overflow-y-auto p-3 border-r border-gray-300 absolute z">
      <h2 className="text-lg font-bold mb-4">India Map Atlas</h2>
      {indiaSidebarData.map((section, index) => (
        <div key={index} className="mb-2">
          <button
            className="w-full text-left font-semibold bg-gray-200 p-2 rounded hover:bg-gray-300"
            onClick={() => toggleCategory(index)}
          >
            {section.category}
          </button>
          {openCategory === index && (
            <ul className="pl-4 mt-1 list-disc text-sm">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/${ccode}/${item}`)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
