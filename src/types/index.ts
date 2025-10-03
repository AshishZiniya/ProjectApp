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

// Priority display configuration
export const TASK_PRIORITY_CONFIG = {
  LOW: {
    label: "Low",
    color: "bg-green-100 text-green-800",
  },
  MEDIUM: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800",
  },
  HIGH: {
    label: "High",
    color: "bg-red-100 text-red-800",
  },
} as const;

// Status display configuration
export const TASK_STATUS_CONFIG = {
  TODO: {
    label: "To Do",
    color: "bg-gray-100 text-gray-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
  },
  DONE: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
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
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

// Component prop types
export type ComponentWithChildren<P = Record<string, unknown>> = P & {
  children?: React.ReactNode;
};

export type ComponentWithClassName<P = Record<string, unknown>> = P & {
  className?: string;
};

// Strict API response types (more type-safe than the existing ApiResponse)
export type StrictApiResponseSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type StrictApiResponseError = {
  success: false;
  error: string;
  code?: string;
};

export type StrictApiResponse<T> = StrictApiResponseSuccess<T> | StrictApiResponseError;

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
