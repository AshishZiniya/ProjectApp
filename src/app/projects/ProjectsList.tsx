'use client';

import React, { useState, memo } from 'react';
import { Project, PaginatedResponse } from '@/types';
import Modal from '@/components/ui/Modal';
import useToast from '@/hooks/useToast';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import { useApiQuery } from '@/hooks/useApiQuery';
import DataList from '@/components/common/DataList';
import ProjectCard from '@/components/common/ProjectCard';
import api from '@/lib/api';

const ProjectsList: React.FC = () => {
  const [q, setQ] = useState('');
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
  } = useApiQuery<PaginatedResponse<Project>>('/projects', {
    params: { q, page, limit },
    onError: () => {
      showError('Failed to fetch projects.');
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
      showSuccess('Project deleted successfully!');
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch {
      showError('Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const ProjectsPageSkeleton = memo(() => (
    <div className="min-h-screen animated-bg">
      <div className="p-6 min-h-[calc(100vh-200px)]">
        <div className="text-center mb-16 min-h-[120px]">
          <div className="h-16 bg-white/10 rounded-2xl w-96 mx-auto mb-6 animate-pulse glass-card"></div>
          <div className="h-6 bg-white/10 rounded-xl w-80 mx-auto animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center mb-8 min-h-[40px]">
          <div className="h-12 bg-white/10 rounded-xl w-1/3 animate-pulse glass-card"></div>
          <div className="h-12 bg-white/10 rounded-xl w-40 animate-pulse glass-card"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 animate-pulse min-h-[320px]"
            >
              <div className="h-4 bg-white/10 rounded mb-4"></div>
              <div className="h-3 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-white/10 rounded-xl flex-1"></div>
                <div className="h-10 bg-white/10 rounded-xl flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  ProjectsPageSkeleton.displayName = 'ProjectsPageSkeleton';

  return (
    <>
      <div className="min-h-screen animated-bg">
        <div className="p-6 min-h-[calc(100vh-200px)]">
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
            emptyMessage="No projects found. Start by creating one!"
            limitOptions={PAGE_LIMIT_OPTIONS.PROJECTS}
            className="glass-card rounded-3xl p-8"
          />
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        className="glass-card"
      />
    </>
  );
};

export default ProjectsList;
