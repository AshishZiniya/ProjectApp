"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { useAuth } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Logout successfully...!");
      router.push("/auth/login");
    } catch {
      showError("Logout failed. Please try again.");
    }
  };

  const isLoggedIn = !!user;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-xl h-20 px-4 sm:px-6 lg:px-8 z-50 border-b border-gray-200/50 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-300 flex items-center gap-3"
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Task Manager Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
              quality={85}
            />
          </div>
          <span className="font-bold text-xl hidden sm:block">Task Manager</span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Authentication and authorization are handled in middleware */}
          <Link
            href="/users"
            className="hidden lg:block text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Users
          </Link>
          <Link
            href="/admin/add-admin"
            className="hidden lg:block text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Add Admin
          </Link>
          <Link
            href="/projects"
            className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Projects
          </Link>
          <Link
            href="/tasks"
            className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Tasks
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={`/users/${user?.id}`}
                className="flex text-gray-700 items-center gap-3 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                <strong>{user?.name || user?.email}</strong>
              </Link>
              <Button
                onClick={handleLogout}
                loading={authLoading}
                variant="secondary"
                size="sm"
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
