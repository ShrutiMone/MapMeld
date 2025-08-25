import React, { useState } from "react";
import { X, Upload, Map } from "lucide-react";

const UploadModal = ({ show, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [layerName, setLayerName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLayerName(selectedFile.name.split('.')[0]);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;

    // For non-image files, use FileReader
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const layerData = {
          id: Date.now(),
          name: layerName,
          visible: true,
          type: 'geojson',
          data: {
            url: e.target.result,
          },
          opacity: 100,
        };
        
        onUpload(layerData);
        resetForm();
        onClose();
      };
      reader.readAsText(file);
      return;
    }
    
    // For image files, create an image element to get dimensions
    const imageElement = document.createElement('img');
    imageElement.onload = function() {
      const layerData = {
        id: Date.now(),
        name: layerName,
        visible: true,
        type: 'image',
        data: {
          url: URL.createObjectURL(file),
          position: [20.5937, 78.9629], // Default center of India
          scale: 1,
          rotation: 0,
          width: this.width,
          height: this.height
        },
        opacity: 100,
      };
      
      onUpload(layerData);
      resetForm();
      onClose();
    };
    imageElement.src = URL.createObjectURL(file);
  };

  const resetForm = () => {
    setFile(null);
    setLayerName("");
    setPreviewUrl("");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upload Map Data</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  GeoJSON, KML, GPX, or image files (JPG, PNG)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".geojson,.kml,.gpx,.json,.jpg,.jpeg,.png"
              />
            </label>
          </div>
        </div>

        {previewUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <div className="flex justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-40 max-w-full border rounded"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layer Name
          </label>
          <input
            type="text"
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter layer name"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !layerName}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;