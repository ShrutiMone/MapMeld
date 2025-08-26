// layersData.js

import indiaRiverMap from "./images/India-River-Map.png"
import indiaVegetationMap from "./images/India-Vegetation-Map.png"

export const layersData = [
  { 
    id: 1, 
    name: "Forest Areas", 
    visible: true, 
    type: "polygon", 
    data: {
      positions: [
        [[28.70, 77.10], [28.80, 77.20], [28.75, 77.35], [28.60, 77.25]],
        [[28.50, 77.40], [28.60, 77.50], [28.55, 77.65], [28.40, 77.55]]
      ],
      style: { color: '#005416', fillOpacity: 0.4 }
    },
    opacity: 100
  },
  { 
    id: 2, 
    name: "Water Bodies", 
    visible: true, 
    type: "polygon", 
    data: {
      positions: [
        [[28.65, 77.15], [28.75, 77.25], [28.70, 77.40], [28.55, 77.30]],
        [[28.45, 77.00], [28.55, 77.10], [28.50, 77.25], [28.35, 77.15]]
      ],
      style: { color: '#0000ff', fillOpacity: 0.5 }
    },
    opacity: 100
  },
  { 
    id: 3, 
    name: "Bird Observations", 
    visible: true, 
    type: "circleMarker", 
    data: {
      positions: [[25.3, 82.9], [22.6, 88.4], [12.9, 77.6], [26.8, 75.8]],
      values: [90, 60, 25, 10],
      style: { color: '#ff0000' }
    },
    opacity: 100
  },
  { 
    id: 4, 
    name: "Research Stations", 
    visible: true, 
    type: "marker", 
    data: {
      positions: [[28.6139, 77.209], [19.076, 72.8777], [13.0827, 80.2707]],
    },
    opacity: 100
  },
  { 
    id: 5, 
    name: "River Network", 
    visible: true, 
    type: "polyline", 
    data: {
      positions: [
        [[30.5, 78.5], [29.5, 79.5], [28.5, 80.5], [27.5, 81.5]],
        [[26.5, 82.5], [25.5, 83.5], [24.5, 84.5]]
      ],
      style: { color: '#0000', weight: 3 }
    },
    opacity: 100
  },
  { 
    id: 6, 
    name: "Protected Areas", 
    visible: true, 
    type: "rectangle", 
    data: {
      bounds: [
        [[29.5, 76.5], [30.5, 77.5]],
        [[27.5, 79.5], [28.5, 80.5]]
      ],
      style: { color: '#660066', fillOpacity: 0.2 }
    },
    opacity: 100
  },
  { 
    id: 7, 
    name: "Urban Centers", 
    visible: true, 
    type: "circle", 
    data: {
      positions: [[28.6139, 77.209], [19.076, 72.8777], [13.0827, 80.2707]],
      radius: 15000,
      style: { color: '#ff5500', fillOpacity: 0.3 }
    },
    opacity: 100
  },
  { 
    id: 8, 
    name: "Pollution Hotspots", 
    visible: true, 
    type: "heatmap", 
    data: {
      positions: [[28.70, 77.10], [19.20, 72.90], [13.10, 80.30]],
      values: [85, 65, 45],
    },
    opacity: 100
  }
];

export const builtInMapsData = [
  {
    name: "India-River-Map",
    type: "image",
    opacity: 100,
    data: {
        url: indiaRiverMap,
        position: [
            21.334937371294412,
            82.917978125
        ],
        scale: 202.2,
        rotation: 0,
        width: 1450,
        height: 1536,
    },
  },
  {
    name: "India-Vegetation-Map",
    visible: true,
    type: "image",
    data: {
        url: indiaVegetationMap,
        position: [
            17.3427177,
            82.681726
        ],
        scale: 343.5,
        rotation: 0,
        width: 850,
        height: 1136
    },
    opacity: 100,
    citation: "Reddy, C. S., Jha, C. S., Diwakar, P. G., & Dadhwal, V. K. (2015). Nationwide classification of forest types of India using remote sensing and GIS. Environmental monitoring and assessment, 187(12), 777."
  }
];