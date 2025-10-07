'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface UserCardProps {
  user: User;
  onDelete?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = memo(({ user, onDelete }) => (
  <Card className="flex flex-col justify-between transition-all duration-300 min-h-[280px] group animate-fade-in-up">
    <div className="flex-1">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 transition-transform duration-300 shadow-lg">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 transition-colors">
            {user.name}
          </h3>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
              user.role === 'ADMIN'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                : user.role === 'SUPERADMIN'
                ? 'bg-red-500/20 text-red-300 border border-red-400/50'
                : 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
            }`}
          >
            {user.role}
          </div>
        </div>
      </div>
      <div className="flex items-center text-gray-700 dark:text-gray-500 text-sm">
        <div className="w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-3 h-3 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <span className="font-medium text-gray-600 dark:text-gray-200">{user.email}</span>
      </div>
    </div>
    <div className="flex space-x-3 mt-auto">
      <Link href={`/users/${user.id}`} passHref className="flex-1">
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
          onClick={() => onDelete(user)}
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
));

UserCard.displayName = 'UserCard';

export default UserCard;
