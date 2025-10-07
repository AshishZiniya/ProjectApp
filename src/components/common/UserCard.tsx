'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = memo(({ user }) => (
  <Card className="p-6 hover:shadow-md transition-all duration-200 group w-fit">
    <div className="flex flex-col items-start justify-between gap-5">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 transition-colors">
            {user.name}
          </h3>
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-400"
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
            <span className="text-gray-600 text-sm truncate">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Role and Actions */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div
          className={`px-3 py-1 text-xs font-medium ${
            user.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-800'
              : user.role === 'SUPERADMIN'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {user.role}
        </div>

        <Link href={`/users/${user.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="opacity-75 group-hover:opacity-100 transition-opacity duration-200"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  </Card>
));

UserCard.displayName = 'UserCard';

export default UserCard;
