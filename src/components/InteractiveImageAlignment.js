// components/InteractiveImageAlignment.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Move, RotateCw, ZoomIn, Check, Minus, Plus, Save } from 'lucide-react';

const InteractiveImageAlignment = ({ imageLayer, onUpdate, onClose, map }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startPosition, setStartPosition] = useState([0, 0]);
  const [startRotation, setStartRotation] = useState(0);
  const [startScale, setStartScale] = useState(1);
  
  // Initialize values from the image layer
  const position = imageLayer.data.position || [20.5937, 78.9629];
  const rotation = imageLayer.data.rotation || 0;
  const scale = imageLayer.data.scale || 1;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!map) return;

      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Convert screen pixels to lat/lng
        const mapContainer = map.getContainer();
        const mapWidth = mapContainer.offsetWidth;
        const mapHeight = mapContainer.offsetHeight;
        
        const bounds = map.getBounds();
        const latDelta = (bounds.getNorth() - bounds.getSouth()) * deltaY / mapHeight;
        const lngDelta = (bounds.getEast() - bounds.getWest()) * deltaX / mapWidth;
        
        const newPosition = [
          startPosition[0] - latDelta,
          startPosition[1] + lngDelta
        ];
        
        updateImagePosition(newPosition);
      } else if (isRotating) {
        const deltaX = e.clientX - startX;
        const newRotation = (startRotation + deltaX * 0.5) % 360;
        updateImageRotation(newRotation);
      } else if (isScaling) {
        const deltaY = startY - e.clientY;
        const newScale = Math.max(0.1, Math.min(500, startScale + deltaY * 0.01));
        updateImageScale(newScale);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsRotating(false);
      setIsScaling(false);
    };

    if (isDragging || isRotating || isScaling) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, isRotating, isScaling, startX, startY, startPosition, startRotation, startScale, map]);

  const startDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartPosition(position);
  };

  const startRotate = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    setStartX(e.clientX);
    setStartRotation(rotation);
  };

  const startScaleAction = (e) => {
    e.stopPropagation();
    setIsScaling(true);
    setStartY(e.clientY);
    setStartScale(scale);
  };

  const updateImagePosition = (newPosition) => {
    onUpdate({
      ...imageLayer,
      data: {
        ...imageLayer.data,
        position: newPosition
      }
    });
  };

  const updateImageRotation = (newRotation) => {
    onUpdate({
      ...imageLayer,
      data: {
        ...imageLayer.data,
        rotation: newRotation
      }
    });
  };

  const updateImageScale = (newScale) => {
    onUpdate({
      ...imageLayer,
      data: {
        ...imageLayer.data,
        scale: newScale
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Calculate image bounds for display
  const getImageBounds = () => {
    const latSize = (0.01 * scale * (imageLayer.data.height || 100) / 100);
    const lngSize = (0.01 * scale * (imageLayer.data.width || 100) / 100);
    
    return [
      [position[0] - latSize/2, position[1] - lngSize/2],
      [position[0] + latSize/2, position[1] + lngSize/2]
    ];
  };

  const bounds = getImageBounds();
  const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
  const centerLng = (bounds[0][1] + bounds[1][1]) / 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-50"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white rounded-lg p-4 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Interactive Image Alignment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Instructions:</strong>
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Drag the image to move it</li>
            <li>Drag the rotation handle (↻) to rotate</li>
            <li>Drag the scale handle (□) to resize</li>
            <li>Press ESC to cancel</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-sm font-medium text-blue-700">Position</div>
            <div className="text-xs text-blue-600">
              Lat: {position[0].toFixed(4)}
            </div>
            <div className="text-xs text-blue-600">
              Lng: {position[1].toFixed(4)}
            </div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-sm font-medium text-green-700">Rotation</div>
            <div className="text-xs text-green-600">{rotation.toFixed(1)}°</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-sm font-medium text-purple-700">Scale</div>
            <div className="text-xs text-purple-600">{scale.toFixed(2)}x</div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onMouseDown={startDrag}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            title="Drag to move image"
          >
            <Move className="w-4 h-4 mr-1" />
            Move
          </button>
          <button
            onMouseDown={startRotate}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            title="Drag to rotate image"
          >
            <RotateCw className="w-4 h-4 mr-1" />
            Rotate
          </button>
          <button
            onMouseDown={startScaleAction}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
            title="Drag to scale image"
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            Scale
          </button>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveImageAlignment;