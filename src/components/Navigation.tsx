import React from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { name: 'Home', key: 'home' },
    { name: 'Videos', key: 'videos' },
    { name: 'Work', key: 'work' }
  ];

  return (
    <>
      {/* Desktop Navigation - Fully responsive */}
      <nav className="hidden md:flex absolute left-4 lg:left-20 top-24 lg:top-36 flex-col space-y-2 lg:space-y-4 z-30">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onPageChange(item.key)}
            className={`text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight transition-colors duration-200 hover:text-white ${
              currentPage === item.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation - Fixed bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-t border-gray-700 z-50 safe-area-pb">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onPageChange(item.key)}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-colors duration-200 text-center ${
                currentPage === item.key 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;