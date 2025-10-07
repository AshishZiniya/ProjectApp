'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Task, PaginatedResponse } from '@/types';
import Modal from '@/components/ui/Modal';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import { useTasks } from '@/hooks/useTasks';
import DataList from '@/components/common/DataList';
import TaskCard from '@/components/common/TaskCard';

const TasksList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Use the new task hooks
  const { getTasks, deleteTask, deleteTaskState } = useTasks();

  // Get tasks operation state from the hook
  const { loading, error } = useTasks().getTasksState;
  const { loading: deleting } = deleteTaskState;

  // State for tasks data
  const [response, setResponse] = useState<PaginatedResponse<Task> | null>(null);

  // Custom execute function for loading tasks with current filters
  const loadTasks = useCallback(async () => {
    const result = await getTasks({ page, limit });
    if (result) {
      setResponse(result);
    }
  }, [getTasks, page, limit]);

  const tasks = response?.data || [];
  const totalPages = response?.pages || 1;

  // Load tasks when component mounts or page/limit changes
  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    const success = await deleteTask(taskToDelete.id as string);
    if (success) {
      await loadTasks();
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  return (
    <div className="px-6 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen">
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
    </div>
  );
};

export default TasksList;
