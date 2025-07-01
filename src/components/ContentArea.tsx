import React from 'react';
import ProjectCard from './ProjectCard';
import VideoCard from './VideoCard';
import WorkGallery from './WorkGallery';

interface ContentAreaProps {
  currentPage: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ currentPage }) => {
  const projectsData = [
    {
      title: "Creative Digital Experience",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Modern Web Application",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Brand Identity Design",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Mobile App Interface",
      category: "Obra",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.",
      image: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const videosData = [
    {
      title: "video 1",
      date: "12/05/2025",
      thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 2",
      date: "12/05/2025",
      thumbnail: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 3",
      date: "12/05/2025",
      thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 4",
      date: "12/05/2025",
      thumbnail: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 5",
      date: "15/05/2025",
      thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 6",
      date: "18/05/2025",
      thumbnail: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 7",
      date: "20/05/2025",
      thumbnail: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 8",
      date: "22/05/2025",
      thumbnail: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 9",
      date: "25/05/2025",
      thumbnail: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "video 10",
      date: "28/05/2025",
      thumbnail: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];

  const renderHomeContent = () => (
    <div className="absolute left-20 top-[473px] max-w-[330px] pr-8 z-10">
      <p className="text-white text-base leading-relaxed font-normal">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
      </p>
    </div>
  );

  const renderVideosContent = () => (
    <div className="absolute right-20 top-32 w-[780px]">
      <div className="grid grid-cols-2 gap-6 max-h-[520px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-4">
        {videosData.map((video, index) => (
          <VideoCard
            key={index}
            title={video.title}
            date={video.date}
            thumbnail={video.thumbnail}
            youtubeUrl={video.youtubeUrl}
          />
        ))}
      </div>
    </div>
  );

  const renderVideosPageContent = () => (
    <div className="absolute left-20 top-[473px] max-w-[330px] pr-8 z-10">
      <p className="text-white text-base leading-relaxed font-normal">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen unchanged.
      </p>
    </div>
  );

  const renderProjectsContent = () => (
    <div className="absolute right-20 top-36 w-[600px]">
      <div className="space-y-6 max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            category={project.category}
            description={project.description}
            image={project.image}
          />
        ))}
      </div>
    </div>
  );

  const renderWorkPageContent = () => (
    <div className="absolute left-20 top-[473px] max-w-[330px] pr-8 z-10">
      <p className="text-white text-base leading-relaxed font-normal">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since th unchanged.
      </p>
    </div>
  );

  return (
    <div className="relative">
      {currentPage === 'home' && renderHomeContent()}
      {currentPage === 'videos' && renderVideosPageContent()}
      {currentPage === 'videos' && renderVideosContent()}
      {currentPage === 'work' && renderWorkPageContent()}
      {currentPage === 'work' && <WorkGallery />}
      {(currentPage === 'home') && renderProjectsContent()}
    </div>
  );
};

export default ContentArea;