// app/users/UsersList.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useToast from "@/hooks/useToast";
import { DEFAULT_PAGE_LIMIT, USERS_PAGE_LIMIT_OPTIONS } from "@/constants";
import PaginationControls from "@/components/common/PaginationControls";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);

  const { showSuccess, showError } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<User>>("/users", {
        params: { q, page, limit },
      });
      setUsers(response.data);
      setTotalPages(response.pages); // Assuming response.pages holds total pages
    } catch {
      showError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, q]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        showSuccess("User deleted successfully!");
      } catch {
        showError("Failed to Delete User...!");
      }
    }
  };

  const UserCardSkeleton = () => (
    <Card className="flex flex-col justify-between animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div> {/* Name */}
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div> {/* Email */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div> {/* Role */}
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>{" "}
        {/* View Details Button */}
        <div className="h-8 w-20 bg-gray-200 rounded"></div>{" "}
        {/* Delete Button */}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-xl text-gray-600">Manage user accounts and permissions</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search users by name..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1); // Reset page on search
          }}
          className="w-1/3"
        />
        {/* Add a button to create new users if applicable */}
        {/* <Button variant="primary">Create New User</Button> */}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {users.length === 0 && (
            <Alert type="info" message="No users found." />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Email: {user.email}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Role:{" "}
                    <span className="font-medium text-blue-700">
                      {user.role}
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link href={`/users/${user.id}`} passHref>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              limitOptions={USERS_PAGE_LIMIT_OPTIONS}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UsersList;
