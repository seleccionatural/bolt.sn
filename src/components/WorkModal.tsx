import React, { useState } from 'react';
import { X } from 'lucide-react';
import ContactForm from './ContactForm';

interface ArtworkItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  height: number;
}

interface WorkModalProps {
  artwork: ArtworkItem;
  onClose: () => void;
}

const WorkModal: React.FC<WorkModalProps> = ({ artwork, onClose }) => {
  const [showContactForm, setShowContactForm] = useState(false);

  const handleContactClick = () => {
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
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative">
        {/* Background faded gallery */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-20 top-32 w-[780px]">
            <div className="columns-3 gap-4 max-h-[520px] overflow-hidden">
              {/* Simplified background grid */}
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[225px] bg-gray-700 rounded-3xl"></div>
              </div>
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[291px] bg-gray-700 rounded-3xl"></div>
              </div>
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[157px] bg-gray-700 rounded-3xl"></div>
              </div>
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[155px] bg-gray-700 rounded-3xl"></div>
              </div>
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[159px] bg-gray-700 rounded-3xl"></div>
              </div>
              <div className="break-inside-avoid mb-4">
                <div className="w-full h-[247px] bg-gray-700 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main modal content */}
        <div className="bg-gray-800 rounded-[38px] p-8 max-w-4xl mx-4 relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors duration-200 z-10"
          >
            <X size={24} />
          </button>

          <div className="flex gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-[355px] h-[324px] bg-gray-700 rounded-3xl overflow-hidden">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-[324px]">
              <div>
                <span className="text-gray-500 text-sm font-semibold">
                  {artwork.category}
                </span>
                <h2 className="text-white text-2xl font-semibold mt-2 mb-4">
                  {artwork.title}
                </h2>
                <p className="text-white text-base leading-relaxed">
                  {artwork.description}
                </p>
              </div>

              <button
                onClick={handleContactClick}
                className="bg-gray-750 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200 text-center mt-6"
              >
                Contact to Purchase
              </button>
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

export default WorkModal;