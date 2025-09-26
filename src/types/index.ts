// types/index.ts

// User roles with hierarchy
export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

// Task priority levels
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

// Task status values
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// Priority mapping for backward compatibility
export const TASK_PRIORITY_MAP = {
  LOW: 3,
  MEDIUM: 2,
  HIGH: 1,
} as const;

// Base entity interface for common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User interface with enhanced typing
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  resetToken?: string;
  resetTokenExpiry?: string;
}

// Project interface
export interface Project extends BaseEntity {
  name: string;
  description?: string;
  owner: User;
}

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

// Legacy task interface for backward compatibility
export interface LegacyTask extends BaseEntity {
  project: Project;
  title: string;
  description?: string;
  priority: number; // Legacy numeric priority
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: User;
}

// Comment interface
export interface Comment extends BaseEntity {
  task: Task;
  author: User;
  body: string;
}

// Pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form validation error interface
export interface ValidationErrors {
  [key: string]: string;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Auth user type alias for authentication context
export type AuthUser = User;

// Task creation/update interface
export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedToId?: string;
}

// Project creation/update interface
export interface ProjectFormData {
  name: string;
  description?: string;
}

// User creation interface
export interface UserFormData {
  email: string;
  name: string;
  role: UserRole;
}
