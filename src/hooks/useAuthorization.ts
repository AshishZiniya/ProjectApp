"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRoleLevel,
  canAccessResource,
  getUserPermissions,
  type Permission,
} from "@/utils/auth";

interface UseAuthorizationReturn {
  // User state
  user: ReturnType<typeof useAuth>["user"];
  loading: ReturnType<typeof useAuth>["loading"];

  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRoleLevel: (minRole: import("@/types").UserRole) => boolean;

  // Resource access
  canAccessResource: (
    resourceUserId: string | undefined,
    requiredPermission?: Permission
  ) => boolean;

  // User permissions
  userPermissions: Permission[];

  // Convenience methods
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isUser: boolean;
  canManageUsers: boolean;
  canAddAdmin: boolean;
  canViewUsers: boolean;
}

/**
 * Hook for role-based authorization and permissions
 */
export function useAuthorization(): UseAuthorizationReturn {
  const { user, loading } = useAuth();

  const userPermissions = useMemo(() => getUserPermissions(user?.role), [user?.role]);

  const hasPermissionCheck = useCallback((permission: Permission) => hasPermission(user?.role, permission), [user?.role]);
  const hasAnyPermissionCheck = useCallback((permissions: Permission[]) => hasAnyPermission(user?.role, permissions), [user?.role]);
  const hasAllPermissionsCheck = useCallback((permissions: Permission[]) => hasAllPermissions(user?.role, permissions), [user?.role]);
  const hasRoleLevelCheck = useCallback((minRole: import("@/types").UserRole) => hasRoleLevel(user?.role, minRole), [user?.role]);

  const canAccessResourceCheck = useCallback((
    resourceUserId: string | undefined,
    requiredPermission?: Permission
  ) => canAccessResource(user?.role, user?.id, resourceUserId, requiredPermission), [user?.role, user?.id]);

  const convenienceChecks = useMemo(() => ({
    isAdmin: user?.role === "ADMIN",
    isSuperAdmin: user?.role === "SUPERADMIN",
    isUser: user?.role === "USER",
    canManageUsers: hasPermissionCheck("MANAGE_USERS"),
    canAddAdmin: hasPermissionCheck("ADD_ADMIN"),
    canViewUsers: hasPermissionCheck("VIEW_USERS"),
  }), [user?.role, hasPermissionCheck]);

  return {
    user,
    loading,
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
    hasAllPermissions: hasAllPermissionsCheck,
    hasRoleLevel: hasRoleLevelCheck,
    canAccessResource: canAccessResourceCheck,
    userPermissions,
    ...convenienceChecks,
  };
}