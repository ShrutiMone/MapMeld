import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom";
import Header from "./components/Header";
import MapPage from "./pages/MapPage";
import HowToUsePage from "./pages/HowToUsePage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-green-100">
        <Header />
        <Routes>
          <Route exact path="/" element={<MapPage />} />
          <Route path="/howto" element={<HowToUsePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
