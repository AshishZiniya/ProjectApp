'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProjectCardProps {
  project: Project;
  onDelete?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(
  ({ project, onDelete }) => {

    return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 group w-fit">
      <div className="flex flex-col items-start justify-between gap-5">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Project Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Owner and Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 truncate max-w-24">
              {project.owner.name}
            </span>
          </div>

          <Link href={`/projects/${project.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="opacity-75 group-hover:opacity-100 transition-opacity duration-200"
            >
              View Project
            </Button>
          </Link>

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project)}
              className="opacity-75 group-hover:opacity-100 transition-opacity duration-200 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
