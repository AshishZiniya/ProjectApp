/**
 * User-related hooks with enhanced error handling
 */

import { useAsyncOperation } from './useAsyncOperation';
import { UserService } from '@/services/user.service';
import type {
  User,
  UserFormData,
  PaginatedResponse,
} from '@/types';

export const useUsers = () => {
  const getUsers = useAsyncOperation<PaginatedResponse<User>>({
    successMessage: 'Users loaded successfully',
    errorMessage: 'Failed to load users',
  });

  const createUser = useAsyncOperation<User>({
    successMessage: 'User created successfully',
    errorMessage: 'Failed to create user',
  });

  const updateUser = useAsyncOperation<User>({
    successMessage: 'User updated successfully',
    errorMessage: 'Failed to update user',
  });

  const deleteUser = useAsyncOperation<void>({
    successMessage: 'User deleted successfully',
    errorMessage: 'Failed to delete user',
  });

  return {
    getUsers: (params?: { page?: number; limit?: number; role?: string }) =>
      getUsers.execute(() => UserService.getUsers(params)),
    createUser: (data: UserFormData) =>
      createUser.execute(() => UserService.createUser(data)),
    updateUser: (id: string, data: Partial<UserFormData>) =>
      updateUser.execute(() => UserService.updateUser(id, data)),
    deleteUser: (id: string) =>
      deleteUser.execute(() => UserService.deleteUser(id)),
    ...getUsers,
    ...createUser,
    ...updateUser,
    ...deleteUser,
  };
};

export const useUser = (id: string) => {
  const getUser = useAsyncOperation<User>({
    successMessage: 'User loaded successfully',
    errorMessage: 'Failed to load user',
  });

  return {
    getUser: () => getUser.execute(() => UserService.getUser(id)),
    ...getUser,
  };
};

export const useCurrentUser = () => {
  const getCurrentUser = useAsyncOperation<{ user: User }>({
    successMessage: 'Profile loaded successfully',
    errorMessage: 'Failed to load profile',
  });

  return {
    getCurrentUser: () => getCurrentUser.execute(() => UserService.getCurrentUser()),
    ...getCurrentUser,
  };
};
