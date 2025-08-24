// HowToUsePage.js
import React from "react";
import { Map, Plus, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: <Plus className="w-6 h-6 text-green-600" />,
    title: "Add a Map",
    description:
      "Click on 'Add a map' in the left sidebar to choose built-in maps or upload your own custom map files.",
  },
  {
    icon: <Map className="w-6 h-6 text-blue-600" />,
    title: "View & Navigate",
    description:
      "Use the main map area to zoom, pan, and explore your layers interactively.",
  },
  {
    icon: <Plus className="w-6 h-6 text-purple-600" />,
    title: "Plot Custom Points",
    description:
      "Click on 'Custom points' to create custom points or polygons. Enter coordinates, layer name, and choose colors.",
  },
  {
    icon: <Eye className="w-6 h-6 text-yellow-600" />,
    title: "Toggle Layers",
    description:
      "Use the Map Controls Sidebar to show, hide, reorder, or adjust opacity of layers.",
  },
  {
    icon: <Download className="w-6 h-6 text-red-600" />,
    title: "Export Layers",
    description:
      "Once done, click 'Export' in the Map Controls Sidebar to save your layers as a file.",
  },
];

const HowToUsePage = () => {
  return (
    <div className="min-h-screen p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Use MapMeld</h1>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <div className="mr-4">{step.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">{step.title}</h2>
              <p className="text-gray-600 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToUsePage;
