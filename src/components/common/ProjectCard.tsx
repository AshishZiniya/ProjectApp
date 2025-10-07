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
  ({ project, onDelete }) => (
    <Card className="flex flex-col justify-between transition-all duration-300 min-h-[320px] group animate-fade-in-up">
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-4 transition-transform duration-300 shadow-lg">
            <svg
              className="w-7 h-7 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="28"
              height="28"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 transition-colors">
            {project.name}
          </h3>
        </div>
        {project.description && (
          <p className="text-gray-700 dark:text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-2">
            <svg
              className="w-3 h-3 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="12"
              height="12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="font-medium truncate text-gray-600 dark:text-gray-200">
            {project.owner.name}
          </span>
        </div>
      </div>
      <div className="flex space-x-3 mt-auto">
        <Link href={`/projects/${project.id}`} passHref className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Details
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(project)}
            className="flex-1"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        )}
      </div>
    </Card>
  )
);

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
