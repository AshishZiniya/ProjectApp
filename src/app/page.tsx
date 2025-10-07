// app/page.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faUsers,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  return (
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center text-gray-900 dark:text-white p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl float animate-delay-100"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float animate-delay-300"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl float animate-delay-500"></div>
      </div>

      <div className="text-center mb-16 relative z-10 animate-fade-in-up">
        <div className="mb-8 min-h-[80px] flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-neon rounded-2xl flex items-center justify-center pulse-glow animate-scale-in">
            <FontAwesomeIcon icon={faRocket} className="text-4xl text-gray-900 dark:text-white" />
          </div>
        </div>
        <h1 className="text-7xl font-extrabold text-center mb-8 leading-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-slide-in-left">
          Welcome to Your <span className="block">Project Management</span> Hub
        </h1>
        <p className="text-xl text-center max-w-4xl mb-12 text-gray-700 dark:text-gray-500 leading-relaxed animate-fade-in-up animate-delay-200">
          Organize your tasks, manage projects, and collaborate seamlessly with
          your team. Streamline your workflow and boost productivity in a
          stunning dark interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-300">
          <Link href="/projects">
            <Button
              size="xl"
              variant="primary"
              className="shadow-2xl transition-all duration-300 transform"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="xl"
              variant="outline"
              className="shadow-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-7xl relative z-10">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-center p-8 rounded-2xl animate-fade-in-up animate-delay-100 min-h-[250px] flex flex-col justify-center">
          <div className="min-h-[60px] flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-3xl text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Task Management
          </h3>
          <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed">
            Create, assign, and track tasks with ease in our intuitive
            interface.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-center p-8 rounded-2xl animate-fade-in-up animate-delay-200 min-h-[250px] flex flex-col justify-center">
          <div className="min-h-[60px] flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-3xl text-gray-900 dark:text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Team Collaboration
          </h3>
          <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed">
            Work together efficiently with your team members in real-time.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-center p-8 rounded-2xl animate-fade-in-up animate-delay-300 min-h-[250px] flex flex-col justify-center">
          <div className="min-h-[60px] flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faRocket}
                className="text-3xl text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Project Tracking
          </h3>
          <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed">
            Monitor project progress and milestones with advanced analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
