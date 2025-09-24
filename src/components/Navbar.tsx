"use client";

import Link from "next/link";
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
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg py-4 px-6 z-50 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-300 flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          ProjectApp
        </Link>

        <div className="flex items-center space-x-4">
          {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
            <>
              <Link
                href="/users"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Users
              </Link>
              {user?.role === "SUPERADMIN" && (
                <Link
                  href="/admin/add-admin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Add Admin
                </Link>
              )}
            </>
          )}
          <Link
            href="/projects"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/tasks"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Tasks
          </Link>

          {isLoggedIn ? (
            <>
              <Link href={`/users/${user?.id}`} className="flex text-gray-700 items-center gap-3 hover:text-blue-600 transition-colors cursor-pointer">
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
