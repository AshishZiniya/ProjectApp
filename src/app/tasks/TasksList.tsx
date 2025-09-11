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
import { DEFAULT_PAGE_LIMIT, TASKS_PAGE_LIMIT_OPTIONS } from "@/constants";
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        All Tasks
      </h1>

      <div className="flex justify-end items-center mb-6">
        <Link href="/tasks/create" passHref>
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      {!loading && tasks.length === 0 && (
        <Alert type="info" message="No tasks found." />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              <p className="text-gray-700 text-sm">
                Priority: <span className="font-medium">{task.priority}</span>
              </p>
              <p className="text-gray-700 text-sm">
                Status:{" "}
                <span
                  className={`font-medium ${
                    task.completed ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </p>
              {task.dueDate && !task.completed && (
                <p className="text-gray-700 text-sm">
                  Due Date:{" "}
                  <span className="font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </p>
              )}
              {task.assignedTo && (
                <p className="text-gray-700 text-sm">
                  Assigned To:{" "}
                  <span className="font-medium">{task.assignedTo.name}</span>
                </p>
              )}
              {task.project && (
                <p className="text-gray-700 text-sm">
                  Project:{" "}
                  <span className="font-medium">{task.project.name}</span>
                </p>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Link href={`/tasks/${task.id}`} passHref>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(task.id)}
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
    </div>
  );
};

export default TasksList;
