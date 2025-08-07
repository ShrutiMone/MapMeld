import React from 'react';

const AboutPage = () => {
  return (
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About MapMeld</h1>
        <p className="text-lg text-gray-700 mb-4">
          MapMeld is a tool for overlaying geographic and biodiversity maps to derive insights.
        </p>
        <p className="text-gray-700">Use it to visualize forest cover, water sources, species data, and more.</p>
      </div>
    </div>
  );
};

export default AboutPage;
