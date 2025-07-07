import React, { useState, useEffect } from 'react';
import { supabase } from '../firebase/config';
import { Play, ExternalLink } from 'lucide-react';
import VideoDetailsModal from './VideoDetailsModal';

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

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  isExternalLink?: boolean;
  type: string;
}

const VideosPageGallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for media items
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const { data, error } = await supabase
          .from('website_media')
          .select('*')
          .eq('mediatype', 'video')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching media items:', error);
          setError('Failed to load videos');
          return;
        }

        setMediaItems(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media items:', error);
        setError('Failed to load videos');
        setLoading(false);
      }
    };

    fetchMediaItems();

    // Set up real-time subscription
    const subscription = supabase
      .channel('video_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'website_media',
          filter: 'mediatype=eq.video'
        },
        (payload) => {
          console.log('Real-time video update:', payload);
          fetchMediaItems(); // Refresh the data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter videos only (both uploaded files and external links)
  const videoItems = mediaItems.filter(item => 
    item.mediatype === 'video' || 
    (item.isexternallink && item.type === 'video-link')
  );

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return url; // Fallback to original URL
  };

  // Convert MediaItem to VideoItem format for compatibility with modal
  const convertToVideoItem = (mediaItem: MediaItem): VideoItem => ({
    id: mediaItem.id,
    title: mediaItem.title || mediaItem.name,
    description: mediaItem.description || 'No description available',
    url: mediaItem.url,
    isExternalLink: mediaItem.isexternallink,
    type: mediaItem.type
  });

  // Function to handle video click
  const handleVideoClick = (item: MediaItem) => {
    if (item.isexternallink) {
      // For external links, open in new tab
      window.open(item.url, '_blank');
    } else {
      // For uploaded videos, open in modal
      setSelectedVideo(convertToVideoItem(item));
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  // Function to render video thumbnail
  const renderVideoThumbnail = (item: MediaItem) => {
    if (item.isexternallink) {
      // For external links, try to get YouTube thumbnail or use a placeholder
      const thumbnailUrl = item.url.includes('youtube.com') || item.url.includes('youtu.be') 
        ? getYouTubeThumbnail(item.url)
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4dGVybmFsIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      return (
        <img 
          src={thumbnailUrl}
          alt={item.title || item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4dGVybmFsIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
      );
    } else {
      // For uploaded video files, show a video thumbnail placeholder
      return (
        <div className="w-full h-full bg-gray-600 flex items-center justify-center relative">
          <div className="text-center">
            <Play className="w-8 h-8 md:w-12 md:h-12 text-white mx-auto mb-2" />
            <p className="text-white text-xs md:text-sm">Video File</p>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <>
        {/* Desktop Loading */}
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] md:w-[calc(100%-20rem)] lg:w-[780px] xl:w-[900px]">
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
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] md:w-[calc(100%-20rem)] lg:w-[780px] xl:w-[900px]">
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

  if (videoItems.length === 0) {
    return (
      <>
        {/* Desktop Empty State */}
        <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] md:w-[calc(100%-20rem)] lg:w-[780px] xl:w-[900px]">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No videos available</p>
          </div>
        </div>

        {/* Mobile Empty State */}
        <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No videos available</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Videos Grid */}
      <div className="hidden md:block absolute right-4 lg:right-20 top-24 lg:top-32 w-[calc(100%-2rem)] md:w-[calc(100%-20rem)] lg:w-[780px] xl:w-[900px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6 max-h-[400px] lg:max-h-[520px] xl:max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 lg:pr-4">
          {videoItems.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 group hover:bg-gray-750 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              <div className="relative w-full h-32 md:h-48 bg-gray-700 rounded-2xl md:rounded-3xl overflow-hidden mb-3 md:mb-4">
                {renderVideoThumbnail(video)}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    {video.isexternallink ? (
                      <ExternalLink className="w-6 h-6 md:w-8 md:h-8 text-black" />
                    ) : (
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" fill="currentColor" />
                    )}
                  </div>
                </div>

                {/* Video type indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full px-2 py-1">
                  <span className="text-white text-xs">
                    {video.isexternallink ? 'Link' : 'File'}
                  </span>
                </div>
              </div>
              
              <div className="group-hover:translate-y-[-2px] transition-transform duration-300">
                <h3 className="text-white text-base md:text-xl font-semibold mb-2">
                  {video.title || video.name}
                </h3>
                {video.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {video.isexternallink ? 'External Video' : 'Uploaded Video'}
                  </span>
                  {video.isexternallink && (
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Videos Grid */}
      <div className="md:hidden absolute top-32 left-4 right-4 bottom-20 z-20">
        <div className="grid grid-cols-1 gap-4 max-h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
          {videoItems.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="bg-gray-800 rounded-xl p-3 group hover:bg-gray-750 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              <div className="relative w-full h-32 bg-gray-700 rounded-2xl overflow-hidden mb-3">
                {renderVideoThumbnail(video)}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    {video.isexternallink ? (
                      <ExternalLink className="w-6 h-6 text-black" />
                    ) : (
                      <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                    )}
                  </div>
                </div>

                {/* Video type indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full px-2 py-1">
                  <span className="text-white text-xs">
                    {video.isexternallink ? 'Link' : 'File'}
                  </span>
                </div>
              </div>
              
              <div className="group-hover:translate-y-[-2px] transition-transform duration-300">
                <h3 className="text-white text-base font-semibold mb-2">
                  {video.title || video.name}
                </h3>
                {video.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {video.isexternallink ? 'External Video' : 'Uploaded Video'}
                  </span>
                  {video.isexternallink && (
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Details Modal */}
      {selectedVideo && (
        <VideoDetailsModal 
          video={selectedVideo} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default VideosPageGallery;