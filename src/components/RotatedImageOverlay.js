// components/RotatedImageOverlay.jsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Create a custom RotatedImageOverlay class
L.RotatedImageOverlay = L.ImageOverlay.extend({
  _reset: function () {
    L.ImageOverlay.prototype._reset.call(this);
    this._update();
  },
  
  _animateZoom: function (e) {
    L.ImageOverlay.prototype._animateZoom.call(this, e);
    this._update();
  },
  
  _update: function () {
    if (!this._image) return;
    
    const topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
    const size = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(topLeft);
    
    L.DomUtil.setPosition(this._image, topLeft);
    this._image.style.width = size.x + 'px';
    this._image.style.height = size.y + 'px';
    
    // Apply rotation
    if (this.options.rotation) {
      this._image.style.transform = `rotate(${this.options.rotation}deg)`;
      this._image.style.transformOrigin = 'center';
    }
  }
});

L.rotatedImageOverlay = function (url, bounds, options) {
  return new L.RotatedImageOverlay(url, bounds, options);
};

const RotatedImageOverlay = ({ url, bounds, rotation = 0, opacity = 1, zIndex = 500, interactive = false }) => {
  const map = useMap();
  const overlayRef = useRef();

  useEffect(() => {
    if (!map) return;

    // Create the rotated image overlay
    overlayRef.current = L.rotatedImageOverlay(url, bounds, {
      rotation: rotation,
      opacity: opacity,
      interactive: interactive,
      zIndex: zIndex
    }).addTo(map);

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
      }
    };
  }, [map, url, bounds, rotation, opacity, zIndex, interactive]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  useEffect(() => {
    if (overlayRef.current) {
      // Update rotation by recreating the overlay
      map.removeLayer(overlayRef.current);
      overlayRef.current = L.rotatedImageOverlay(url, bounds, {
        rotation: rotation,
        opacity: opacity,
        interactive: interactive,
        zIndex: zIndex
      }).addTo(map);
    }
  }, [rotation, map, url, bounds, opacity, zIndex, interactive]);

  return null;
};

export default RotatedImageOverlay;