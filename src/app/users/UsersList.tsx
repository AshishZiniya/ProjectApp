// app/users/UsersList.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<User>>("/users", {
        params: { q, page, limit },
      });
      setUsers(response.data);
      setTotalPages(response.pages); // Assuming response.pages holds total pages
      setLoading(false);
    } catch {
      showError("Failed to fetch users.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, q]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      showSuccess("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      setDeleting(false);
    } catch {
      showError("Failed to Delete User...!");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const UserCardSkeleton = () => (
    <Card className="flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-24 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 w-20 bg-gray-200 rounded flex-1"></div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              <Card key={user.id} className="flex flex-col justify-between hover:scale-105 transition-transform">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {user.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Link href={`/users/${user.id}`} passHref>
                    <Button variant="secondary" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                    className="flex-1"
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

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete User"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
};

export default UsersList;
