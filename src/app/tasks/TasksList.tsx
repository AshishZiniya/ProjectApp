'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { LegacyTask as Task, PaginatedResponse } from '@/types';
import Modal from '@/components/ui/Modal';
import useToast from '@/hooks/useToast';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import { useApiQuery } from '@/hooks/useApiQuery';
import DataList from '@/components/common/DataList';
import TaskCard from '@/components/common/TaskCard';

const TasksList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  // Use optimized API query with caching
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse<Task>>('/tasks/all', {
    params: { page, limit },
    onError: () => {
      showError('Failed to fetch tasks.');
    },
  });

  const tasks = response?.data || [];
  const totalPages = response?.pages || 1;

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      refetch();
      showSuccess('Task deleted successfully!');
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch {
      showError('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <DataList
        title="Task Dashboard"
        subtitle="Manage and track all your tasks across projects"
        data={tasks}
        loading={loading}
        error={error}
        totalPages={totalPages}
        currentPage={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        createButtonHref="/tasks/create"
        createButtonText="Create New Task"
        renderItem={(task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDeleteClick} />
        )}
        emptyMessage="No tasks found. Create your first task to get started!"
        limitOptions={PAGE_LIMIT_OPTIONS.TASKS}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
};

export default TasksList;
