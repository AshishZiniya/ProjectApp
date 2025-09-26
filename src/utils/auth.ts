import type { UserRole } from "@/types";

// Define role hierarchy and permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

export const PERMISSIONS = {
  // User management permissions
  VIEW_USERS: ["ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_USERS: ["ADMIN", "SUPERADMIN"] as UserRole[],
  ADD_ADMIN: ["ADMIN", "SUPERADMIN"] as UserRole[],

  // Project permissions
  VIEW_PROJECTS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_PROJECTS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],

  // Task permissions
  VIEW_TASKS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_TASKS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],

  // Admin permissions
  SYSTEM_ADMIN: ["SUPERADMIN"] as UserRole[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role has at least the specified role level
 */
export function hasRoleLevel(userRole: UserRole, minRole: UserRole): boolean {
  const userRoleLevel = ROLE_HIERARCHY[userRole];
  const minRoleLevel = ROLE_HIERARCHY[minRole];
  return userRoleLevel >= minRoleLevel;
}

/**
 * Get all permissions for a user role
 */
export function getUserPermissions(userRole: UserRole | undefined): Permission[] {
  if (!userRole) return [];

  return Object.keys(PERMISSIONS).filter(permission =>
    hasPermission(userRole, permission as Permission)
  ) as Permission[];
}

/**
 * Check if a user can access a resource based on ownership and permissions
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resourceUserId: string | undefined,
  requiredPermission?: Permission
): boolean {
  // Users can always access their own resources
  if (resourceUserId && userId === resourceUserId) {
    return true;
  }

  // Check if user has the required permission
  if (requiredPermission) {
    return hasPermission(userRole, requiredPermission);
  }

  // Default to false if no specific permission is required
  return false;
}
