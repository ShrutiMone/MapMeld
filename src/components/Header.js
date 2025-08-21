import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-green-200 px-4 py-4 border-b border-green-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/")}
            className={`text-lg font-semibold ${
              location.pathname === "/"
                ? "text-gray-900"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            MapMeld
          </button>
          <button
            onClick={() => navigate("/howto")}
            className={`${
              location.pathname === "/howto"
                ? "text-gray-900 font-medium"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            How to use
          </button>
          <button
            onClick={() => navigate("/about")}
            className={`${
              location.pathname === "/about"
                ? "text-gray-900 font-medium"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            About
          </button>
        </div>
        {/* Export button removed */}
      </div>
    </header>
  );
};

export default Header;
