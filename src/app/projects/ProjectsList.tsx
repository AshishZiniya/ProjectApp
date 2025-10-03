"use client";

import React, { useState } from "react";
import { Project, PaginatedResponse } from "@/types";
import Modal from "@/components/ui/Modal";
import useToast from "@/hooks/useToast";
import { PAGE_LIMIT_OPTIONS } from "@/constants";
import { useApiQuery } from "@/hooks/useApiQuery";
import DataList from "@/components/common/DataList";
import ProjectCard from "@/components/common/ProjectCard";
import api from "@/lib/api";

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
    onError: () => {
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
      refetch();
      showSuccess("Project deleted successfully!");
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch {
      showError("Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };


  return (
    <>
      <DataList
        title="Project Dashboard"
        subtitle="Manage and track all your projects in one place"
        data={projects}
        loading={loading}
        error={error}
        totalPages={totalPages}
        currentPage={page}
        limit={limit}
        searchQuery={q}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setQ}
        createButtonHref="/projects/create"
        createButtonText="Create New Project"
        renderItem={(project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteClick}
          />
        )}
        skeletonVariant="project"
        emptyMessage="No projects found. Start by creating one!"
        limitOptions={PAGE_LIMIT_OPTIONS.PROJECTS}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
};

export default ProjectsList;
