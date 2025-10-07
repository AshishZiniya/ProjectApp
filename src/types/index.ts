/**
 * Central export point for all application types
 * Types are organized into domain-specific files for better maintainability
 */

// Common types
export type {
  BaseEntity,
  PaginatedResponse,
  ApiResponse,
  ValidationErrors,
  LoadingState,
  StrictApiResponseSuccess,
  StrictApiResponseError,
  StrictApiResponse,
  Optional,
  RequiredFields,
  Nullable,
  Maybe,
  ValueOf,
  ComponentWithChildren,
  ComponentWithClassName,
} from './common.types';

// User types
export type {
  UserRole,
  User,
  AuthUser,
  UserFormData,
  UserAuthResponse,
  UserProfileResponse,
} from './user.types';

// Project types
export type {
  Project,
  ProjectFormData,
  ProjectWithStats,
} from './project.types';

// Task types
export type {
  TaskPriority,
  TaskStatus,
  Task,
  TaskFormData,
  TaskUpdateData,
  TaskFilters,
} from './task.types';

export {
  TASK_PRIORITY_MAP,
  TASK_PRIORITY_REVERSE_MAP,
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
} from './task.types';

// Comment types
export type {
  Comment,
  CommentFormData,
  CommentUpdateData,
} from './comment.types';
