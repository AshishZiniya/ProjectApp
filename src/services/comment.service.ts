/**
 * Comment service - handles all comment-related API operations
 */

import api from '@/lib/api-client';
import type {
  Comment,
  CommentFormData,
  CommentUpdateData,
} from '@/types';

export class CommentService {
  /**
   * Get comments for a specific task
   */
  static async getComments(taskId: string): Promise<Comment[]> {
    return api.get<Comment[]>(`/comments/task/${taskId}`);
  }

  /**
   * Create a new comment
   */
  static async createComment(
    taskId: string,
    data: CommentFormData,
  ): Promise<Comment> {
    return api.post<Comment>(`/comments/${taskId}`, data);
  }

  /**
   * Update an existing comment
   */
  static async updateComment(
    id: string,
    data: CommentUpdateData,
  ): Promise<Comment> {
    return api.patch<Comment>(`/comments/${id}`, data);
  }

  /**
   * Delete a comment
   */
  static async deleteComment(id: string): Promise<void> {
    return api.delete<void>(`/comments/${id}`);
  }

  /**
   * Get a single comment by ID
   */
  static async getComment(id: string): Promise<Comment> {
    return api.get<Comment>(`/comments/${id}`);
  }
}
