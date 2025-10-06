'use client';

import React, { Suspense, lazy, memo } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

const ProjectsList = lazy(() => import('./ProjectsList'));

const ProjectsPageSkeleton = memo(() => (
  <div className="min-h-screen animated-bg">
    <div className="p-6 h-full">
      <div className="text-center mb-16 min-h-[120px]">
        <div className="h-16 bg-white/10 rounded-2xl w-96 mx-auto mb-6 animate-pulse glass-card"></div>
        <div className="h-6 bg-white/10 rounded-xl w-80 mx-auto animate-pulse"></div>
      </div>
      <div className="flex justify-between items-center mb-8 min-h-[40px]">
        <div className="h-12 bg-white/10 rounded-xl w-1/3 animate-pulse glass-card"></div>
        <div className="h-12 bg-white/10 rounded-xl w-40 animate-pulse glass-card"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 animate-pulse min-h-[320px]"
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
    </div>
  </div>
));

ProjectsPageSkeleton.displayName = 'ProjectsPageSkeleton';

const ProjectsPage: React.FC = memo(() => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Suspense fallback={<ProjectsPageSkeleton />}>
          <ProjectsList />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
});

ProjectsPage.displayName = 'ProjectsPage';

export default ProjectsPage;
