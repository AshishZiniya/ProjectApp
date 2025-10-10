'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import { useAuth } from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logout successfully...!');
      router.push('/auth/login');
    } catch {
      showError('Logout failed. Please try again.');
    }
  };

  const isLoggedIn = !!user;

  return (
    <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-xl h-16 sm:h-20 px-3 sm:px-4 md:px-6 lg:px-8 z-50 flex items-center animate-slide-in-left">
      <div className="container mx-auto flex justify-between items-center w-full">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-all duration-300 flex items-center gap-2 sm:gap-3 group dark:text-primary-400 dark:hover:text-primary-300"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-neon rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <Image
              src="/logo.svg"
              alt="Task Manager Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain relative z-10 p-1.5 sm:p-2"
              priority
              quality={85}
            />
          </div>
          <span className="font-bold text-lg sm:text-xl hidden xs:inline text-foreground group-hover:text-primary-600 transition-colors dark:group-hover:text-primary-300">
            Task Manager
          </span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Authentication and authorization are handled in middleware */}
          <Link
            href="/users"
            className="hidden lg:block text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 dark:text-gray-500 dark:hover:text-primary-400 dark:hover:bg-white/5 dark:hover:border-white/10"
          >
            Users
          </Link>
          <Link
            href="/admin/add-admin"
            className="hidden lg:block text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 dark:text-gray-500 dark:hover:text-primary-400 dark:hover:bg-white/5 dark:hover:border-white/10"
          >
            Add Admin
          </Link>
          <Link
            href="/projects"
            className="text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 dark:text-gray-500 dark:hover:text-primary-400 dark:hover:bg-white/5 dark:hover:border-white/10"
          >
            Projects
          </Link>
          <Link
            href="/tasks"
            className="text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 dark:text-gray-500 dark:hover:text-primary-400 dark:hover:bg-white/5 dark:hover:border-white/10"
          >
            Tasks
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={`/users/${user?.id}`}
                className="flex text-gray-600 items-center gap-3 hover:text-primary-600 transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-primary-50 border border-transparent hover:border-primary-200 dark:text-gray-500 dark:hover:text-primary-400 dark:hover:bg-white/5 dark:hover:border-white/10"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-white text-sm"
                  />
                </div>
                <strong className="hidden sm:block">
                  {user?.name || user?.email}
                </strong>
              </Link>
              <Button
                onClick={handleLogout}
                loading={authLoading}
                variant="secondary"
                size="sm"
                className="hover:bg-error-50 hover:border-error-200 dark:hover:bg-error-500/20 dark:hover:border-error-400/50"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
