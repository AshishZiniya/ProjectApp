// app/users/page.tsx
"use client";
import UsersList from "./UsersList";

export default function UsersListPage() {
  // Authentication and authorization are now handled entirely in middleware
  // This page will only be accessible to users with VIEW_USERS permission
  return <UsersList />;
}
