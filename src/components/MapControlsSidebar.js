import React from "react";
import { Eye, EyeOff, Minus, Download } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const MapControlsSidebar = ({
  layers,
  toggleLayer,
  removeLayer,
  moveLayer,
}) => {
  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;
    moveLayer(result.source.index, result.destination.index);
  };

  return (
    <div className="w-44 bg-gray-100 border-l border-gray-200 flex flex-col h-full">
      {/* Overlay Settings at the top */}
      <div className="border-b border-gray-200 bg-gray-200 p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Overlay Settings
        </h4>
        <p className="text-xs text-gray-500">Min 2 maps required</p>
      </div>
      {/* Layers fill the rest */}
      <div className="p-3 flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Layers</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="layers-list">
            {(provided) => (
              <div
                className="space-y-2"
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
                        className={`flex items-center justify-between border-b border-gray-200 py-2 transition ${
                          snapshot.isDragging ? "bg-green-100" : ""
                        }`}
                        style={provided.draggableProps.style}
                      >
                        <span className="text-sm text-gray-600">
                          {layer.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          {/* Drag handle */}
                          <span className="cursor-grab" title="Drag to reorder">
                            ☰
                          </span>
                          {/* Show/hide */}
                          <button
                            onClick={() => toggleLayer(layer.id)}
                            className={`p-1 rounded ${
                              layer.visible ? "text-gray-700" : "text-gray-400"
                            }`}
                            title={layer.visible ? "Hide layer" : "Show layer"}
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
                          >
                            <Minus className="w-4 h-4" />
                          </button>
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
      <div className="p-3 border-t border-gray-200">
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
