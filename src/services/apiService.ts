import api from "@/lib/api";
import type {
  Project,
  Task,
  User,
  Comment,
  PaginatedResponse,
  TaskFormData,
  ProjectFormData,
  UserFormData,
} from "@/types";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";

// Generic API service class
class ApiService {
  // Project operations
  static async getProjects(params?: {
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Project>> {
    return api.get<PaginatedResponse<Project>>("/projects", params ? { params } : {});
  }

  static async getProject(id: string): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  }

  static async createProject(data: ProjectFormData): Promise<Project> {
    return api.post<Project>("/projects", data);
  }

  static async updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    return api.put<Project>(`/projects/${id}`, data);
  }

  static async deleteProject(id: string): Promise<void> {
    return api.delete<void>(`/projects/${id}`);
  }

  // Task operations
  static async getTasks(params?: {
    page?: number;
    limit?: number;
    projectId?: string;
    status?: string;
    priority?: number;
  }): Promise<PaginatedResponse<Task>> {
    return api.get<PaginatedResponse<Task>>("/tasks/all", params ? { params } : {});
  }

  static async getTask(id: string): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  }

  static async createTask(data: TaskFormData): Promise<Task> {
    return api.post<Task>("/tasks", data);
  }

  static async updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
    return api.put<Task>(`/tasks/${id}`, data);
  }

  static async deleteTask(id: string): Promise<void> {
    return api.delete<void>(`/tasks/${id}`);
  }

  // User operations
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>("/users", params ? { params } : {});
  }

  static async getUser(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }

  static async createUser(data: UserFormData): Promise<User> {
    return api.post<User>("/users", data);
  }

  static async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  }

  static async deleteUser(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  }

  // Comment operations
  static async getComments(taskId: string): Promise<Comment[]> {
    return api.get<Comment[]>(`/comments/task/${taskId}`);
  }

  static async createComment(taskId: string, body: string): Promise<Comment> {
    return api.post<Comment>("/comments", { taskId, body });
  }

  static async deleteComment(id: string): Promise<void> {
    return api.delete<void>(`/comments/${id}`);
  }
}

// React hooks for API operations with built-in error handling
export const useProjects = () => {
  const getProjects = useAsyncOperation<PaginatedResponse<Project>>({
    successMessage: "Projects loaded successfully",
    errorMessage: "Failed to load projects",
  });

  const createProject = useAsyncOperation<Project>({
    successMessage: "Project created successfully",
    errorMessage: "Failed to create project",
  });

  const updateProject = useAsyncOperation<Project>({
    successMessage: "Project updated successfully",
    errorMessage: "Failed to update project",
  });

  const deleteProject = useAsyncOperation<void>({
    successMessage: "Project deleted successfully",
    errorMessage: "Failed to delete project",
  });

  return {
    getProjects: (params?: Parameters<typeof ApiService.getProjects>[0]) =>
      getProjects.execute(() => ApiService.getProjects(params)),
    createProject: (data: ProjectFormData) =>
      createProject.execute(() => ApiService.createProject(data)),
    updateProject: (id: string, data: Partial<ProjectFormData>) =>
      updateProject.execute(() => ApiService.updateProject(id, data)),
    deleteProject: (id: string) =>
      deleteProject.execute(() => ApiService.deleteProject(id)),
    ...getProjects,
    ...createProject,
    ...updateProject,
    ...deleteProject,
  };
};

export const useTasks = () => {
  const getTasks = useAsyncOperation<PaginatedResponse<Task>>({
    successMessage: "Tasks loaded successfully",
    errorMessage: "Failed to load tasks",
  });

  const createTask = useAsyncOperation<Task>({
    successMessage: "Task created successfully",
    errorMessage: "Failed to create task",
  });

  const updateTask = useAsyncOperation<Task>({
    successMessage: "Task updated successfully",
    errorMessage: "Failed to update task",
  });

  const deleteTask = useAsyncOperation<void>({
    successMessage: "Task deleted successfully",
    errorMessage: "Failed to delete task",
  });

  return {
    getTasks: (params?: Parameters<typeof ApiService.getTasks>[0]) =>
      getTasks.execute(() => ApiService.getTasks(params)),
    createTask: (data: TaskFormData) =>
      createTask.execute(() => ApiService.createTask(data)),
    updateTask: (id: string, data: Partial<TaskFormData>) =>
      updateTask.execute(() => ApiService.updateTask(id, data)),
    deleteTask: (id: string) =>
      deleteTask.execute(() => ApiService.deleteTask(id)),
    ...getTasks,
    ...createTask,
    ...updateTask,
    ...deleteTask,
  };
};

export const useUsers = () => {
  const getUsers = useAsyncOperation<PaginatedResponse<User>>({
    successMessage: "Users loaded successfully",
    errorMessage: "Failed to load users",
  });

  const createUser = useAsyncOperation<User>({
    successMessage: "User created successfully",
    errorMessage: "Failed to create user",
  });

  const deleteUser = useAsyncOperation<void>({
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
  });

  return {
    getUsers: (params?: Parameters<typeof ApiService.getUsers>[0]) =>
      getUsers.execute(() => ApiService.getUsers(params)),
    createUser: (data: UserFormData) =>
      createUser.execute(() => ApiService.createUser(data)),
    deleteUser: (id: string) =>
      deleteUser.execute(() => ApiService.deleteUser(id)),
    ...getUsers,
    ...createUser,
    ...deleteUser,
  };
};

export default ApiService;