import React from 'react';

const MapVisualization = () => (
  <div className="w-full h-full bg-white relative">
    <div
      className="w-full h-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e8f4f8'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23666' text-anchor='middle' dy='.3em'%3EMap will render here (Leaflet)%3C/text%3E%3C/svg%3E")`
      }}
    >
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          <path
            d="M200 150 Q250 120 300 130 Q350 125 400 140 Q450 150 500 180 Q530 200 540 250 Q545 300 530 350 Q520 400 500 430 Q480 460 450 480 Q400 500 350 490 Q300 485 280 460 Q260 440 250 420 Q240 380 230 350 Q220 320 210 290 Q200 260 195 230 Q190 200 200 150 Z"
            fill="rgba(34, 139, 34, 0.3)"
            stroke="rgba(34, 139, 34, 0.6)"
            strokeWidth="2"
          />
          <circle cx="180" cy="300" r="30" fill="rgba(65, 105, 225, 0.4)" />
          <circle cx="450" cy="200" r="20" fill="rgba(65, 105, 225, 0.4)" />
          <circle cx="380" cy="350" r="25" fill="rgba(65, 105, 225, 0.4)" />
          <circle cx="300" cy="200" r="40" fill="rgba(34, 139, 34, 0.5)" />
          <circle cx="420" cy="280" r="35" fill="rgba(34, 139, 34, 0.5)" />
          <circle cx="250" cy="220" r="3" fill="#ff4444" />
          <text x="255" y="218" fontSize="10" fill="#333">Delhi</text>
          <circle cx="150" cy="350" r="3" fill="#ff4444" />
          <text x="155" y="348" fontSize="10" fill="#333">Mumbai</text>
          <circle cx="450" cy="420" r="3" fill="#ff4444" />
          <text x="455" y="418" fontSize="10" fill="#333">Chennai</text>
        </svg>
      </div>
    </div>
  </div>
);

export default MapVisualization;
