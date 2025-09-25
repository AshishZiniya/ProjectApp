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
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return PERMISSIONS[permission].includes(userRole);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  if (!userRole) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole | undefined, permissions: Permission[]): boolean {
  if (!userRole) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role is at least the specified level
 */
export function hasRoleLevel(userRole: UserRole | undefined, minRole: UserRole): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * Get all permissions for a user role
 */
export function getUserPermissions(userRole: UserRole | undefined): Permission[] {
  if (!userRole) return [];

  return Object.keys(PERMISSIONS).filter(permission =>
    PERMISSIONS[permission as Permission].includes(userRole)
  ) as Permission[];
}

/**
 * Check if user can access a resource (either owns it or has admin permissions)
 */
export function canAccessResource(
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceUserId: string | undefined,
  requiredPermission?: Permission
): boolean {
  if (!userRole) return false;

  // User can always access their own resources
  if (userId === resourceUserId) return true;

  // Check role-based permission
  if (requiredPermission) {
    return hasPermission(userRole, requiredPermission);
  }

  // Default to admin-level access for resource management
  return hasRoleLevel(userRole, "ADMIN");
}