"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import api from "@/lib/api"; // Already imported
import { useState, useEffect } from "react";
import useToast from "@/hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface User {
  name: string;
  email: string;
  role: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { showSuccess, showError } = useToast();

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await api.get<{ user: User }>("/auth/me"); // Updated
        setUser(user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/auth/logout"); // Already using api.post
      showSuccess("Logout successfully...!");
      setUser(null);
      router.push("/auth/login");
    } catch {
      showError("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const isLoggedIn = !!user;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ProjectApp
        </Link>

        <div className="flex items-center space-x-4">
          {user?.role === "ADMIN" && (
            <Link
              href="/users"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Users
            </Link>
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
              <span className="flex text-gray-700 items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                <strong>{user?.name || user?.email}</strong>
              </span>
              <Button
                onClick={handleLogout}
                loading={logoutLoading}
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
