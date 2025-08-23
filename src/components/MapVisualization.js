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

const MapVisualization = ({ layers }) => {
  // Remove hardcoded data and use layers prop instead
  const layerDataMap = {
    "Forest": {
      type: "polygon",
      positions: [[28.70, 77.10], [28.80, 77.20], [28.75, 77.35], [28.60, 77.25]],
      style: { color: 'green' }
    },
    "Water": {
      type: "polygon",
      positions: [[28.65, 77.15], [28.75, 77.25], [28.70, 77.40], [28.55, 77.30]],
      style: { color: 'blue' }
    },
    "Bird A": {
      type: "circleMarker",
      positions: [[25.3, 82.9], [22.6, 88.4]],
      style: { color: 'red' }
    },
    "Bird B": {
      type: "circleMarker",
      positions: [[12.9, 77.6], [26.8, 75.8]],
      style: { color: 'orange' }
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {layers.filter(layer => layer.visible).map(layer => {
          const data = layerDataMap[layer.name];
          if (!data) return null;

          const opacity = layer.opacity !== undefined ? layer.opacity / 100 : 1;

          switch (data.type) {
            case "polygon":
              return (
                <Polygon
                  key={layer.id}
                  positions={data.positions}
                  pathOptions={{
                    ...data.style,
                    fillOpacity: 0.3 * opacity,
                    opacity: opacity
                  }}
                />
              );
            case "circleMarker":
              return data.positions.map((position, index) => (
                <CircleMarker
                  key={`${layer.id}-${index}`}
                  center={position}
                  radius={8}
                  pathOptions={{
                    ...data.style,
                    fillOpacity: 0.7 * opacity,
                    opacity: opacity
                  }}
                >
                  <Popup>{layer.name} - Point {index + 1}</Popup>
                </CircleMarker>
              ));
            default:
              return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default MapVisualization;
