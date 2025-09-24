"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { User } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useToast from "@/hooks/useToast";

const UserDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<User>(`/users/${id}`);
      setUser(response);
      setEditedName(response.name);
      setEditedEmail(response.email);
    } catch {
      showError("Failed to fetch user details.");
      setError("Failed to load user details.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUser]);

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const response = await api.patch<User>(`/users/${id}`, {
        name: editedName,
        email: editedEmail,
      });
      setUser(response);
      setIsEditing(false);
      showSuccess("User updated successfully!");
    } catch {
      showError("Failed to update user.");
      setUpdateError("Failed to update user.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const UserDetailsSkeleton = () => (
    <Card className="max-w-8xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div> {/* Title */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-1/2"></div> {/* Value */}
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div> {/* Value */}
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-full"></div> {/* Value */}
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* Value */}
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
      </div>
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div> {/* Label */}
        <div className="h-6 bg-gray-200 rounded w-2/3"></div> {/* Value */}
      </div>
      <div className="flex justify-end space-x-3">
        <div className="h-10 w-24 bg-gray-200 rounded"></div> {/* Button */}
        <div className="h-10 w-24 bg-gray-200 rounded"></div> {/* Button */}
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="min-w-7xl container mx-auto p-6">
        <UserDetailsSkeleton />
      </div>
    );
  if (error) return <Alert type="error" message={error} className="m-6" />;
  if (!user)
    return <Alert type="info" message="User not found." className="m-6" />;

  return (
    <div className="min-w-7xl container mx-auto p-6">
      <Card className="max-w-8xl mx-auto shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Details
          </h1>
          <p className="text-2xl text-gray-600 font-medium">{user.name}</p>
        </div>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">ID:</p>
              <p className="text-lg font-medium text-gray-900">{user.id}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Name:</p>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Email:</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Role:</p>
              <p className="text-lg font-medium text-gray-900">{user.role}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Created At:</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-sm">Updated At:</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => router.back()}>
                Back to List
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit User</Button>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mb-4"
            />
            <Input
              label="Email"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="mb-6"
            />
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} loading={updateLoading}>
                Save Changes
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserDetails;
