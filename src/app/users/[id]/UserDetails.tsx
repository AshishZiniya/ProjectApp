"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, UserRole } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormGroup from "@/components/common/FormGroup";
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
  const [editedRole, setEditedRole] = useState<UserRole>("USER");
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
      setEditedRole(response.role);
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
      const updateData: Partial<User> = {
        name: editedName,
        email: editedEmail,
      };
      if (user?.role === "ADMIN") {
        updateData.role = editedRole;
      }
      const response = await api.patch<User>(`/users/${id}`, updateData);
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
    <Card className="shadow-2xl animate-pulse">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-end space-x-3">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-28 bg-gray-200 rounded"></div>
        </div>
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <UserDetailsSkeleton />
        </div>
      </div>
    );
  if (error) return <Alert type="error" message={error} className="m-6" />;
  if (!user)
    return <Alert type="info" message="User not found." className="m-6" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-4xl">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-2xl text-gray-600 font-medium">{user.name}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

        {updateError && (
          <Alert type="error" message={updateError} className="mb-4" />
        )}

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">#</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">User ID</h3>
                </div>
                <p className="text-gray-600 font-mono text-sm">{user.id}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">@</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Role</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Member Since</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(user.updatedAt).toLocaleString()}
                </div>
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => router.back()}>
                    Back to List
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">✏️</span>
                </div>
                Edit Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              {user?.role === "ADMIN" && (
                <div className="mb-4">
                  <FormGroup label="User Role" htmlFor="role">
                    <select
                      id="role"
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value as UserRole)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </FormGroup>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-blue-200">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} loading={updateLoading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        )}
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;
