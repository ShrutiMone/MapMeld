import React from "react";

const ExportModal = ({ show, onClose, onExportImage, onExportMapMeld }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white rounded-lg shadow-lg w-80 p-6">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="space-y-3">
          {/*<button
            onClick={onExportImage}
            className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Export as Image
          </button>*/}
          <button
            onClick={onExportMapMeld}
            className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Export as .MapMeld file
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
