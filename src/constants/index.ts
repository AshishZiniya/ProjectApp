// constants/index.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const TOAST_DURATION = 2000;

export const TOAST_SUCCESS_COLOR = "#02993c";
export const TOAST_ERROR_COLOR = "#990202";
export const TOAST_DEFAULT_COLOR = "yellow";

export const DEFAULT_PAGE_LIMIT = 10;
export const USERS_PAGE_LIMIT_OPTIONS = [5, 10, 20];
export const PROJECTS_PAGE_LIMIT_OPTIONS = [5, 10, 20];
export const TASKS_PAGE_LIMIT_OPTIONS = [5, 10, 20];

export const TASK_PRIORITY_HIGH = 1;
export const TASK_PRIORITY_MEDIUM = 2;
export const TASK_PRIORITY_LOW = 3;

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}
