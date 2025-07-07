import React, { useRef, useEffect, useState } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  isExternalLink?: boolean;
  type: string;
}

interface VideoDetailsModalProps {
  video: VideoItem;
  onClose: () => void;
}

const VideoDetailsModal: React.FC<VideoDetailsModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Auto-focus and play video when modal opens
  useEffect(() => {
    if (videoRef.current && !video.isExternalLink && !videoError) {
      // Set video to a reasonable volume
      videoRef.current.volume = 0.7;
      
      // Try to play the video (will fail if user hasn't interacted with page yet)
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play prevented:', error);
          // Auto-play was prevented, user will need to click play
        });
      }
    }
  }, [video.isExternalLink, videoError]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle external link click
  const handleExternalLinkClick = () => {
    window.open(video.url, '_blank');
  };

  // Handle video error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video playback error:', e);
    setVideoError(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl">
        {/* Main modal content */}
        <div className="bg-gray-800 rounded-2xl md:rounded-[38px] p-4 md:p-8 relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors duration-200 z-10"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Video Player */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="w-full h-64 md:h-80 lg:w-[600px] lg:h-[400px] xl:w-[700px] xl:h-[450px] bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden">
                {video.isExternalLink ? (
                  // External link placeholder with click to open
                  <div 
                    onClick={handleExternalLinkClick}
                    className="w-full h-full bg-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  >
                    <ExternalLink className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" />
                    <p className="text-white text-lg md:text-xl font-semibold mb-2">External Video</p>
                    <p className="text-gray-300 text-sm md:text-base text-center px-4">
                      Click to open in new tab
                    </p>
                  </div>
                ) : videoError ? (
                  // Video error fallback
                  <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-400 mb-4" />
                    <p className="text-red-400 text-lg md:text-xl font-semibold mb-2">Video Unavailable</p>
                    <p className="text-gray-300 text-sm md:text-base text-center px-4">
                      This video cannot be played. It may be corrupted or in an unsupported format.
                    </p>
                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                      Try Direct Link
                    </button>
                  </div>
                ) : (
                  // Uploaded video file player
                  <video 
                    ref={videoRef}
                    src={video.url}
                    controls
                    className="w-full h-full object-contain bg-black"
                    preload="metadata"
                    onError={handleVideoError}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-auto lg:min-h-[400px] xl:min-h-[450px]">
              <div>
                <span className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">
                  {video.isExternalLink ? 'External Video' : 'Video'}
                </span>
                <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2 mb-3 md:mb-6 leading-tight">
                  {video.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Video info section */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Video Type</p>
                    <p className="text-white text-lg font-semibold">
                      {video.isExternalLink ? 'External Link' : videoError ? 'Unavailable' : 'Uploaded File'}
                    </p>
                  </div>
                  
                  {(video.isExternalLink || videoError) && (
                    <button
                      onClick={handleExternalLinkClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full transition-all duration-200 text-center text-sm md:text-base flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ExternalLink size={18} className="md:w-5 md:h-5" />
                      {videoError ? 'Try Direct Link' : 'Open External Video'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsModal;