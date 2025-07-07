import React, { useState, useEffect } from 'react';
import { supabase } from '../firebase/config';
import MediaDetailsModal from './MediaDetailsModal';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
  title?: string;
  description?: string;
  mediatype: 'artwork' | 'video';
  isexternallink?: boolean;
  storagepath?: string;
}

interface ArtworkItem {
  id: string;
  title: string;
  description: string;
  image: string;
  height: number;
  isExternalLink?: boolean;
}

const WorkPageGallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for media items
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const { data, error } = await supabase
          .from('website_media')
          .select('*')
          .eq('mediatype', 'artwork')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching media items:', error);
          setError('Failed to load artworks');
          return;
        }

        setMediaItems(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media items:', error);
        setError('Failed to load artworks');
        setLoading(false);
      }
    };

    fetchMediaItems();

    // Set up real-time subscription
    const subscription = supabase
      .channel('artwork_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'website_media',
          filter: 'mediatype=eq.artwork'
        },
        (payload) => {
          console.log('Real-time artwork update:', payload);
          fetchMediaItems(); // Refresh the data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter artworks only (both uploaded files and external links)
  const artworkItems = mediaItems.filter(item => 
    item.mediatype === 'artwork' || 
    (item.isexternallink && item.type === 'image-link')
  );

  // Convert MediaItem to ArtworkItem format for compatibility with modal
  const convertToArtworkItem = (mediaItem: MediaItem): ArtworkItem => ({
    id: mediaItem.id,
    title: mediaItem.title || mediaItem.name,
    description: mediaItem.description || 'No description available',
    image: mediaItem.url,
    height: 200 + Math.random() * 150, // Random height for masonry layout (200-350px)
    isExternalLink: mediaItem.isexternallink
  });

  const handleArtworkClick = (mediaItem: MediaItem) => {
    setSelectedArtwork(convertToArtworkItem(mediaItem));
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  if (loading) {
    return (
      <>
        {/* Desktop Loading */}
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] lg:w-[780px] xl:w-[900px]">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Desktop Error */}
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] lg:w-[780px] xl:w-[900px]">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400">{error}</p>
          </div>
        </div>

        {/* Mobile Error */}
        <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (artworkItems.length === 0) {
    return (
      <>
        {/* Desktop Empty State */}
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] lg:w-[780px] xl:w-[900px]">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No artworks available</p>
          </div>
        </div>

        {/* Mobile Empty State */}
        <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No artworks available</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Pinterest-style Gallery */}
      <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] lg:w-[780px] xl:w-[900px]">
        <div className="columns-2 lg:columns-3 gap-3 lg:gap-4 h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 lg:pr-4">
          {artworkItems.map((mediaItem) => {
            const artworkItem = convertToArtworkItem(mediaItem);
            return (
              <div
                key={mediaItem.id}
                onClick={() => handleArtworkClick(mediaItem)}
                className="break-inside-avoid mb-3 lg:mb-4 cursor-pointer group"
              >
                <div 
                  className="w-full bg-gray-700 rounded-2xl lg:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] relative"
                  style={{ height: `${artworkItem.height}px` }}
                >
                  <img 
                    src={mediaItem.url} 
                    alt={mediaItem.title || mediaItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  
                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold text-sm lg:text-base mb-1">
                        {mediaItem.title || mediaItem.name}
                      </h3>
                      {mediaItem.description && (
                        <p className="text-gray-300 text-xs lg:text-sm line-clamp-2">
                          {mediaItem.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Pinterest-style Gallery */}
      <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
        <div className="columns-2 gap-3 h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
          {artworkItems.map((mediaItem) => {
            const artworkItem = convertToArtworkItem(mediaItem);
            return (
              <div
                key={mediaItem.id}
                onClick={() => handleArtworkClick(mediaItem)}
                className="break-inside-avoid mb-3 cursor-pointer group"
              >
                <div 
                  className="w-full bg-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] relative"
                  style={{ height: `${Math.max(artworkItem.height * 0.6, 120)}px` }}
                >
                  <img 
                    src={mediaItem.url} 
                    alt={mediaItem.title || mediaItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  
                  {/* Mobile hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-3">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {mediaItem.title || mediaItem.name}
                      </h3>
                      {mediaItem.description && (
                        <p className="text-gray-300 text-xs line-clamp-2">
                          {mediaItem.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Details Modal */}
      {selectedArtwork && (
        <MediaDetailsModal 
          artwork={selectedArtwork} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default WorkPageGallery;