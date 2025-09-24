// app/page.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-6">
      <h1 className="text-5xl font-extrabold text-center mb-6 leading-tight">
        Welcome to Your{' '}
        <span className="text-blue-600">Project Management</span> Hub
      </h1>
      <p className="text-xl text-center max-w-2xl mb-10">
        Organize your tasks, manage projects, and collaborate seamlessly with
        your team.
      </p>
      <div className="flex space-x-4">
        <Link href="/projects">
          <Button size="lg" variant="primary">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
