import React, { useState } from "react";

const ImportMapMeldModal = ({ show, onClose, onImport }) => {
  const [mode, setMode] = useState(null); // "append" | "replace"
  const [file, setFile] = useState(null);

  if (!show) return null;

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.name.endsWith(".MapMeld")) {
      setFile(uploaded);
    } else {
      alert("Please select a valid .MapMeld file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && uploaded.name.endsWith(".MapMeld")) {
      setFile(uploaded);
    } else {
      alert("Please select a valid .MapMeld file");
    }
  };

  const handleImport = async () => {
    if (!file || !mode) return;

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      onImport(parsed, mode);
      onClose();
    } catch (err) {
      alert("Invalid MapMeld file format");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-4">Import MapMeld File</h3>

        {/* Step 1: Choose mode */}
        {!mode && (
          <div className="space-y-3">
            <button
              onClick={() => setMode("replace")}
              className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Open as New File (Replace current layers)
            </button>
            <button
              onClick={() => setMode("append")}
              className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Open in Current File (Append layers)
            </button>
          </div>
        )}

        {/* Step 2: Upload */}
        {mode && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-4 border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("mapmeld-file-input").click()}
          >
            {file ? (
              <p className="text-green-600 font-medium">{file.name}</p>
            ) : (
              <p className="text-gray-500">Drag & Drop .MapMeld file here or click to select</p>
            )}
            <input
              id="mapmeld-file-input"
              type="file"
              accept=".MapMeld"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Step 3: Import */}
        {file && (
          <button
            onClick={handleImport}
            className="mt-4 w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Import
          </button>
        )}

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

export default ImportMapMeldModal;
