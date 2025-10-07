/**
 * Project service - handles all project-related API operations
 */

import api from '@/lib/api-client';
import type {
  Project,
  ProjectFormData,
  PaginatedResponse,
} from '@/types';

export class ProjectService {
  /**
   * Get paginated projects with optional filters
   */
  static async getProjects(params?: {
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Project>> {
    return api.get<PaginatedResponse<Project>>('/projects', params ? { params } : {});
  }

  /**
   * Get a single project by ID
   */
  static async getProject(id: string): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  }

  /**
   * Create a new project
   */
  static async createProject(data: ProjectFormData): Promise<Project> {
    return api.post<Project>('/projects', data);
  }

  /**
   * Update an existing project
   */
  static async updateProject(
    id: string,
    data: Partial<ProjectFormData>,
  ): Promise<Project> {
    return api.patch<Project>(`/projects/${id}`, data);
  }

  /**
   * Delete a project
   */
  static async deleteProject(id: string): Promise<void> {
    return api.delete<void>(`/projects/${id}`);
  }

  /**
   * Get projects owned by a specific user
   */
  static async getProjectsByOwner(ownerId: string): Promise<Project[]> {
    return api.get<Project[]>('/projects', {
      params: { ownerId },
    });
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
  }> {
    return api.get('/projects/stats');
  }
}
