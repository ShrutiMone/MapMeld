// components/ImageAlignmentTool.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Move, RotateCw, ZoomIn, Check, MousePointer } from 'lucide-react';

const ImageAlignmentTool = ({ imageLayer, onUpdate, onClose, map, onInteractiveMode }) => {
  const [position, setPosition] = useState(imageLayer.data.position || [20.5937, 78.9629]);
  const [rotation, setRotation] = useState(imageLayer.data.rotation || 0);
  const [scale, setScale] = useState(imageLayer.data.scale || 1);
  
  const handlePositionChange = (type, value) => {
    const newPosition = [...position];
    if (type === 'lat') newPosition[0] = parseFloat(value);
    if (type === 'lng') newPosition[1] = parseFloat(value);
    setPosition(newPosition);
    updateLayer({ position: newPosition });
  };
  
  const handleRotationChange = (value) => {
    const newRotation = parseFloat(value);
    setRotation(newRotation);
    updateLayer({ rotation: newRotation });
  };
  
  const handleScaleChange = (value) => {
    const newScale = parseFloat(value);
    setScale(newScale);
    updateLayer({ scale: newScale });
  };
  
  const updateLayer = (updates) => {
    onUpdate({
      ...imageLayer,
      data: {
        ...imageLayer.data,
        ...updates
      }
    });
  };
  
  const applyChanges = () => {
    onUpdate({
      ...imageLayer,
      data: {
        ...imageLayer.data,
        position,
        rotation,
        scale
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white rounded-lg p-4 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Align Image</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <button
            onClick={onInteractiveMode}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Interactive Alignment Mode
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Drag, rotate, and scale the image directly on the map
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={position[0]}
                  onChange={(e) => handlePositionChange('lat', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={position[1]}
                  onChange={(e) => handlePositionChange('lng', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rotation: {rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => handleRotationChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scale: {scale.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="400"
              step="0.1"
              value={scale}
              onChange={(e) => handleScaleChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={applyChanges}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAlignmentTool;