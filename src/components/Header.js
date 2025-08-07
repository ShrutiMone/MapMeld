import React from 'react';
import { Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-green-200 px-4 py-3 border-b border-green-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/')}
            className={`text-lg font-semibold ${location.pathname === '/' ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
          >
            MapMeld
          </button>
          <button 
            onClick={() => navigate('/howto')}
            className={`${location.pathname === '/howto' ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'}`}
          >
            How to use
          </button>
          <button 
            onClick={() => navigate('/about')}
            className={`${location.pathname === '/about' ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'}`}
          >
            About
          </button>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
