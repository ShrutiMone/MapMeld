import React, { useRef, useEffect } from "react";
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
  ImageOverlay,
  useMap,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ImageOverlayWithHandles from "./ImageOverlayWithHandles";
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


// Helper function to create bounds for an image based on position, scale and image dimensions
const getImageBounds = (position, scale, imageWidth, imageHeight) => {
  // Calculate the size in degrees (approximate conversion)
  // This is a simplified approach - you might want to adjust this based on your needs
  const latSize = (0.01 * scale * imageHeight / 100);
  const lngSize = (0.01 * scale * imageWidth / 100);
  
  return [
    [position[0] - latSize/2, position[1] - lngSize/2],
    [position[0] + latSize/2, position[1] + lngSize/2]
  ];
};



// Component to handle map instance
function MapInstance({ onMapReady }) {
  console.log("onMapReady : ", onMapReady)
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  return null;
}



const MapVisualization = ({ layers, onMapReady, editingImage, updateLayer, baseOpacity  }) => {
  console.log("Layers : ", layers);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      >

        <MapInstance onMapReady={onMapReady} />
        
        {/* Default basemap - you can swap OSM with GBIF basemap */}
        {/*<TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />*/}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={baseOpacity / 100}
        />


        {/* Example: GBIF Basemap (replace above OSM if you want GBIF base) */}
        {/* <TileLayer
          attribution='© <a href="https://www.gbif.org/">GBIF</a>, © OpenStreetMap contributors'
          url="https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png"
        /> */}

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
                      radius={8 + (value / 100) * 12}
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

              case "image":
                const isEditing = editingImage && editingImage.id === layer.id;
                
                if (isEditing && updateLayer) {
                  return (
                    <ImageOverlayWithHandles
                      key={layer.id}
                      layer={layer}
                      onUpdate={updateLayer}
                      isEditing={true}
                    />
                  );
                } else {
                  // Calculate bounds for non-editing images with rotation
                  const latSize = (0.01 * (layer.data.scale || 1) * (layer.data.height || 100) / 100);
                  const lngSize = (0.01 * (layer.data.scale || 1) * (layer.data.width || 100) / 100);
                  const position = layer.data.position || [20.5937, 78.9629];
                  const rotation = layer.data.rotation || 0;
                  
                  // For rotated images, calculate the bounding box
                  let bounds;
                  if (rotation !== 0) {
                    const angleRad = rotation * Math.PI / 180;
                    const cosAngle = Math.abs(Math.cos(angleRad));
                    const sinAngle = Math.abs(Math.sin(angleRad));
                    
                    // Calculate the rotated dimensions
                    const rotatedWidth = lngSize * cosAngle + latSize * sinAngle;
                    const rotatedHeight = lngSize * sinAngle + latSize * cosAngle;
                    
                    bounds = [
                      [position[0] - rotatedHeight/2, position[1] - rotatedWidth/2],
                      [position[0] + rotatedHeight/2, position[1] + rotatedWidth/2]
                    ];
                  } else {
                    // For non-rotated images
                    bounds = [
                      [position[0] - latSize/2, position[1] - lngSize/2],
                      [position[0] + latSize/2, position[1] + lngSize/2]
                    ];
                  }
                  
                  return (
                    <ImageOverlay
                      key={layer.id}
                      url={layer.data.url}
                      bounds={bounds}
                      opacity={opacity}
                    >
                      <Popup>
                        <div>
                          <p>{layer.name}</p>
                          <img 
                            src={layer.data.url} 
                            alt={layer.name}
                            className="max-w-xs max-h-40 mt-2"
                          />
                        </div>
                      </Popup>
                    </ImageOverlay>
                  );
                }

              default:
                return null;
            }
          })}
      </MapContainer>
    </div>
  );
};

export default MapVisualization;
