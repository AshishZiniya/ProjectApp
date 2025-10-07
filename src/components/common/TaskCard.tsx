'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import {
  Task,
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
} from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onDelete?: (task: Task) => void;
}

// Helper function to get priority info from string value
const getPriorityInfo = (priority: string) => {
  // Ensure priority is a valid string value
  if (!priority || !TASK_PRIORITY_CONFIG[priority as keyof typeof TASK_PRIORITY_CONFIG]) {
    console.warn(`Invalid priority value: ${priority}. Defaulting to LOW.`);
    return TASK_PRIORITY_CONFIG.LOW;
  }

  return TASK_PRIORITY_CONFIG[priority as keyof typeof TASK_PRIORITY_CONFIG];
};

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onDelete }) => {
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = TASK_STATUS_CONFIG[task.status as keyof typeof TASK_STATUS_CONFIG] || {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-800'
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
      <Card className="p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">ID</span>
            </div>
            <div>
              <p className="text-red-400 text-sm mb-1">Error: Invalid task data</p>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {task.title || 'Untitled Task'}
              </h3>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 group w-fit">
      <div className="flex flex-col items-start gap-5 justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Task Avatar/ID */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {task.id.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${priorityInfo.color} rounded-full`}></div>
            <span className="text-sm font-medium text-gray-600">
              {priorityInfo.label}
            </span>
          </div>

          <div className={`px-3 py-1 ${statusInfo.color} text-xs font-medium`}>
            {statusInfo.label}
          </div>

          <Link href={`/tasks/${task.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="opacity-75 group-hover:opacity-100 transition-opacity duration-200"
            >
              View Task
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
