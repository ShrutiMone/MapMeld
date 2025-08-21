import React, { useEffect, useRef } from "react";
import { Eye, EyeOff, Plus, ChevronDown, ChevronUp, Minus } from "lucide-react";

const SIDEBAR_WIDTH = 176;

const Sidebar = ({
  setShowUploadModal,
  layers,
  toggleLayer,
  addBuiltInMap,
  builtInMaps,
  removeLayer,
}) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const [showBuiltInList, setShowBuiltInList] = React.useState(false);
  const addMapDropdownRef = useRef(null);
  const addMapBtnRef = useRef(null);

  // Hide add map dropdown when clicking outside
  useEffect(() => {
    if (!showOptions) return;
    const handleClick = (e) => {
      if (
        addMapDropdownRef.current &&
        !addMapDropdownRef.current.contains(e.target) &&
        (!addMapBtnRef.current || !addMapBtnRef.current.contains(e.target))
      ) {
        setShowOptions(false);
        setShowBuiltInList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showOptions]);

  const optionStyle =
    "w-full px-3 py-3 text-left text-sm border-b border-gray-200 flex items-center justify-between hover:bg-gray-200 bg-white cursor-pointer transition";

  return (
    <div className="w-44 bg-gray-100 border-r border-gray-200 flex flex-col relative">
      <div className="flex flex-col">
        <button
          ref={addMapBtnRef}
          onClick={() => setShowOptions(!showOptions)}
          className={optionStyle + " font-medium"}
          style={{ position: "relative", zIndex: 50 }}
        >
          <span>Add a map</span>
          <Plus className="w-4 h-4" />
        </button>
        <button className={optionStyle}>
          <span>Lat-long points</span>
          <Plus className="w-4 h-4" />
        </button>
        <button className={optionStyle}>
          <span>GBIF data</span>
          <Plus className="w-4 h-4" />
        </button>
        <button className={optionStyle + " text-gray-500"}>
          <span>Import MapMeld file</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add a map Dropdown */}
      {showOptions && (
        <div
          ref={addMapDropdownRef}
          style={{
            position: "absolute",
            top: "0px",
            left: `${SIDEBAR_WIDTH}px`,
            width: "260px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            zIndex: 4000,
            padding: "0.5rem 0",
          }}
        >
          <button
            onClick={() => setShowBuiltInList(!showBuiltInList)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-200 flex items-center justify-between"
          >
            <span className="flex items-center">
              <Plus className="w-4 h-4 mr-2 text-gray-400" />
              Built-in map
            </span>
            {showBuiltInList ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {showBuiltInList && (
            <div className="bg-white border-b border-gray-200">
              {builtInMaps.map((map, index) => (
                <button
                  key={index}
                  onClick={() => {
                    addBuiltInMap(map.name);
                    setShowBuiltInList(false);
                    setShowOptions(false);
                  }}
                  className="w-full px-6 py-2 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <div className="font-medium text-sm">{map.name}</div>
                    <div className="text-xs text-gray-500">{map.category}</div>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
            style={{
              borderTop: showBuiltInList ? "none" : "1px solid #e5e7eb",
            }}
          >
            <Plus className="w-4 h-4 mr-2 text-gray-400" />
            Upload custom map
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
