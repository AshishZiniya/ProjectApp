// constants/index.ts

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "projectapp-api-production.up.railway.app";

// Toast Configuration
export const TOAST_DURATION = 2000;
export const TOAST_COLORS = {
  SUCCESS: "#02993c",
  ERROR: "#990202",
  DEFAULT: "yellow",
} as const;

// Pagination Configuration
export const DEFAULT_PAGE_LIMIT = 10;
export const PAGE_LIMIT_OPTIONS = {
  USERS: [5, 10, 20] as number[],
  PROJECTS: [5, 10, 20] as number[],
  TASKS: [5, 10, 20] as number[],
};

// Task Priority Mapping (imported from types for consistency)
export { TASK_PRIORITY_MAP } from "@/types";

// Task Priority Constants (reverse mapping for easier usage)
export const TASK_PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
} as const;

// Task Status Options
export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

// User Roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// UI Constants
export const ANIMATION_DURATION = 300;
export const LOADING_TIMEOUT = 10000;
export const REFRESH_TIMEOUT = 30000;
