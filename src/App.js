import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MapPage from "./pages/MapPage";
import HowToUsePage from "./pages/HowToUsePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-green-100">
        <Header />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/howto" element={<HowToUsePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
