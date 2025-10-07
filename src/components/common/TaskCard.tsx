'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import {
  LegacyTask as Task,
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
} from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onDelete?: (task: Task) => void;
}

// Helper function to get priority info from numeric value
const getPriorityInfo = (priority: number) => {
  // Ensure priority is a valid number and within expected range
  if (typeof priority !== 'number' || priority < 1 || priority > 3) {
    console.warn(`Invalid priority value: ${priority}. Defaulting to LOW.`);
    return TASK_PRIORITY_CONFIG.LOW;
  }

  if (priority === 1) return TASK_PRIORITY_CONFIG.HIGH;
  if (priority === 2) return TASK_PRIORITY_CONFIG.MEDIUM;
  return TASK_PRIORITY_CONFIG.LOW;
};

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onDelete }) => {
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = TASK_STATUS_CONFIG[task.status as keyof typeof TASK_STATUS_CONFIG] || {
    label: 'Unknown',
    color: 'bg-gray-800 text-gray-100'
  };

  // Safety check for undefined config
  if (!priorityInfo) {
    console.error('TaskCard: Missing priority configuration', {
      priority: task.priority,
      status: task.status,
      priorityInfo,
      availablePriorities: Object.keys(TASK_PRIORITY_CONFIG)
    });
    return (
      <Card className="flex flex-col justify-between transition-all duration-300 min-h-[320px] group animate-fade-in-up">
        <div className="flex-1 p-4">
          <p className="text-red-400 text-sm">Error: Invalid task data</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mt-2">
            {task.title || 'Untitled Task'}
          </h3>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between transition-all duration-300 min-h-[320px] group animate-fade-in-up">
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <div
            className={`w-12 h-12 ${statusInfo.color} rounded-xl flex items-center justify-center mr-4 transition-transform duration-300 shadow-lg`}
          >
            <svg
              className="w-7 h-7 text-gray-900 dark:text-white"
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 transition-colors">
            {task.title}
          </h3>
        </div>
        {task.description && (
          <p className="text-gray-700 dark:text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-400 text-sm">
            <div
              className={`w-6 h-6 ${priorityInfo.color} rounded-lg flex items-center justify-center mr-2`}
            >
              <span className="text-xs font-bold">
                {priorityInfo.label[0]}
              </span>
            </div>
            <span className="font-medium text-gray-600 dark:text-gray-200">
              {priorityInfo.label}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </div>
        </div>
      </div>
      <div className="flex space-x-3 mt-auto">
        <Link href={`/tasks/${task.id}`} passHref className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
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
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
