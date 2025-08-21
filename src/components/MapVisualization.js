import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Circle,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper: normalize value (0–100) → opacity (0.2–1)
const getOpacity = (value) => {
  const minOpacity = 0.2;
  const maxOpacity = 1;
  return Math.max(minOpacity, Math.min(maxOpacity, value / 100));
};

const MapVisualization = () => {
  // Polygon example near Delhi
  const polygonCoords = [
    [28.70, 77.10],
    [28.80, 77.20],
    [28.75, 77.35],
    [28.60, 77.25],
  ];

  // Circle locations (blue)
  const circleLocations = [
    { name: "Delhi", coords: [28.6139, 77.209] },
    { name: "Mumbai", coords: [19.076, 72.8777] },
    { name: "Chennai", coords: [13.0827, 80.2707] },
  ];

  // Intensity data (opacity-based)
  const intensityPoints = [
    { name: "Point A", coords: [25.3, 82.9], value: 90 },
    { name: "Point B", coords: [22.6, 88.4], value: 60 },
    { name: "Point C", coords: [12.9, 77.6], value: 25 },
    { name: "Point D", coords: [26.8, 75.8], value: 10 },
  ];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      >
        {/* Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Polygon Area */}
        <Polygon
          positions={polygonCoords}
          pathOptions={{ color: "green", fillOpacity: 0.3 }}
        />

        {/* 2. Blue Circles for Cities */}
        {circleLocations.map((loc, i) => (
          <Circle
            key={i}
            center={loc.coords}
            radius={30000}
            pathOptions={{ color: "blue", fillOpacity: 0.4 }}
          >
            <Popup>{loc.name}</Popup>
          </Circle>
        ))}

        {/* 3. Intensity Circles (opacity = intensity) */}
        {intensityPoints.map((point, i) => (
          <CircleMarker
            key={i}
            center={point.coords}
            radius={12} // fixed size
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: getOpacity(point.value),
            }}
          >
            <Popup>
              {point.name} - Value: {point.value}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapVisualization;
