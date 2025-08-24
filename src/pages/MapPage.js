import React, { useState } from "react";
import { Map, Plus } from "lucide-react";
import UploadModal from "../components/UploadModal";
import MapVisualization from "../components/MapVisualization";
import Sidebar from "../components/Sidebar";
import MapControlsSidebar from "../components/MapControlsSidebar";
import Footer from "../components/Footer";
import GBIFSpeciesPopup from "../components/GBIFSpeciesPopup";
import { layersData, builtInMapsData } from "../data/layersData";

const MapPage = () => {
  const [showBuiltInDropdown, setShowBuiltInDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGBIFPopup, setShowGBIFPopup] = useState(false);

  const [layers, setLayers] = useState(layersData);

  // Add GBIF layer using v2 tile API
  const addGBIFLayer = async (species) => {
    if (!species?.key) {
      alert("No taxonKey found for this species.");
      return;
    }

    const newLayer = {
      id: Date.now(),
      name: `${species.scientificName} (GBIF)`,
      visible: true,
      type: "tile",
      data: {
        // url: `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=${species.key}&style=classic.poly`,
        url: `https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?taxonKey=${species.key}&style=purpleYellow`,
        attribution: "© GBIF",
      },
      opacity: 100,
    };

    setLayers((prev) => [newLayer, ...prev]);
  };

  const updateLayers = (newLayers) => setLayers(newLayers);

  const toggleLayer = (id) => {
    updateLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const addBuiltInMap = (mapName) => {
    const mapConfig = builtInMapsData.find((map) => map.name === mapName);
    if (!mapConfig) return;

    const newLayer = {
      id: Date.now(),
      name: mapName,
      visible: true,
      type: mapConfig.type,
      data: mapConfig.data,
      opacity: 100,
    };

    updateLayers([newLayer, ...layers]);
    setShowBuiltInDropdown(false);
  };

  const removeLayer = (id) => {
    updateLayers(layers.filter((layer) => layer.id !== id));
  };

  const moveLayer = (from, to) => {
    if (to < 0 || to >= layers.length) return;
    const updated = [...layers];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updateLayers(updated);
  };

  const setLayerOpacity = (id, opacity) => {
    updateLayers(
      layers.map((layer) => (layer.id === id ? { ...layer, opacity } : layer))
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 h-full">
        <Sidebar
          layers={layers}
          builtInMaps={builtInMapsData}
          addGBIFLayer={addGBIFLayer}
          toggleLayer={toggleLayer}
          removeLayer={removeLayer}
          setShowUploadModal={setShowUploadModal}
          addBuiltInMap={addBuiltInMap}
          setShowGBIFPopup={setShowGBIFPopup}
        />
        <div className="flex-1 relative">
          {showBuiltInDropdown && (
            <div className="absolute top-0 left-0 w-64 bg-white border border-gray-300 rounded shadow-lg z-30 m-4">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Built-in Maps</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {builtInMapsData.map((map, index) => (
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
            <MapVisualization layers={layers} />
          </div>
        </div>

        <MapControlsSidebar
          layers={layers}
          toggleLayer={toggleLayer}
          removeLayer={removeLayer}
          moveLayer={moveLayer}
          setLayerOpacity={setLayerOpacity}
        />
      </div>

      <UploadModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <Footer />
    </div>
  );
};

export default MapPage;
