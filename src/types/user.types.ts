/**
 * User-related types and interfaces
 */

import { BaseEntity } from './common.types';

// User roles with hierarchy
export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

// User interface with enhanced typing
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  resetToken?: string;
  resetTokenExpiry?: string;
}

// Auth user type alias for authentication context
export type AuthUser = User;

// User creation/update interface
export interface UserFormData {
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

// User response types
export interface UserAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfileResponse {
  user: User;
}
