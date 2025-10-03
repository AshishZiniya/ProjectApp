"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PAGE_LIMIT_OPTIONS } from "@/constants";
import PaginationControls from "@/components/common/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";

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
  skeletonVariant: "project" | "task" | "user";
  emptyMessage?: string;
  limitOptions?: number[];
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
  searchQuery = "",
  onPageChange,
  onLimitChange,
  onSearchChange,
  createButtonHref,
  createButtonText = "Create New",
  renderItem,
  skeletonVariant,
  emptyMessage = "No items found.",
  limitOptions = PAGE_LIMIT_OPTIONS.PROJECTS,
}: DataListProps<T>) {

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {onSearchChange && (
          <div className="w-full sm:w-80 lg:w-96">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full"
            />
          </div>
        )}
        {createButtonHref && (
          <Link href={createButtonHref} passHref>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {createButtonText}
            </Button>
          </Link>
        )}
      </div>

      {error && <Alert type="error" message={error.message} className="mb-4" />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <SkeletonCard key={index} variant={skeletonVariant} />
          ))}
        </div>
      ) : (
        <>
          {data.length === 0 && !error && (
            <Alert type="info" message={emptyMessage} className="text-center" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div key={item.id}>
                {renderItem(item)}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}

export default DataList;