import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Map } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import MapVisualization from '../components/MapVisualization';

const MapPage = () => {
  const [showBuiltInDropdown, setShowBuiltInDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [layers, setLayers] = useState([
    { id: 1, name: 'Forest', visible: true, type: 'built-in' },
    { id: 2, name: 'Water', visible: true, type: 'built-in' },
    { id: 3, name: 'Bird A', visible: true, type: 'gbif' },
    { id: 4, name: 'Bird B', visible: true, type: 'gbif' }
  ]);

  const builtInMaps = [
    { name: 'Forests', category: 'Environment' },
    { name: 'Water sources', category: 'Hydrology' },
    { name: 'Land area', category: 'Geography' },
    { name: 'Deserts', category: 'Climate' }
  ];

  const toggleLayer = (id) => {
    setLayers(layers.map(layer =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const addBuiltInMap = (mapName) => {
    const newLayer = {
      id: Date.now(),
      name: mapName,
      visible: true,
      type: 'built-in'
    };
    setLayers([...layers, newLayer]);
    setShowBuiltInDropdown(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-44 bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200 relative">
          <button
            onClick={() => setShowBuiltInDropdown(!showBuiltInDropdown)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50"
          >
            <span>Add a map</span>
            <svg className={`w-4 h-4 transition-transform ${showBuiltInDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showBuiltInDropdown && (
            <div className="absolute top-full left-3 right-3 bg-white border border-gray-300 rounded-b shadow-lg z-20">
              <button
                onClick={() => setShowBuiltInDropdown(false)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-200"
              >
                Built-in map
              </button>
              <button
                onClick={() => {
                  setShowBuiltInDropdown(false);
                  setShowUploadModal(true);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                Upload custom map
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <button className="w-full px-3 py-3 text-left text-sm border-b border-gray-200 flex items-center justify-between hover:bg-gray-200">
            <span>Lat-long points</span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-full px-3 py-3 text-left text-sm border-b border-gray-200 flex items-center justify-between hover:bg-gray-200">
            <span>GBIF data</span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-full px-3 py-3 text-left text-sm text-gray-500 flex items-center justify-between">
            <span>Import MapMeld file</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-gray-200">
          <div className="p-3 bg-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Overlay Settings</h4>
            <p className="text-xs text-gray-500">Min 2 maps required</p>
          </div>

          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Layers</h4>
            <div className="space-y-2">
              {layers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{layer.name}</span>
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className={`p-1 rounded ${layer.visible ? 'text-gray-700' : 'text-gray-400'}`}
                  >
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                    <div className="text-xs text-gray-500">{map.category}</div>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-full bg-gray-300 flex items-center justify-center">
          {layers.filter(l => l.visible).length === 0 ? (
            <div className="text-center text-gray-600">
              <Map className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">overlaid maps</p>
              <p className="text-sm mt-2">Add maps from the sidebar to get started</p>
            </div>
          ) : (
            <MapVisualization />
          )}
        </div>
      </div>

      <UploadModal show={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  );
};

export default MapPage;
