"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api"; // Already imported
import { User } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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
      const response = await api.get<User>(`/users/${id}`); // Already using api.get
      setUser(response);
      setEditedName(response.name);
      setEditedEmail(response.email);
      console.log("object");
    } catch {
      showError("Failed to fetch user details.");
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
        // Already using api.patch
        name: editedName,
        email: editedEmail,
      });
      setUser(response);
      setIsEditing(false);
      showSuccess("User updated successfully!");
    } catch {
      showError("Failed to update user.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} className="m-6" />;
  if (!user)
    return <Alert type="info" message="User not found." className="m-6" />;

  return (
    <div className="min-w-7xl container mx-auto p-6">
      <Card className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          User Details
        </h1>

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
