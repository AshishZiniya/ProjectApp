"use client";

import React, { memo } from "react";
import Link from "next/link";
import { LegacyTask as Task, TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface TaskCardProps {
  task: Task;
  onDelete?: (task: Task) => void;
}

// Helper function to get priority info from numeric value
const getPriorityInfo = (priority: number) => {
  if (priority === 1) return TASK_PRIORITY_CONFIG.HIGH;
  if (priority === 2) return TASK_PRIORITY_CONFIG.MEDIUM;
  return TASK_PRIORITY_CONFIG.LOW;
};

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onDelete }) => {
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = TASK_STATUS_CONFIG[task.status];

  return (
    <Card className="flex flex-col justify-between transition-transform min-h-[280px]">
      <div>
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {task.title}
          </h3>
        </div>
        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {priorityInfo.label}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {statusInfo.label}
          </span>
        </div>
        {task.dueDate && task.status !== "DONE" && (
          <div className="flex items-center text-gray-700 text-sm mb-1">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {task.assignedTo && (
          <div className="flex items-center text-gray-700 text-sm mb-1">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">
              {task.assignedTo.name}
            </span>
          </div>
        )}
        {task.project && (
          <div className="flex items-center text-gray-700 text-sm">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
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
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task)}
            className="flex-1"
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;