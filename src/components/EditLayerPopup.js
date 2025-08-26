// components/EditLayerPopup.js
import React, { useState, useEffect } from "react";
import AlertModal from "./AlertModal";

const EditLayerPopup = ({ layer, onClose, onUpdateLayer }) => {
  const [layerName, setLayerName] = useState(layer.name || "");
  const [layerType, setLayerType] = useState(layer.type || "marker");
  const [color, setColor] = useState(layer.data?.style?.color || layer.data?.style?.fillColor || "#ff0000");
  const [opacity, setOpacity] = useState(layer.opacity ?? 100);

  const [coords, setCoords] = useState([[{ lat: "", lng: "" }]]);
  const [rectangles, setRectangles] = useState([{ sw: "", ne: "" }]);
  const [circleMarkerEntries, setCircleMarkerEntries] = useState([{ lat: "", lng: "", value: "" }]);
  const [heatmapEntries, setHeatmapEntries] = useState([{ lat: "", lng: "", value: "" }]);
  const [circleEntries, setCircleEntries] = useState([{ lat: "", lng: "" }]);
  const [radius, setRadius] = useState(1000);

  const [showAlert, setShowAlert] = useState(false);

  // Prefill existing layer data
  useEffect(() => {
    if (!layer) return;

    if (layer.type === "marker" && layer.data?.positions) {
      setCoords([layer.data.positions.map(([lat, lng]) => ({ lat, lng }))]);
    }

    if ((layer.type === "polygon" || layer.type === "polyline") && layer.data?.positions) {
      setCoords(
        layer.data.positions.map((group) =>
          group.map(([lat, lng]) => ({ lat, lng }))
        )
      );
    }

    if (layer.type === "rectangle" && layer.data?.bounds) {
      setRectangles(
        layer.data.bounds.map(([sw, ne]) => ({
          sw: sw.join(","),
          ne: ne.join(","),
        }))
      );
    }

    if (layer.type === "circle" && layer.data?.positions) {
      setCircleEntries(layer.data.positions.map(([lat, lng]) => ({ lat, lng })));
      setRadius(layer.data.radius ?? 1000);
    }

    if (layer.type === "circleMarker" && layer.data?.positions) {
      setCircleMarkerEntries(
        layer.data.positions.map(([lat, lng], i) => ({
          lat,
          lng,
          value: layer.data.values[i],
        }))
      );
    }

    if (layer.type === "heatmap" && layer.data?.positions) {
      setHeatmapEntries(
        layer.data.positions.map(([lat, lng], i) => ({
          lat,
          lng,
          value: layer.data.values[i],
        }))
      );
    }
  }, [layer]);

  // --- Coordinate handlers ---
  const handleCoordChange = (gIndex, index, field, value) => {
    const updated = [...coords];
    updated[gIndex][index][field] = value;
    setCoords(updated);
  };

  const addCoordRow = (gIndex) => {
    const updated = [...coords];
    updated[gIndex].push({ lat: "", lng: "" });
    setCoords(updated);
  };

  const removeCoordRow = (gIndex, index) => {
    const updated = [...coords];
    if (updated[gIndex].length > 1) {
      updated[gIndex].splice(index, 1);
      setCoords(updated);
    }
  };

  const addGroup = () => setCoords([...coords, [{ lat: "", lng: "" }]]);
  const removeGroup = (gIndex) => {
    if (coords.length > 1) setCoords(coords.filter((_, i) => i !== gIndex));
  };

  // Rectangle
  const handleRectangleChange = (i, field, value) => {
    const updated = [...rectangles];
    updated[i][field] = value;
    setRectangles(updated);
  };
  const addRectangle = () => setRectangles([...rectangles, { sw: "", ne: "" }]);
  const removeRectangle = (i) => {
    if (rectangles.length > 1) setRectangles(rectangles.filter((_, idx) => idx !== i));
  };

  // Circle
  const handleCircleChange = (i, field, value) => {
    const updated = [...circleEntries];
    updated[i][field] = value;
    setCircleEntries(updated);
  };
  const addCircleRow = () => setCircleEntries([...circleEntries, { lat: "", lng: "" }]);
  const removeCircleRow = (i) => {
    if (circleEntries.length > 1) setCircleEntries(circleEntries.filter((_, idx) => idx !== i));
  };

  // CircleMarker
  const handleCircleMarkerChange = (i, field, value) => {
    const updated = [...circleMarkerEntries];
    updated[i][field] = value;
    setCircleMarkerEntries(updated);
  };
  const addCircleMarker = () => setCircleMarkerEntries([...circleMarkerEntries, { lat: "", lng: "", value: "" }]);
  const removeCircleMarker = (i) => {
    if (circleMarkerEntries.length > 1) setCircleMarkerEntries(circleMarkerEntries.filter((_, idx) => idx !== i));
  };

  // Heatmap
  const handleHeatmapChange = (i, field, value) => {
    const updated = [...heatmapEntries];
    updated[i][field] = value;
    setHeatmapEntries(updated);
  };
  const addHeatmapRow = () => setHeatmapEntries([...heatmapEntries, { lat: "", lng: "", value: "" }]);
  const removeHeatmapRow = (i) => {
    if (heatmapEntries.length > 1) setHeatmapEntries(heatmapEntries.filter((_, idx) => idx !== i));
  };

  // --- Save ---
  const handleSave = () => {
    let updatedLayer = { ...layer, name: layerName, opacity };

    switch (layerType) {
      case "marker": {
        const valid = coords.flat().filter((c) => c.lat && c.lng);
        if (!valid.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: "marker",
          data: { positions: valid.map((c) => [parseFloat(c.lat), parseFloat(c.lng)]) },
        };
        break;
      }

      case "polygon":
      case "polyline": {
        const validGroups = coords
          .map((group) =>
            group.filter((c) => c.lat && c.lng).map((c) => [parseFloat(c.lat), parseFloat(c.lng)])
          )
          .filter((g) => g.length);
        if (!validGroups.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: layerType,
          data: {
            positions: validGroups,
            style: { color, fillColor: color, fillOpacity: 0.4, weight: 2 },
          },
        };
        break;
      }

      case "rectangle": {
        const valid = rectangles
          .filter((r) => r.sw && r.ne)
          .map((r) => [r.sw.split(",").map(Number), r.ne.split(",").map(Number)]);
        if (!valid.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: "rectangle",
          data: { bounds: valid, style: { color, fillColor: color, fillOpacity: 0.3 } },
        };
        break;
      }

      case "circle": {
        const valid = circleEntries.filter((c) => c.lat && c.lng);
        if (!valid.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: "circle",
          data: {
            positions: valid.map((c) => [parseFloat(c.lat), parseFloat(c.lng)]),
            radius: parseFloat(radius),
            style: { color, fillColor: color, fillOpacity: 0.3 },
          },
        };
        break;
      }

      case "circleMarker": {
        const valid = circleMarkerEntries.filter((e) => e.lat && e.lng && e.value);
        if (!valid.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: "circleMarker",
          data: {
            positions: valid.map((e) => [parseFloat(e.lat), parseFloat(e.lng)]),
            values: valid.map((e) => parseFloat(e.value)),
            style: { color },
          },
        };
        break;
      }

      case "heatmap": {
        const valid = heatmapEntries.filter((e) => e.lat && e.lng && e.value);
        if (!valid.length) return setShowAlert(true);
        updatedLayer = {
          ...updatedLayer,
          type: "heatmap",
          data: {
            positions: valid.map((e) => [parseFloat(e.lat), parseFloat(e.lng)]),
            values: valid.map((e) => parseFloat(e.value)),
          },
        };
        break;
      }

      default:
        return setShowAlert(true);
    }

    onUpdateLayer(updatedLayer);
    onClose();
  };

  console.log("color : ", color)
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ zIndex: 9999 }}
      >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-lg font-semibold mb-4">Edit Layer</h2>

        <label className="block text-sm font-medium">Layer Name</label>
        <input type="text" className="w-full border px-2 py-1 rounded mb-3" value={layerName} onChange={(e) => setLayerName(e.target.value)} />

        <label className="block text-sm font-medium">Colour</label>
        <input type="color" className="w-full border rounded mb-3 h-10" value={color} onChange={(e) => setColor(e.target.value)} />

        <label className="block text-sm font-medium">Opacity</label>
        <input type="number" min={0} max={100} className="w-full border px-2 py-1 rounded mb-3" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />

        {/* Coordinate inputs reusing LatLongInputPopup logic */}
        {/* Marker / Polygon / Polyline */}
        {(layerType === "marker" || layerType === "polygon" || layerType === "polyline") && (
          <>
            <label className="block text-sm font-medium mb-1">{layerType} Coordinates</label>
            {coords.map((group, gIndex) => (
              <div key={gIndex} className="mb-3 border p-2 rounded">
                {group.map((c, i) => (
                  <div key={i} className="flex space-x-2 items-center mb-2">
                    <input type="number" placeholder="Lat" value={c.lat} onChange={(e) => handleCoordChange(gIndex, i, "lat", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                    <input type="number" placeholder="Lng" value={c.lng} onChange={(e) => handleCoordChange(gIndex, i, "lng", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                    <button onClick={() => removeCoordRow(gIndex, i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={group.length === 1}>–</button>
                    {i === group.length - 1 && (
                      <button onClick={() => addCoordRow(gIndex)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                    )}
                  </div>
                ))}
                {layerType !== "marker" && (
                  <button onClick={() => removeGroup(gIndex)} className="text-xs text-red-500 mt-1" disabled={coords.length === 1}>
                    Remove Group
                  </button>
                )}
              </div>
            ))}
            {layerType !== "marker" && (
              <button onClick={addGroup} className="text-xs text-blue-500 mb-3">+ Add Group</button>
            )}
          </>
        )}

        {/* Rectangle */}
        {layerType === "rectangle" && (
          <>
            <label className="block text-sm font-medium mb-1">Bounds (SW, NE)</label>
            {rectangles.map((r, i) => (
              <div key={i} className="flex space-x-2 items-center mb-2">
                <input type="text" placeholder="SW lat,lng" value={r.sw} onChange={(e) => handleRectangleChange(i, "sw", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                <input type="text" placeholder="NE lat,lng" value={r.ne} onChange={(e) => handleRectangleChange(i, "ne", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                <button onClick={() => removeRectangle(i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={rectangles.length === 1}>–</button>
                {i === rectangles.length - 1 && (
                  <button onClick={addRectangle} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                )}
              </div>
            ))}
          </>
        )}

        {/* Circle */}
        {layerType === "circle" && (
          <>
            <label className="block text-sm font-medium mb-1">Circle Centers</label>
            {circleEntries.map((c, i) => (
              <div key={i} className="flex space-x-2 items-center mb-2">
                <input type="number" placeholder="Lat" value={c.lat} onChange={(e) => handleCircleChange(i, "lat", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                <input type="number" placeholder="Lng" value={c.lng} onChange={(e) => handleCircleChange(i, "lng", e.target.value)} className="w-1/2 border px-2 py-1 rounded" />
                <button onClick={() => removeCircleRow(i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={circleEntries.length === 1}>–</button>
                {i === circleEntries.length - 1 && (
                  <button onClick={addCircleRow} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                )}
              </div>
            ))}
            <label className="block text-sm font-medium mb-1">Radius (meters)</label>
            <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full border px-2 py-1 rounded mb-3" />
          </>
        )}

        {/* CircleMarker */}
        {layerType === "circleMarker" && (
          <>
            <label className="block text-sm font-medium mb-1">Circle Marker Points (Lat, Lng, Value)</label>
            {circleMarkerEntries.map((entry, i) => (
              <div key={i} className="flex space-x-2 items-center mb-2">
                <input type="number" placeholder="Lat" value={entry.lat} onChange={(e) => handleCircleMarkerChange(i, "lat", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <input type="number" placeholder="Lng" value={entry.lng} onChange={(e) => handleCircleMarkerChange(i, "lng", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <input type="number" placeholder="Value" value={entry.value} onChange={(e) => handleCircleMarkerChange(i, "value", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <button onClick={() => removeCircleMarker(i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={circleMarkerEntries.length === 1}>–</button>
                {i === circleMarkerEntries.length - 1 && (
                  <button onClick={addCircleMarker} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                )}
              </div>
            ))}
          </>
        )}

        {/* Heatmap */}
        {layerType === "heatmap" && (
          <>
            <label className="block text-sm font-medium mb-1">Heatmap Points (Lat, Lng, Value)</label>
            {heatmapEntries.map((entry, i) => (
              <div key={i} className="flex space-x-2 items-center mb-2">
                <input type="number" placeholder="Lat" value={entry.lat} onChange={(e) => handleHeatmapChange(i, "lat", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <input type="number" placeholder="Lng" value={entry.lng} onChange={(e) => handleHeatmapChange(i, "lng", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <input type="number" placeholder="Value" value={entry.value} onChange={(e) => handleHeatmapChange(i, "value", e.target.value)} className="w-1/3 border px-2 py-1 rounded" />
                <button onClick={() => removeHeatmapRow(i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={heatmapEntries.length === 1}>–</button>
                {i === heatmapEntries.length - 1 && (
                  <button onClick={addHeatmapRow} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+</button>
                )}
              </div>
            ))}
          </>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
        </div>
      </div>

      {showAlert && <AlertModal message="Please fill in valid coordinates before saving." onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default EditLayerPopup;
