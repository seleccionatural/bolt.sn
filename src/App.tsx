import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ContentArea from './components/ContentArea';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogoClick = () => {
    setCurrentPage('home');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-inter">
      <Header onLogoClick={handleLogoClick} />
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      <ContentArea currentPage={currentPage} />
    </div>
  );
}

export default App;