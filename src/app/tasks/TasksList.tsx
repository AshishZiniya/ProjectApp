/* eslint-disable react-hooks/exhaustive-deps */
// app/tasks/TasksList.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Task, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Link from "next/link";
import useToast from "@/hooks/useToast";
import { DEFAULT_PAGE_LIMIT, TASKS_PAGE_LIMIT_OPTIONS, TASK_PRIORITY_HIGH, TASK_PRIORITY_MEDIUM } from "@/constants";
import PaginationControls from "@/components/common/PaginationControls";

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);

  const { showSuccess, showError } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Task>>("/tasks/all", {
        params: { page, limit },
      });
      setTasks(response.data);
      setTotalPages(response.pages);
    } catch {
      showError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
        showSuccess("Task deleted successfully!");
      } catch {
        showError("Failed to delete Task...!");
      }
    }
  };

  const TaskCardSkeleton = () => (
    <Card className="flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex gap-2 mb-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 w-20 bg-gray-200 rounded flex-1"></div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All Tasks
        </h1>
        <p className="text-xl text-gray-600">View and manage all tasks across your projects</p>
      </div>

      <div className="flex justify-end items-center mb-6">
        <Link href="/tasks/create" passHref>
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {tasks.length === 0 && (
            <Alert type="info" message="No tasks found." />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === TASK_PRIORITY_HIGH ? 'bg-red-100 text-red-800' :
                      task.priority === TASK_PRIORITY_MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {task.priority === TASK_PRIORITY_HIGH ? 'High' : task.priority === TASK_PRIORITY_MEDIUM ? 'Medium' : 'Low'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {task.status === 'DONE' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  {task.dueDate && task.status !== 'DONE' && (
                    <div className="flex items-center text-gray-700 text-sm mb-1">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {task.assignedTo && (
                    <div className="flex items-center text-gray-700 text-sm mb-1">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">
                        {task.assignedTo.name}
                      </span>
                    </div>
                  )}
                  {task.project && (
                    <div className="flex items-center text-gray-700 text-sm">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{task.project.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link href={`/tasks/${task.id}`} passHref>
                    <Button variant="secondary" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              limitOptions={TASKS_PAGE_LIMIT_OPTIONS}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TasksList;
