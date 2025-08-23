import React, { useState } from "react";
import { Map, Plus } from "lucide-react";
import UploadModal from "../components/UploadModal";
import MapVisualization from "../components/MapVisualization";
import Sidebar from "../components/Sidebar";
import MapControlsSidebar from "../components/MapControlsSidebar";
import Footer from "../components/Footer";

const MapPage = () => {
  const [showBuiltInDropdown, setShowBuiltInDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [layers, setLayers] = useState([
  { id: 1, name: "Forest", visible: true, type: "built-in", opacity: 100 },
  { id: 2, name: "Water", visible: true, type: "built-in", opacity: 100 },
  { id: 3, name: "Bird A", visible: true, type: "gbif", opacity: 100 },
  { id: 4, name: "Bird B", visible: true, type: "gbif", opacity: 100 },
]);

  const builtInMaps = [
    { name: "Forests", category: "Environment" },
    { name: "Water sources", category: "Hydrology" },
    { name: "Land area", category: "Geography" },
    { name: "Deserts", category: "Climate" },
  ];

  const toggleLayer = (id) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const addBuiltInMap = (mapName) => {
    const newLayer = {
      id: Date.now(),
      name: mapName,
      visible: true,
      type: "built-in",
    };
    setLayers([newLayer, ...layers]); // Add to top
    setShowBuiltInDropdown(false);
  };

  const removeLayer = (id) => {
    setLayers(layers.filter((layer) => layer.id !== id));
  };

  const moveLayer = (from, to) => {
    if (to < 0 || to >= layers.length) return;
    const updated = [...layers];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLayers(updated);
    console.log(updated);
  };

  const setLayerOpacity = (id, opacity) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, opacity } : layer
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar
          showBuiltInDropdown={showBuiltInDropdown}
          setShowBuiltInDropdown={setShowBuiltInDropdown}
          setShowUploadModal={setShowUploadModal}
          layers={layers}
          toggleLayer={toggleLayer}
          addBuiltInMap={addBuiltInMap}
          builtInMaps={builtInMaps}
          removeLayer={removeLayer}
        />

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {showBuiltInDropdown && (
            <div className="absolute top-0 left-0 w-64 bg-white border border-gray-300 rounded shadow-lg z-30 m-4">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Built-in Maps</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {builtInMaps.map((map, index) => (
                  <button
                    key={index}
                    onClick={() => addBuiltInMap(map.name)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <div className="font-medium text-sm">{map.name}</div>
                      <div className="text-xs text-gray-500">
                        {map.category}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-full bg-gray-300 flex items-center justify-center">
            {layers.filter((l) => l.visible).length === 0 ? (
              <div className="text-center text-gray-600">
                <Map className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">overlaid maps</p>
                <p className="text-sm mt-2">
                  Add maps from the sidebar to get started
                </p>
              </div>
            ) : (
              // In MapPage component, replace the MapVisualization usage:
              <MapVisualization layers={layers} />
            )}
          </div>
        </div>

        {/* Right sidebar for map controls */}
        <MapControlsSidebar
          layers={layers}
          toggleLayer={toggleLayer}
          removeLayer={removeLayer}
          moveLayer={moveLayer}
          setLayerOpacity={setLayerOpacity}
        />

        <UploadModal
          show={showUploadModal}
          onClose={() => setShowUploadModal(false)}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MapPage;
