'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PAGE_LIMIT_OPTIONS } from '@/constants';
import PaginationControls from '@/components/common/PaginationControls';
import { ComponentWithClassName } from '@/types';

interface DataListProps<T> extends ComponentWithClassName {
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
  showSearch?: boolean;
  showCreateButton?: boolean;
  showPagination?: boolean;
  gridCols?: string;
  skeletonHeight?: string;
  headerClassName?: string;
  contentClassName?: string;
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
  showSearch = true,
  showCreateButton = true,
  showPagination = true,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  skeletonHeight = 'min-h-[320px]',
  headerClassName,
  contentClassName,
}: DataListProps<T>) {
  return (
    <div className={`w-full ${className || ''}`}>
      {/* Header Section */}
      <div className={`text-center mb-8 sm:mb-12 ${headerClassName || ''}`}>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
          {subtitle}
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 px-4 sm:px-0">
        {showSearch && onSearchChange && (
          <div className="w-full sm:w-72 md:w-80 lg:w-96">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  onPageChange(1);
                }}
                className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 text-sm sm:text-base"
              />
            </div>
          </div>
        )}
        {showCreateButton && createButtonHref && (
          <Link href={createButtonHref} passHref>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-2xl text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              {createButtonText}
            </Button>
          </Link>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert
          type="error"
          message={error.message}
          className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
        />
      )}

      {/* Content Section */}
      <div className={contentClassName || ''}>
        {loading ? (
          <div className={`grid ${gridCols} gap-4 sm:gap-6 lg:gap-8`}>
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-4 sm:p-6 animate-pulse ${skeletonHeight}`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 sm:w-20"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 sm:w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {data.length === 0 && !error && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-8 text-center">
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
                <p className="text-gray-700 dark:text-gray-500 text-lg">
                  {emptyMessage}
                </p>
              </div>
            )}

            {/* Data Grid */}
            <div className={`grid ${gridCols} gap-8`}>
              {data.map((item) => (
                <div key={item.id}>
                  {renderItem(item)}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
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
    </div>
  );
}

export default DataList;
