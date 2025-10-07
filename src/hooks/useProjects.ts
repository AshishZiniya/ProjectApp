/**
 * Project-related hooks with enhanced error handling
 */

import { useAsyncOperation } from './useAsyncOperation';
import { ProjectService } from '@/services/project.service';
import type {
  Project,
  ProjectFormData,
  PaginatedResponse,
} from '@/types';

export const useProjects = () => {
  const getProjects = useAsyncOperation<PaginatedResponse<Project>>({
    successMessage: 'Projects loaded successfully',
    errorMessage: 'Failed to load projects',
  });

  const createProject = useAsyncOperation<Project>({
    successMessage: 'Project created successfully',
    errorMessage: 'Failed to create project',
  });

  const updateProject = useAsyncOperation<Project>({
    successMessage: 'Project updated successfully',
    errorMessage: 'Failed to update project',
  });

  const deleteProject = useAsyncOperation<void>({
    successMessage: 'Project deleted successfully',
    errorMessage: 'Failed to delete project',
  });

  return {
    getProjects: (params?: { q?: string; page?: number; limit?: number }) =>
      getProjects.execute(() => ProjectService.getProjects(params)),
    createProject: (data: ProjectFormData) =>
      createProject.execute(() => ProjectService.createProject(data)),
    updateProject: (id: string, data: Partial<ProjectFormData>) =>
      updateProject.execute(() => ProjectService.updateProject(id, data)),
    deleteProject: (id: string) =>
      deleteProject.execute(() => ProjectService.deleteProject(id)),
    ...getProjects,
    ...createProject,
    ...updateProject,
    ...deleteProject,
  };
};

export const useProject = (id: string) => {
  const getProject = useAsyncOperation<Project>({
    successMessage: 'Project loaded successfully',
    errorMessage: 'Failed to load project',
  });

  return {
    getProject: () => getProject.execute(() => ProjectService.getProject(id)),
    ...getProject,
  };
};

export const useProjectStats = () => {
  const getProjectStats = useAsyncOperation<{
    total: number;
    active: number;
    completed: number;
  }>({
    successMessage: 'Project statistics loaded',
    errorMessage: 'Failed to load project statistics',
  });

  return {
    getProjectStats: () => getProjectStats.execute(() => ProjectService.getProjectStats()),
    ...getProjectStats,
  };
};
