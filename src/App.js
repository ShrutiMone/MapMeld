import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom";
import Header from "./components/Header";
import MapPage from "./pages/MapPage";
import HowToUsePage from "./pages/HowToUsePage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";

import { layersData, builtInMapsData } from "./data/layersData";

function App() {
  // This is storing state of MapPage component. This enables MapPage component to store its state even though we change pages - so even if we change page to About and come back to MapPage, the data of MapPage is not deleted
  const [showBuiltInDropdown, setShowBuiltInDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGBIFPopup, setShowGBIFPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [baseOpacity, setBaseOpacity] = useState(100);
  const [editingLayer, setEditingLayer] = useState(null);
  const [layers, setLayers] = useState(layersData);

  return (
    <HashRouter>
      <div className="min-h-screen bg-green-100">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <MapPage
                showBuiltInDropdown={showBuiltInDropdown}
                setShowBuiltInDropdown={setShowBuiltInDropdown}
                showUploadModal={showUploadModal}
                setShowUploadModal={setShowUploadModal}
                showGBIFPopup={showGBIFPopup}
                setShowGBIFPopup={setShowGBIFPopup}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                mapInstance={mapInstance}
                setMapInstance={setMapInstance}
                editingImage={editingImage}
                setEditingImage={setEditingImage}
                baseOpacity={baseOpacity}
                setBaseOpacity={setBaseOpacity}
                editingLayer={editingLayer}
                setEditingLayer={setEditingLayer}
                layers={layers}
                setLayers={setLayers}
              />
            }
          />
          <Route path="/howto" element={<HowToUsePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
