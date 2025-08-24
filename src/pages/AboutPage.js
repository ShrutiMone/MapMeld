// AboutPage.js
import React from "react";
// import logo from "../assets/logo.png"; // your favicon/logo

const features = [
  "Add multiple layers to visualize data on the map.",
  "Plot custom lat-long points or polygons with configurable colors.",
  "Quickly add built-in maps such as India's forests and water sources.",
  "Toggle visibility, reorder, and adjust opacity of layers in real-time.",
  "Export your map layers for sharing or later use.",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen p-6 bg-green-50">
      <div className="flex items-center mb-6">
        {/* <img src={logo} alt="MapMeld Logo" className="w-12 h-12 mr-3" /> */}
        <h1 className="text-3xl font-bold text-gray-800">About MapMeld</h1>
      </div>

      <p className="text-gray-700 mb-4">
        MapMeld is a lightweight web-based tool designed to help researchers, students,
        and GIS enthusiasts visualize spatial data on interactive maps. You can easily
        manage multiple layers, plot points or polygons, and explore built-in data maps
        like forests and water sources across India.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Key Features</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Our Vision</h2>
      <p className="text-gray-700">
        MapMeld aims to make spatial data visualization accessible, intuitive, and interactive.
        Whether you are analyzing environmental data or creating educational maps,
        MapMeld provides a simple and fast way to explore geospatial information.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Developers</h2>
      <p className="text-gray-700">
        Madhur Vaidya
      </p>
      <p className="text-gray-700">
        Shruti Mone
      </p>
    </div>
  );
};

export default AboutPage;
