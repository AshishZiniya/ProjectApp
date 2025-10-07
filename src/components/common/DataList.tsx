'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import PaginationControls from '@/components/common/PaginationControls';

interface DataListProps<T> {
  title: string;
  subtitle: string;
  data: T[] | undefined;
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  limit: number;
  searchQuery?: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange?: (query: string) => void;
  createButtonHref?: string;
  createButtonText?: string;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
  limitOptions?: number[];
  className?: string;
}

function DataList<T extends { id: string }>({
  title,
  subtitle,
  data = [],
  loading,
  error,
  totalPages,
  currentPage,
  limit,
  searchQuery = '',
  onPageChange,
  onLimitChange,
  onSearchChange,
  createButtonHref,
  createButtonText = 'Create New',
  renderItem,
  emptyMessage = 'No items found.',
  limitOptions = PAGE_LIMIT_OPTIONS.PROJECTS,
  className,
}: DataListProps<T>) {
  return (
    <div
      className={`px-6 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen w-full ${
        className || ''
      }`}
    >
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 animate-slide-in-left">
        {onSearchChange && (
          <div className="w-full sm:w-80 lg:w-96">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0"
              />
            </div>
          </div>
        )}
        {createButtonHref && (
          <Link href={createButtonHref} passHref>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-2xl"
            >
              {createButtonText}
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert
          type="error"
          message={error.message}
          className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(limit)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 animate-pulse min-h-[320px]"
            >
              <div className="h-4 bg-white/10 rounded mb-4"></div>
              <div className="h-3 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-white/10 rounded-xl flex-1"></div>
                <div className="h-10 bg-white/10 rounded-xl flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {data.length === 0 && !error && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-8 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-900 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 003.586 13H3"
                  />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-500 text-lg">{emptyMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item) => (
              <div key={item.id} className="animate-fade-in-up">
                {renderItem(item)}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                limit={limit}
                onPageChange={onPageChange}
                onLimitChange={(newLimit) => {
                  onLimitChange(newLimit);
                  onPageChange(1);
                }}
                limitOptions={limitOptions}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DataList;
