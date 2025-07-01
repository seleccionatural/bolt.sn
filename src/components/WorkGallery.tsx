import React, { useState } from 'react';
import WorkModal from './WorkModal';

interface ArtworkItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  height: number;
}

const WorkGallery: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);

  const artworksData: ArtworkItem[] = [
    {
      id: 1,
      title: "Abstract Digital Art",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 225
    },
    {
      id: 2,
      title: "Modern Architecture",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 291
    },
    {
      id: 3,
      title: "Creative Photography",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 157
    },
    {
      id: 4,
      title: "Brand Identity",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 155
    },
    {
      id: 5,
      title: "Digital Illustration",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 159
    },
    {
      id: 6,
      title: "Web Design Concept",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 247
    },
    {
      id: 7,
      title: "Minimalist Design",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 200
    },
    {
      id: 8,
      title: "Color Study",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 180
    },
    {
      id: 9,
      title: "Typography Exploration",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 270
    },
    {
      id: 10,
      title: "Abstract Composition",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 190
    },
    {
      id: 11,
      title: "Urban Landscape",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 260
    },
    {
      id: 12,
      title: "Geometric Patterns",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 175
    },
    {
      id: 13,
      title: "Nature Study",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 220
    },
    {
      id: 14,
      title: "Digital Collage",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 185
    },
    {
      id: 15,
      title: "Conceptual Art",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 240
    },
    {
      id: 16,
      title: "Mixed Media",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 165
    },
    {
      id: 17,
      title: "Contemporary Art",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 210
    },
    {
      id: 18,
      title: "Visual Expression",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 195
    },
    {
      id: 19,
      title: "Artistic Vision",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 230
    },
    {
      id: 20,
      title: "Creative Process",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 205
    },
    {
      id: 21,
      title: "Digital Painting",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 255
    },
    {
      id: 22,
      title: "Experimental Art",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 170
    },
    {
      id: 23,
      title: "Modern Expression",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 285
    },
    {
      id: 24,
      title: "Artistic Innovation",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 160
    },
    {
      id: 25,
      title: "Visual Narrative",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 215
    },
    {
      id: 26,
      title: "Creative Exploration",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 245
    },
    {
      id: 27,
      title: "Artistic Journey",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 180
    },
    {
      id: 28,
      title: "Design Philosophy",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 200
    },
    {
      id: 29,
      title: "Creative Synthesis",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400",
      height: 265
    }
  ];

  const handleArtworkClick = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <>
      <div className="absolute right-20 top-32 w-[780px]">
        <div className="columns-3 gap-4 max-h-[520px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-4">
          {artworksData.map((artwork) => (
            <div
              key={artwork.id}
              onClick={() => handleArtworkClick(artwork)}
              className="break-inside-avoid mb-4 cursor-pointer group"
            >
              <div 
                className="w-full bg-gray-700 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{ height: `${artwork.height}px` }}
              >
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArtwork && (
        <WorkModal 
          artwork={selectedArtwork} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default WorkGallery;