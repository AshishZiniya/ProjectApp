// app/users/UsersList.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import useToast from "@/hooks/useToast";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { showSuccess, showError } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<User>>("/users", {
        params: { q, page, limit },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.pages);
    } catch {
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        User Management
      </h1>

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

      {loading && <LoadingSpinner />}

      {!loading && users.length === 0 && (
        <Alert type="info" message="No users found." />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {user.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">Email: {user.email}</p>
              <p className="text-gray-600 text-sm mb-4">
                Role:{" "}
                <span className="font-medium text-blue-700">{user.role}</span>
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
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            variant="secondary"
          >
            Next
          </Button>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default UsersList;
