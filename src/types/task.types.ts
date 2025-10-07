/**
 * Task-related types and interfaces
 */

import { BaseEntity } from './common.types';
import { User } from './user.types';
import { Project } from './project.types';

// Task priority levels
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Task status values
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Priority mapping for backend compatibility
export const TASK_PRIORITY_MAP = {
  LOW: 3,
  MEDIUM: 2,
  HIGH: 1,
} as const;

// Reverse priority mapping (from number to string)
export const TASK_PRIORITY_REVERSE_MAP: Record<number, TaskPriority> = {
  1: 'HIGH',
  2: 'MEDIUM',
  3: 'LOW',
} as const;

// Priority display configuration
export const TASK_PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'bg-green-900 text-green-100',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'bg-yellow-900 text-yellow-100',
  },
  HIGH: {
    label: 'High',
    color: 'bg-red-900 text-red-100',
  },
} as const;

// Status display configuration
export const TASK_STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    color: 'bg-gray-800 text-gray-100',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-blue-900 text-blue-100',
  },
  DONE: {
    label: 'Completed',
    color: 'bg-green-900 text-green-100',
  },
} as const;

// Task interface with improved typing
export interface Task extends BaseEntity {
  project: Project;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: User;
}

// Task creation/update interface
export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedToId?: string;
  projectId?: string;
}

// Task update interface (all fields optional except what's required)
export type TaskUpdateData = Partial<TaskFormData>;

// Task filters for querying
export interface TaskFilters {
  page?: number;
  limit?: number;
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  search?: string;
}
