import React from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, category, description, image }) => {
  return (
    <div className="bg-gray-800 rounded-[38px] p-7 mb-6 group hover:bg-gray-750 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-6 group-hover:translate-y-[-2px] transition-transform duration-300">
          <span className="text-gray-500 text-sm font-normal leading-relaxed">
            {category}
          </span>
          <h3 className="text-white text-2xl font-semibold leading-tight tracking-tight mt-2 mb-4">
            {title}
          </h3>
          <p className="text-white text-base leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
        <div className="w-48 h-48 bg-gray-700 rounded-3xl overflow-hidden flex-shrink-0">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;