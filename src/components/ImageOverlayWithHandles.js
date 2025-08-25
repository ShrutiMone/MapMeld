// components/ImageOverlayWithHandles.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ImageOverlay, useMap } from 'react-leaflet';

const ImageOverlayWithHandles = ({ layer, onUpdate, isEditing }) => {
  const map = useMap();
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startPosition, setStartPosition] = useState([0, 0]);
  const [startRotation, setStartRotation] = useState(0);
  const [startScale, setStartScale] = useState(1);

  const position = layer.data.position || [20.5937, 78.9629];
  const rotation = layer.data.rotation || 0;
  const scale = layer.data.scale || 1;
  const opacity = layer.opacity !== undefined ? layer.opacity / 100 : 1;

  // Calculate image bounds
  const getImageBounds = () => {
    const latSize = (0.01 * scale * (layer.data.height || 100) / 100);
    const lngSize = (0.01 * scale * (layer.data.width || 100) / 100);

    // For rotated images, we need to calculate the bounding box
    if (rotation !== 0) {
      const angleRad = rotation * Math.PI / 180;
      const cosAngle = Math.abs(Math.cos(angleRad));
      const sinAngle = Math.abs(Math.sin(angleRad));
      
      // Calculate the rotated dimensions
      const rotatedWidth = lngSize * cosAngle + latSize * sinAngle;
      const rotatedHeight = lngSize * sinAngle + latSize * cosAngle;
      
      return [
        [position[0] - rotatedHeight/2, position[1] - rotatedWidth/2],
        [position[0] + rotatedHeight/2, position[1] + rotatedWidth/2]
      ];
    }
    
    // For non-rotated images    
    return [
      [position[0] - latSize/2, position[1] - lngSize/2],
      [position[0] + latSize/2, position[1] + lngSize/2]
    ];
  };

  const bounds = getImageBounds();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isEditing || !map) return;

      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Convert screen pixels to lat/lng
        const mapContainer = map.getContainer();
        const mapWidth = mapContainer.offsetWidth;
        const mapHeight = mapContainer.offsetHeight;
        
        const mapBounds = map.getBounds();
        const latDelta = (mapBounds.getNorth() - mapBounds.getSouth()) * deltaY / mapHeight;
        const lngDelta = (mapBounds.getEast() - mapBounds.getWest()) * deltaX / mapWidth;
        
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
        const newScale = Math.max(0.1, Math.min(5, startScale + deltaY * 0.01));
        updateImageScale(newScale);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsRotating(false);
      setIsScaling(false);
    };

    if (isEditing && (isDragging || isRotating || isScaling)) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isEditing, isDragging, isRotating, isScaling, startX, startY, startPosition, startRotation, startScale, map]);

  const startDrag = (e) => {
    if (!isEditing) return;
    e.originalEvent.stopPropagation();
    setIsDragging(true);
    setStartX(e.originalEvent.clientX);
    setStartY(e.originalEvent.clientY);
    setStartPosition(position);
  };

  const startRotate = (e) => {
    if (!isEditing) return;
    e.originalEvent.stopPropagation();
    setIsRotating(true);
    setStartX(e.originalEvent.clientX);
    setStartRotation(rotation);
  };

  const startScaleAction = (e) => {
    if (!isEditing) return;
    e.originalEvent.stopPropagation();
    setIsScaling(true);
    setStartY(e.originalEvent.clientY);
    setStartScale(scale);
  };

  const updateImagePosition = (newPosition) => {
    onUpdate({
      ...layer,
      data: {
        ...layer.data,
        position: newPosition
      }
    });
  };

  const updateImageRotation = (newRotation) => {
    onUpdate({
      ...layer,
      data: {
        ...layer.data,
        rotation: newRotation
      }
    });
  };

  const updateImageScale = (newScale) => {
    onUpdate({
      ...layer,
      data: {
        ...layer.data,
        scale: newScale
      }
    });
  };

  return (
    <>
      <ImageOverlay
        url={layer.data.url}
        bounds={bounds}
        opacity={opacity}
        zIndex={500}
        interactive={isEditing}
        eventHandlers={isEditing ? { mousedown: startDrag } : {}}
      />
      
      {/* Visual handles when editing */}
      {isEditing && (
        <>
          {/* Rotation handle (top center) */}
          <div
            className="leaflet-rotation-handle"
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '20px',
              backgroundColor: 'green',
              borderRadius: '50%',
              cursor: 'grab',
              zIndex: 1000,
              border: '2px solid white',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
            onMouseDown={startRotate}
            title="Drag to rotate"
          >
            <div style={{ 
              color: 'white', 
              fontSize: '12px', 
              textAlign: 'center',
              lineHeight: '16px'
            }}>↻</div>
          </div>
          
          {/* Scale handle (bottom right) */}
          <div
            className="leaflet-scale-handle"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '20px',
              height: '20px',
              backgroundColor: 'purple',
              cursor: 'nwse-resize',
              zIndex: 1000,
              border: '2px solid white',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
            onMouseDown={startScaleAction}
            title="Drag to scale"
          >
            <div style={{ 
              color: 'white', 
              fontSize: '12px', 
              textAlign: 'center',
              lineHeight: '16px'
            }}>□</div>
          </div>
          
          {/* Outline to show the image is editable */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px dashed blue',
              pointerEvents: 'none',
              zIndex: 501
            }}
          />
        </>
      )}
    </>
  );
};

export default ImageOverlayWithHandles;