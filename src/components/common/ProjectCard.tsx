"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Project } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ProjectCardProps {
  project: Project;
  onDelete?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = memo(({ project, onDelete }) => (
  <Card className="flex flex-col justify-between transition-all duration-200 min-h-[280px]">
    <div>
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
          {project.name}
        </h3>
      </div>
      {project.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="flex items-center text-gray-700 text-sm mb-4">
        <svg
          className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="font-medium truncate">{project.owner.name}</span>
      </div>
    </div>
    <div className="flex space-x-2 mt-auto">
      <Link href={`/projects/${project.id}`} passHref>
        <Button variant="secondary" size="sm" className="flex-1">
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
          Delete
        </Button>
      )}
    </div>
  </Card>
));

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;