import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-7 py-6">
      {/* Left Logo */}
      <button 
        onClick={onLogoClick}
        className="w-10 h-14 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        aria-label="Home"
      >
        <div className="w-6 h-6 bg-white rounded"></div>
      </button>

      {/* Right Logo */}
      <button 
        onClick={onLogoClick}
        className="w-34 h-10 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        aria-label="Home"
      >
        <span className="text-white font-bold text-sm">FIRMA</span>
      </button>
    </header>
  );
};

export default Header;