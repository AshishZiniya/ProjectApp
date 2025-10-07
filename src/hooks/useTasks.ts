/**
 * Task-related hooks with enhanced error handling and caching
 *
 * This module provides React hooks for task operations with built-in error handling,
 * loading states, and user feedback through toast notifications.
 *
 * @example
 * ```typescript
 * import { useTasks } from '@/hooks/useTasks';
 *
 * function TaskList() {
 *   const { getTasks, createTask, loading, error } = useTasks();
 *
 *   const handleCreateTask = async (taskData) => {
 *     const newTask = await createTask(taskData);
 *     if (newTask) {
 *       // Task created successfully
 *       await loadTasks(); // Refresh the list
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {loading && <div>Loading...</div>}
 *       {error && <div>Error: {error.message}</div>}
 *       // Task list UI
 *     </div>
 *   );
 * }
 * ```
 */

import { useAsyncOperation } from './useAsyncOperation';
import { TaskService } from '@/services/task.service';
import type {
  Task,
  TaskFormData,
  TaskUpdateData,
  TaskFilters,
  PaginatedResponse,
} from '@/types';

export const useTasks = () => {
  const getTasks = useAsyncOperation<PaginatedResponse<Task>>({
    successMessage: 'Tasks loaded successfully',
    errorMessage: 'Failed to load tasks',
  });

  const createTask = useAsyncOperation<Task>({
    successMessage: 'Task created successfully',
    errorMessage: 'Failed to create task',
  });

  const updateTask = useAsyncOperation<Task>({
    successMessage: 'Task updated successfully',
    errorMessage: 'Failed to update task',
  });

  const deleteTask = useAsyncOperation<void>({
    successMessage: 'Task deleted successfully',
    errorMessage: 'Failed to delete task',
  });

  return {
    getTasks: (filters?: TaskFilters) =>
      getTasks.execute(() => TaskService.getTasks(filters)),
    createTask: (data: TaskFormData) =>
      createTask.execute(() => TaskService.createTask(data)),
    updateTask: (id: string, data: TaskUpdateData) =>
      updateTask.execute(() => TaskService.updateTask(id, data)),
    deleteTask: (id: string) =>
      deleteTask.execute(() => TaskService.deleteTask(id)),
    // Spread each operation's state with unique names to avoid conflicts
    getTasksState: getTasks,
    createTaskState: createTask,
    updateTaskState: updateTask,
    deleteTaskState: deleteTask,
  };
};

export const useTask = (id: string) => {
  const getTask = useAsyncOperation<Task>({
    successMessage: 'Task loaded successfully',
    errorMessage: 'Failed to load task',
  });

  return {
    getTask: () => getTask.execute(() => TaskService.getTask(id)),
    ...getTask,
  };
};

export const useTaskStats = () => {
  const getTaskStats = useAsyncOperation<{
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  }>({
    successMessage: 'Task statistics loaded',
    errorMessage: 'Failed to load task statistics',
  });

  return {
    getTaskStats: () => getTaskStats.execute(() => TaskService.getTaskStats()),
    ...getTaskStats,
  };
};
