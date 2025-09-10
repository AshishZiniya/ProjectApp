// types/index.ts

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: User; // Assuming owner is eagerly loaded
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  project?: Project;
  title: string;
  description?: string;
  priority: number;
  completed: boolean;
  dueDate?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  task: Task;
  author: User;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}
