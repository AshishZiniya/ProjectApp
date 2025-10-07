/**
 * Comment-related types and interfaces
 */

import { BaseEntity } from './common.types';
import { User } from './user.types';
import { Task } from './task.types';

// Comment interface
export interface Comment extends BaseEntity {
  task: Task;
  author: User;
  body: string;
}

// Comment creation interface
export interface CommentFormData {
  body: string;
  taskId: string;
}

// Comment update interface
export interface CommentUpdateData {
  body: string;
}
