import React from 'react';

const HowToUsePage = () => {
  return (
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">How to Use MapMeld</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Add your first map using the "Add a map" dropdown</li>
                <li>Add a second map to enable overlay functionality</li>
                <li>Adjust layer visibility and settings in the Layers panel</li>
                <li>Export your overlaid map when analysis is complete</li>
              </ol>
            </div>
          </section>
          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage;
