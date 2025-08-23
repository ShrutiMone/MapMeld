import React, { useRef, useState } from "react";
import { Eye, EyeOff, Minus, Download } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 230;
const MAX_WIDTH = 280;

const MapControlsSidebar = ({
  layers,
  toggleLayer,
  removeLayer,
  moveLayer,
  setLayerOpacity,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const resizing = useRef(false);
  const sidebarRef = useRef(null);

  // Handle drag end for layers
  const onDragEnd = (result) => {
    if (!result.destination) return;
    moveLayer(result.source.index, result.destination.index);
  };

  // Overlay settings: show if 2 or more layers
  const showOverlaySettings = layers.length >= 2;

  React.useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizing.current) return;
      const dx = e.clientX - resizing.startX;
      let newWidth = resizing.startWidth - dx;
      if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
      if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      if (!resizing.current) return;
      resizing.current = false;
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // attach once

  // Mouse events for resizing
  const handleMouseDown = (e) => {
    resizing.current = true;
    document.body.style.cursor = "col-resize";
    resizing.startX = e.clientX;
    resizing.startWidth = sidebarWidth;
  };

  const handleMouseMove = (e) => {
    if (!resizing.current) return;
    // const dx = resizing.startX - e.clientX;
    // let newWidth = resizing.startWidth + dx;
    const dx = e.clientX - resizing.startX; // distance mouse moved
    let newWidth = resizing.startWidth - dx; // decrease width when dragging right

    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    resizing.current = false;
    document.body.style.cursor = "";
  };

  React.useEffect(() => {
    if (resizing.current) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [resizing.current]);

  const LayerIcon = ({ layer }) => {
    const color = layer.data?.style?.color || "gray";

    switch (layer.type) {
      case "polygon":
      case "rectangle":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <polygon
              points="4,12 8,4 12,12"
              fill={color}
              fillOpacity={layer.data?.style?.fillOpacity ?? 0.3}
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "polyline":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <polyline
              points="2,12 6,4 10,10 14,6"
              fill="none"
              stroke={color}
              strokeWidth={layer.data?.style?.weight ?? 2}
            />
          </svg>
        );
      case "circle":
      case "circleMarker":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <circle
              cx="8"
              cy="8"
              r="6"
              fill={color}
              fillOpacity={layer.data?.style?.fillOpacity ?? 0.3}
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "marker":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <circle
              cx="8"
              cy="8"
              r="4"
              fill={color}
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "heatmap":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <rect
              x="2"
              y="2"
              width="12"
              height="12"
              fill={`url(#heatmapGradient-${layer.id})`}
            />
            <defs>
              <linearGradient
                id={`heatmapGradient-${layer.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="red" stopOpacity="0.8" />
                <stop offset="100%" stopColor="yellow" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="bg-gray-100 border-l border-gray-200 flex flex-col h-full relative"
      style={{
        width: sidebarWidth,
        minWidth: MIN_WIDTH,
        maxWidth: MAX_WIDTH,
        transition: resizing.current ? "none" : "width 0.2s",
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          cursor: "col-resize",
          zIndex: 50,
        }}
        onMouseDown={handleMouseDown}
        className="hover:bg-gray-300 transition"
        title="Drag to resize sidebar"
      />

      {/* Overlay Settings section removed */}
      {/* {showOverlaySettings && (
        <div className="border-b border-gray-200 bg-gray-200 p-4">
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            Opacity Settings
          </h4>
          <div className="space-y-4">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="px-1 flex items-center w-full min-w-0"
              >
                <span className="text-sm text-gray-700 flex-shrink-0 w-24 truncate">
                  {layer.name}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={layer.opacity ?? 100}
                  onChange={(e) =>
                    setLayerOpacity(layer.id, Number(e.target.value))
                  }
                  className="mx-3 flex-1 slider-green"
                  style={{ minWidth: 0 }}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={layer.opacity ?? 100}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val < 0) val = 0;
                    if (val > 100) val = 100;
                    setLayerOpacity(layer.id, val);
                  }}
                  className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center text-sm ml-2"
                  style={{ flexShrink: 0 }}
                />
                <span className="ml-2 text-xs text-gray-500 flex-shrink-0">
                  %
                </span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Layers fill the rest */}
      <div className="p-3 flex-1 overflow-y-auto min-w-0">
        <h4 className="text-base font-medium text-gray-700 mb-2">Layers</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="layers-list">
            {(provided) => (
              <div
                className="space-y-1 min-w-0"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {layers.map((layer, idx) => (
                  <Draggable
                    key={layer.id}
                    draggableId={layer.id.toString()}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`border-b border-gray-200 py-1 px-1 flex flex-col transition ${
                          snapshot.isDragging ? "bg-gray-200" : ""
                        }`}
                        style={provided.draggableProps.style}
                      >
                        {/* Layer row */}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center min-w-0">
                            <LayerIcon layer={layer} />
                            <span className="text-sm text-gray-600 truncate">
                              {layer.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            {/* Drag handle */}
                            <span
                              className="cursor-grab text-xs"
                              title="Drag to reorder"
                              style={{ padding: "2px 0" }}
                            >
                              ☰
                            </span>
                            {/* Show/hide */}
                            <button
                              onClick={() => toggleLayer(layer.id)}
                              className={`p-1 rounded ${
                                layer.visible
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                              title={
                                layer.visible ? "Hide layer" : "Show layer"
                              }
                              style={{ padding: "2px" }}
                            >
                              {layer.visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            {/* Remove */}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Remove "${layer.name}" from layers?`
                                  )
                                ) {
                                  removeLayer(layer.id);
                                }
                              }}
                              className="p-1 rounded text-red-500 hover:bg-red-50"
                              title="Remove layer"
                              style={{ padding: "2px" }}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Opacity controls below, always on new line */}
                        <div className="flex items-center space-x-1 mt-1">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={layer.opacity ?? 100}
                            onChange={(e) =>
                              setLayerOpacity(layer.id, Number(e.target.value))
                            }
                            className="slider-green"
                            style={{ width: "60px", height: "2px" }}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={layer.opacity ?? 100}
                            onChange={(e) => {
                              let val = Number(e.target.value);
                              if (val < 0) val = 0;
                              if (val > 100) val = 100;
                              setLayerOpacity(layer.id, val);
                            }}
                            className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs"
                            style={{ height: "18px" }}
                          />
                          <span className="text-xs text-gray-400">%</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* Export button at the bottom */}
      <div className="p-4 border-t border-gray-200 min-w-0">
        <button
          className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center space-x-2 transition"
          onClick={() => alert("Export functionality coming soon!")}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default MapControlsSidebar;
