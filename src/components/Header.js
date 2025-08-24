import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/favicon.png"; // Assuming you have a logo image in assets

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-green-200 px-4 py-4 border-b border-green-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center" onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="Logo"              
              className="w-8 h-8 mr-2"
            />
            <button
              // onClick={() => navigate("/")}
              className={`text-lg font-semibold ${
                location.pathname === "/"
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              MapMeld
            </button>
          </div>
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
