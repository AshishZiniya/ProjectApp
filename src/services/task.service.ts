/**
 * Task service - handles all task-related API operations
 *
 * This service provides a centralized interface for all task-related API calls,
 * including CRUD operations, filtering, and data transformation for backend compatibility.
 *
 * @example
 * ```typescript
 * import { TaskService } from '@/services/task.service';
 *
 * // Get all tasks with filters
 * const tasks = await TaskService.getTasks({
 *   page: 1,
 *   limit: 10,
 *   status: 'IN_PROGRESS'
 * });
 *
 * // Create a new task
 * const newTask = await TaskService.createTask({
 *   title: 'New Task',
 *   priority: 'HIGH',
 *   projectId: '123'
 * });
 *
 * // Update a task
 * const updatedTask = await TaskService.updateTask('task-id', {
 *   status: 'DONE'
 * });
 * ```
 */

import api from '@/lib/api-client';
import type {
  Task,
  TaskFormData,
  TaskUpdateData,
  TaskFilters,
  PaginatedResponse,
} from '@/types';
import { TASK_PRIORITY_MAP } from '@/types';

export class TaskService {
  /**
   * Get paginated tasks with optional filters
   */
  static async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    // Filter out undefined values for API compatibility
    const params = filters ? Object.fromEntries(
      Object.entries(filters).filter(([value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : undefined;

    return api.get<PaginatedResponse<Task>>('/tasks/all', params ? { params } : {});
  }

  /**
   * Get a single task by ID
   */
  static async getTask(id: string): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  }

  /**
   * Create a new task
   */
  static async createTask(data: TaskFormData): Promise<Task> {
    // Transform data for backend compatibility
    const { assignedToId, priority, ...taskData } = data;
    return api.post<Task>('/tasks', {
      ...taskData,
      assigneeId: assignedToId,
      priority: TASK_PRIORITY_MAP[priority],
    });
  }

  /**
   * Update an existing task
   */
  static async updateTask(id: string, data: TaskUpdateData): Promise<Task> {
    // Transform priority if present
    const { priority, ...taskData } = data;
    const updateData = priority
      ? {
          ...taskData,
          priority: TASK_PRIORITY_MAP[priority],
        }
      : taskData;

    return api.patch<Task>(`/tasks/${id}`, updateData);
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<void> {
    return api.delete<void>(`/tasks/${id}`);
  }

  /**
   * Get tasks for a specific project
   */
  static async getTasksByProject(projectId: string): Promise<Task[]> {
    return api.get<Task[]>('/tasks', {
      params: { projectId },
    });
  }

  /**
   * Get tasks assigned to a specific user
   */
  static async getTasksByAssignee(userId: string): Promise<Task[]> {
    return api.get<Task[]>('/tasks', {
      params: { assignedToId: userId },
    });
  }

  /**
   * Get task statistics
   */
  static async getTaskStats(): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  }> {
    return api.get('/tasks/stats');
  }
}
