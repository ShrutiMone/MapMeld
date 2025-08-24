// layersData.js

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
      style: { color: 'green', fillOpacity: 0.4 }
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
      style: { color: 'blue', fillOpacity: 0.5 }
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
      style: { color: 'red' }
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
      style: { color: 'blue', weight: 3 }
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
      style: { color: 'purple', fillOpacity: 0.2 }
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
      style: { color: 'orange', fillOpacity: 0.3 }
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
  // { 
  //   name: "Forests", 
  //   category: "Environment",
  //   type: "polygon",
  //   data: {
  //     positions: [[28.70, 77.10], [28.80, 77.20], [28.75, 77.35], [28.60, 77.25]],
  //     style: { color: 'green', fillOpacity: 0.3 }
  //   }
  // },
  // { 
  //   name: "Water sources", 
  //   category: "Hydrology",
  //   type: "polygon",
  //   data: {
  //     positions: [[28.65, 77.15], [28.75, 77.25], [28.70, 77.40], [28.55, 77.30]],
  //     style: { color: 'blue', fillOpacity: 0.3 }
  //   }
  // }
  {
    name: "Forest Cover",
    type: "tile", // could also be polygon/polyline if you have geoJSON
    data: {
      url: "https://your-tile-server.com/india-forest/{z}/{x}/{y}.png", // add correct url here
      attribution: "© Forest Data",
    },
  },
  {
    name: "India Water Sources",
    type: "tile",
    data: {
      url: "https://your-tile-server.com/india-water/{z}/{x}/{y}.png", // add correct url here
      attribution: "© Water Sources Data",
    },
  }
];