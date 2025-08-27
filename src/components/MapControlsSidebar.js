// components/MapControlsSidebar.js
import React, { useRef, useState } from "react";
import { Eye, EyeOff, Minus, Download, Settings, MousePointer } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AlertModal from "./AlertModal";
import ImageAlignmentTool from "./ImageAlignmentTool";
import InteractiveImageAlignment from "./InteractiveImageAlignment";
import ExportModal from "./ExportModal";
import "leaflet-easyprint";

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 230;
const MAX_WIDTH = 280;

const MapControlsSidebar = ({
  layers,
  toggleLayer,
  removeLayer,
  moveLayer,
  setLayerOpacity,
  updateLayer,
  mapInstance,
  editingImage,
  setEditingImage,
  baseOpacity,
  setBaseOpacity,
  setEditingLayer
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [showAlert, setShowAlert] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const resizing = useRef(false);
  const sidebarRef = useRef(null);

  const handleExportImage = () => {
    if (!mapInstance) return;

    const L = require("leaflet");
    require("leaflet-easyprint");

    const printer = L.easyPrint({
      tileLayer: mapInstance.tileLayer,
      sizeModes: ["Current"],
      filename: "map-export",
      exportOnly: true,
      hideControlContainer: true,
    }).addTo(mapInstance);

    printer.printMap("CurrentSize", "map-export");
    setShowExportModal(false);
  };

  const handleExportMapMeld = () => {
    const blob = new Blob([JSON.stringify(layers, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map_layers.MapMeld";
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

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
  }, []);

  // Mouse events for resizing
  const handleMouseDown = (e) => {
    resizing.current = true;
    document.body.style.cursor = "col-resize";
    resizing.startX = e.clientX;
    resizing.startWidth = sidebarWidth;
  };

  const handleMouseMove = (e) => {
    if (!resizing.current) return;
    const dx = e.clientX - resizing.startX;
    let newWidth = resizing.startWidth - dx;

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
  }, [resizing.current]);

  const LayerIcon = ({ layer, setEditingLayer }) => {
    const color = layer.data?.style?.color || "gray";

    switch (layer.type) {
      case "polygon":
      case "rectangle":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <polygon
              points="4,4, 12,4, 14,12, 6,12"
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
      case "image":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
          <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="11.5" cy="5" r="1.5" fill="currentColor"/>
          <path d="M2.5 12L6.5 8L10.5 12H2.5Z" fill="currentColor"/>
        </svg>
        );
      case "tile":
        return (
          <svg width="16" height="16" className="mr-2 flex-shrink-0">
            <ellipse cx="8" cy="3" rx="5" ry="2" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M3 3v7c0 1.1 2.2 2 5 2s5-0.9 5-2V3" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M3 7c0 1.1 2.2 2 5 2s5-0.9 5-2" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M2 12h4v-2l3 3-3 3v-2H2v-2Z" fill="currentColor"/>
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

      {/* Base Tile Layer Opacity Control */}
      <div className="p-3 border-b border-gray-200">
        <h4 className="text-base font-medium text-gray-700 mb-2">Base Map</h4>
        <div className="flex items-center space-x-1">
          <input
            type="range"
            min={0}
            max={100}
            value={baseOpacity}
            onChange={(e) => setBaseOpacity(Number(e.target.value))}
            className="slider-green"
            style={{ height: "2px" }}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={baseOpacity}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val < 0) val = 0;
              if (val > 100) val = 100;
              setBaseOpacity(val);
            }}
            className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center text-xs"
            style={{ height: "18px" }}
          />
          <span className="text-xs text-gray-400">%</span>
        </div>
      </div>

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
                        <div className="flex items-center justify-between w-full"
                          onDoubleClick={() => setEditingLayer(layer)}
                          >
                          <div className="flex items-center min-w-0">
                            <LayerIcon layer={layer} />
                            <span className="text-sm text-gray-600 truncate">
                              {layer.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            {/* Alignment button for image layers */}
                            {layer.type === 'image' && (
                              <button
                                onClick={() => setEditingImage(layer)}
                                className="p-1 rounded text-blue-500 hover:bg-blue-50"
                                title="Align image"
                                style={{ padding: "2px" }}
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                            )}
                            
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
      <button
        className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center space-x-2 transition"
        onClick={() => setShowExportModal(true)}
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>

      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportImage={handleExportImage}
        onExportMapMeld={handleExportMapMeld}
      />
      
      <AlertModal
        show={showAlert}
        content="Export functionality coming soon!"
        onClose={() => setShowAlert(false)}
      />
      
      {/* Image Alignment Tool Modal */}
      {editingImage && !interactiveMode && (
        <ImageAlignmentTool
          imageLayer={editingImage}
          onUpdate={(updatedLayer) => {
            updateLayer(updatedLayer);
          }}
          onClose={() => {
            setEditingImage(null);
            setInteractiveMode(false);
          }}
          map={mapInstance}
          onInteractiveMode={() => {
            if (mapInstance) {
              setInteractiveMode(true);
            } else {
              setShowAlert(true);
              setEditingImage(null);
            }
          }}
        />
      )}
      
      {/* Interactive Image Alignment Modal */}
      {editingImage && interactiveMode && mapInstance && (
        <InteractiveImageAlignment
          imageLayer={editingImage}
          onUpdate={(updatedLayer) => {
            updateLayer(updatedLayer);
          }}
          onClose={() => {
            setEditingImage(null);
            setInteractiveMode(false);
          }}
          map={mapInstance}
        />
      )}
    </div>
  );
};

export default MapControlsSidebar;