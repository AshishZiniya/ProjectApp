/**
 * Project-related types and interfaces
 */

import { BaseEntity } from './common.types';
import { User } from './user.types';

// Project interface
export interface Project extends BaseEntity {
  name: string;
  description?: string;
  owner: User;
}

// Project creation/update interface
export interface ProjectFormData {
  name: string;
  description?: string;
}

// Project with tasks count (for list views)
export interface ProjectWithStats extends Project {
  tasksCount?: number;
  completedTasksCount?: number;
}
