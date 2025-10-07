/**
 * Comment-related hooks with enhanced error handling
 */

import { useAsyncOperation } from './useAsyncOperation';
import { CommentService } from '@/services/comment.service';
import type {
  Comment,
  CommentFormData,
  CommentUpdateData,
} from '@/types';

export const useComments = (taskId: string) => {
  const getComments = useAsyncOperation<Comment[]>({
    successMessage: 'Comments loaded successfully',
    errorMessage: 'Failed to load comments',
  });

  const createComment = useAsyncOperation<Comment>({
    successMessage: 'Comment added successfully',
    errorMessage: 'Failed to add comment',
  });

  const updateComment = useAsyncOperation<Comment>({
    successMessage: 'Comment updated successfully',
    errorMessage: 'Failed to update comment',
  });

  const deleteComment = useAsyncOperation<void>({
    successMessage: 'Comment deleted successfully',
    errorMessage: 'Failed to delete comment',
  });

  return {
    getComments: () => getComments.execute(() => CommentService.getComments(taskId)),
    createComment: (data: CommentFormData) =>
      createComment.execute(() => CommentService.createComment(taskId, data)),
    updateComment: (id: string, data: CommentUpdateData) =>
      updateComment.execute(() => CommentService.updateComment(id, data)),
    deleteComment: (id: string) =>
      deleteComment.execute(() => CommentService.deleteComment(id)),
    ...getComments,
    ...createComment,
    ...updateComment,
    ...deleteComment,
  };
};

export const useComment = (id: string) => {
  const getComment = useAsyncOperation<Comment>({
    successMessage: 'Comment loaded successfully',
    errorMessage: 'Failed to load comment',
  });

  return {
    getComment: () => getComment.execute(() => CommentService.getComment(id)),
    ...getComment,
  };
};
