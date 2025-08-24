import React, { useState } from "react";
import AlertModal from "./AlertModal";

const LatLongInputPopup = ({ onClose, onAddLayer }) => {
  const [layerName, setLayerName] = useState("Custom Layer");
  const [layerType, setLayerType] = useState("marker"); // "marker" or "polygon"
  const [color, setColor] = useState("#ff0000");
  const [coords, setCoords] = useState([{ lat: "", lng: "" }]);
  // const [alertContent, setAlertContent] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleCoordChange = (index, field, value) => {
    const updated = [...coords];
    updated[index][field] = value;
    setCoords(updated);

    // Automatically add another input row if last one is filled
    if (
      index === coords.length - 1 &&
      updated[index].lat !== "" &&
      updated[index].lng !== ""
    ) {
      setCoords([...updated, { lat: "", lng: "" }]);
    }
  };

  const handleSubmit = () => {
    const validCoords = coords
      .filter((c) => c.lat !== "" && c.lng !== "")
      .map((c) => [parseFloat(c.lat), parseFloat(c.lng)]);

    if (validCoords.length === 0) {
      // alert("Please enter at least one valid coordinate.");
      // setAlertContent("Please enter at least one valid coordinate.");
      setShowAlert(true);
      return;
    }

    const newLayer = {
      id: Date.now(),
      name: layerName,
      visible: true,
      type: layerType, // "marker" or "polygon"
      data: {
        positions: validCoords,
        style: { color, fillColor: color, fillOpacity: 0.4, weight: 2 },
      },
      opacity: 100,
    };

    onAddLayer(newLayer);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Custom Layer</h2>

        <div className="flex align-center gap-8">
          {/* Layer name */}
          <div>
            <label className="block text-sm font-medium">Layer Name</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded mb-3"
              value={layerName}
              onChange={(e) => setLayerName(e.target.value)}
            />
          </div>
          <div>
            {/* Color */}
            <label className="block text-sm font-medium">Color</label>
            <input
              type="color"
              className="w-full border rounded mb-3 h-10"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        {/* Type */}
        <label className="block text-sm font-medium">Type</label>
        <select
          className="w-full border px-2 py-1 rounded mb-3"
          value={layerType}
          onChange={(e) => setLayerType(e.target.value)}
        >
          <option value="marker">Points</option>
          <option value="polygon">Polygon</option>
        </select>

        {/* Coordinates */}
        <label className="block text-sm font-medium mb-1">Coordinates</label>
        <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
          {coords.map((c, i) => (
            <div key={i} className="flex space-x-2">
              <input
                type="number"
                placeholder="Lat"
                value={c.lat}
                onChange={(e) => handleCoordChange(i, "lat", e.target.value)}
                className="w-1/2 border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Lng"
                value={c.lng}
                onChange={(e) => handleCoordChange(i, "lng", e.target.value)}
                className="w-1/2 border px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Add Layer
          </button>
        </div>
      </div>
      <AlertModal
        show={showAlert}
        content="Please enter at least one valid coordinate."
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default LatLongInputPopup;
