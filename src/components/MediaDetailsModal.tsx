import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import ContactForm from './ContactForm';

interface ArtworkItem {
  id: string;
  title: string;
  description: string;
  image: string;
  height: number;
  isExternalLink?: boolean;
}

interface MediaDetailsModalProps {
  artwork: ArtworkItem;
  onClose: () => void;
}

const MediaDetailsModal: React.FC<MediaDetailsModalProps> = ({ artwork, onClose }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  const handlePurchaseClick = () => {
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl">
        {/* Main modal content */}
        <div className="bg-gray-800 rounded-2xl md:rounded-[38px] p-4 md:p-8 relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors duration-200 z-10"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Image */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="w-full h-64 md:h-80 lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] bg-gray-700 rounded-2xl md:rounded-3xl overflow-hidden">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-auto lg:min-h-[400px] xl:min-h-[500px]">
              <div>
                <span className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">
                  {artwork.isExternalLink ? 'External Artwork' : 'Artwork'}
                </span>
                <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2 mb-3 md:mb-6 leading-tight">
                  {artwork.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
              </div>

              {/* Purchase section */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Interested in this piece?</p>
                    <p className="text-white text-lg font-semibold">Contact for pricing and availability</p>
                  </div>
                  
                  <button
                    onClick={handlePurchaseClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full transition-all duration-200 text-center text-sm md:text-base flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ShoppingCart size={18} className="md:w-5 md:h-5" />
                    Purchase Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <ContactForm 
          artworkTitle={artwork.title}
          onClose={handleCloseContactForm}
        />
      )}
    </div>
  );
};

export default MediaDetailsModal;