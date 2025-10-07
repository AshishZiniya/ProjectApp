/**
 * User service - handles all user-related API operations
 */

import api from '@/lib/api-client';
import type {
  User,
  UserFormData,
  PaginatedResponse,
} from '@/types';

export class UserService {
  /**
   * Get paginated users with optional filters
   */
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>('/users', params ? { params } : {});
  }

  /**
   * Get a single user by ID
   */
  static async getUser(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  static async createUser(data: UserFormData): Promise<User> {
    return api.post<User>('/auth/register', data);
  }

  /**
   * Update an existing user
   */
  static async updateUser(
    id: string,
    data: Partial<UserFormData>,
  ): Promise<User> {
    return api.patch<User>(`/users/${id}`, data);
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me');
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    return api.get<User[]>('/users', {
      params: { role },
    });
  }
}
