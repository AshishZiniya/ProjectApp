"use client";

import React, { useState, memo } from "react";
import api from "@/lib/api";
import { Project, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import useToast from "@/hooks/useToast";
import { PAGE_LIMIT_OPTIONS } from "@/constants";
import PaginationControls from "@/components/common/PaginationControls";
import { useApiQuery } from "@/hooks/useApiQuery";
import SkeletonCard from "@/components/ui/SkeletonCard";

const ProjectsList: React.FC = () => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  // Use optimized API query with caching
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse<Project>>("/projects", {
    params: { q, page, limit },
    onError: (err) => {
      console.error("Error fetching projects:", err);
      showError("Failed to fetch projects.");
    },
  });

  const projects = response?.data || [];
  const totalPages = response?.pages || 1;

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete.id}`);
      // Force a re-fetch to ensure data consistency
      refetch();
      showSuccess("Project deleted successfully!");
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      showError("Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const ProjectCardSkeleton = memo(() => <SkeletonCard variant="project" />);
  ProjectCardSkeleton.displayName = "ProjectCardSkeleton";

  // Memoized project card component for better performance
  const ProjectCard = memo(({ project }: { project: Project }) => (
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
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteClick(project)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </Card>
  ));
  ProjectCard.displayName = "ProjectCard";

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Project Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage and track all your projects in one place
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search projects by name..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-1/3"
        />
        <Link href="/projects/create" passHref>
          <Button variant="primary">Create New Project</Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error.message} className="mb-4" />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {projects.length === 0 && !error && (
            <Alert
              type="info"
              message="No projects found. Start by creating one!"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col justify-between transition-all duration-200 min-h-[280px]"
              >
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
                    <span className="font-medium truncate">
                      {project.owner.name}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-auto">
                  <Link href={`/projects/${project.id}`} passHref>
                    <Button variant="secondary" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(project)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              limitOptions={PAGE_LIMIT_OPTIONS.PROJECTS}
            />
          )}
        </>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
};

export default ProjectsList;
