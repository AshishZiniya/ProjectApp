// app/users/UsersList.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { User, PaginatedResponse } from '@/types';
import Modal from '@/components/ui/Modal';
import useToast from '@/hooks/useToast';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import DataList from '@/components/common/DataList';
import UserCard from '@/components/common/UserCard';
import { useSession } from 'next-auth/react';

const UsersList: React.FC = () => {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { showSuccess, showError } = useToast();

    const { data: session } = useSession();
    const currentUser = session?.user;
    const isSuperAdmin = currentUser?.role === 'SUPERADMIN';

  // Fetch users data
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse<User>>('/users', {
    params: { q, page, limit },
    onError: () => {
      showError('Failed to fetch users.');
    },
  });

  const users = response?.data || [];
  const totalPages = response?.pages || 1;

  // Delete user mutation
  const { mutate: deleteUser, loading: deleting } = useApiMutation<
    void,
    string
  >();

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(`/users/${userToDelete.id}`, userToDelete.id, 'DELETE');
      showSuccess('User deleted successfully!');
      setShowDeleteModal(false);
      setUserToDelete(null);
      refetch(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      showError('Failed to delete user.');
    }
  }, [userToDelete, deleteUser, showSuccess, showError, refetch]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }, []);

  return (
    <>
      <DataList
        title="User Management"
        subtitle="Manage user accounts and permissions across your organization"
        data={users}
        loading={loading}
        error={error}
        totalPages={totalPages}
        currentPage={page}
        limit={limit}
        searchQuery={q}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setQ}
        renderItem={(user) => (
          <UserCard key={user.id} user={user} {...(isSuperAdmin ? { onDelete: handleDeleteClick } : {})} />
        )}
        emptyMessage="No users found. Start by inviting team members!"
        limitOptions={PAGE_LIMIT_OPTIONS.USERS}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete User"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
};

export default UsersList;
