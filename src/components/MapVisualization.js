// MapVisualization.js
import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Popup,
  Marker,
  Polyline,
  Rectangle,
  Circle,
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
  console.log("Layers : ", layers);

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

        {layers
          .filter((layer) => layer.visible)
          .map((layer) => {
            const opacity =
              layer.opacity !== undefined ? layer.opacity / 100 : 1;

            switch (layer.type) {
              case "tile":
                return (
                  <TileLayer
                    key={layer.id}
                    url={layer.data.url}
                    attribution={layer.data.attribution || "GBIF"}
                    opacity={opacity}
                  />
                );
              case "polygon":
                return (
                  <Polygon
                    key={layer.id}
                    positions={layer.data.positions}
                    pathOptions={{
                      ...layer.data.style,
                      fillOpacity:
                        (layer.data.style.fillOpacity || 0.3) * opacity,
                      opacity: opacity,
                    }}
                  >
                    <Popup>{layer.name}</Popup>
                  </Polygon>
                );

              case "circleMarker":
                return layer.data.positions.map((position, index) => {
                  const value = layer.data.values
                    ? layer.data.values[index]
                    : 50;
                  return (
                    <CircleMarker
                      key={`${layer.id}-${index}`}
                      center={position}
                      radius={8 + (value / 100) * 12} // Scale radius based on value
                      pathOptions={{
                        ...layer.data.style,
                        fillOpacity: getOpacity(value) * opacity,
                        opacity: opacity,
                      }}
                    >
                      <Popup>
                        {layer.name} - Point {index + 1}
                        {layer.data.values && ` - Value: ${value}`}
                      </Popup>
                    </CircleMarker>
                  );
                });

              case "marker":
                return layer.data.positions.map((position, index) => (
                  <Marker
                    key={`${layer.id}-${index}`}
                    position={position}
                    opacity={opacity}
                  >
                    <Popup>
                      {layer.name} - Point {index + 1}
                    </Popup>
                  </Marker>
                ));

              case "polyline":
                return (
                  <Polyline
                    key={layer.id}
                    positions={layer.data.positions}
                    pathOptions={{
                      ...layer.data.style,
                      opacity: opacity,
                    }}
                  >
                    <Popup>{layer.name}</Popup>
                  </Polyline>
                );

              case "rectangle":
                return (
                  <Rectangle
                    key={layer.id}
                    bounds={layer.data.bounds}
                    pathOptions={{
                      ...layer.data.style,
                      fillOpacity:
                        (layer.data.style.fillOpacity || 0.3) * opacity,
                      opacity: opacity,
                    }}
                  >
                    <Popup>{layer.name}</Popup>
                  </Rectangle>
                );

              case "circle":
                return layer.data.positions.map((position, index) => (
                  <Circle
                    key={`${layer.id}-${index}`}
                    center={position}
                    radius={layer.data.radius || 10000}
                    pathOptions={{
                      ...layer.data.style,
                      fillOpacity:
                        (layer.data.style.fillOpacity || 0.3) * opacity,
                      opacity: opacity,
                    }}
                  >
                    <Popup>
                      {layer.name} - Area {index + 1}
                    </Popup>
                  </Circle>
                ));

              case "heatmap":
                // Simple heatmap simulation using multiple semi-transparent circles
                return layer.data.positions.map((position, index) => {
                  const value = layer.data.values
                    ? layer.data.values[index]
                    : 50;
                  const intensity = value / 100;
                  return (
                    <Circle
                      key={`${layer.id}-${index}`}
                      center={position}
                      radius={5000 + intensity * 15000}
                      pathOptions={{
                        color: `rgb(255, ${100 + (1 - intensity) * 155}, 0)`,
                        fillColor: `rgb(255, ${
                          100 + (1 - intensity) * 155
                        }, 0)`,
                        fillOpacity: 0.3 * opacity * intensity,
                        opacity: 0.7 * opacity * intensity,
                      }}
                    >
                      <Popup>
                        {layer.name} - Intensity: {value}
                      </Popup>
                    </Circle>
                  );
                });

              default:
                return null;
            }
          })}
      </MapContainer>
    </div>
  );
};

export default MapVisualization;
