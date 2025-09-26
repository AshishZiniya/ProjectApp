// types/auth.ts

import type { UserRole } from "./index";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface AuthUser extends DefaultUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: AuthUser & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
  }

  interface User extends AuthUser {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    role?: UserRole;
  }
}
