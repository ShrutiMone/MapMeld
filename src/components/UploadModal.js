import React from 'react';
import { FolderOpen } from 'lucide-react';

const UploadModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h3 className="text-lg font-semibold mb-4">Upload map file</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Browse or drag and drop the file here</p>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".geojson,.kml,.shp,.json"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            Browse Files
          </label>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
