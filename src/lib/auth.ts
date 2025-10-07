import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types";
import { API_BASE_URL } from "@/constants";

// Helper type for extended user properties
type ExtendedUser = {
  accessToken?: string;
  refreshToken?: string;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        isRegister: { label: "Is Register", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if this is a registration request
          const isRegister = credentials.isRegister === "true";
          const apiUrl = isRegister
            ? `${API_BASE_URL}/auth/register`
            : `${API_BASE_URL}/auth/login`;


          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              ...(credentials.isRegister === "true" && {
                name: credentials.name,
                role: credentials.role || "USER",
              }),
            }),
          });


          if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch {
              // Failed to parse error response
            }
            throw new Error(errorMessage);
          }

          const data = await response.json();

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          } as const;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 24 hours x 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 24 hours x 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Extend token with custom properties
        const extendedUser = user as ExtendedUser;
        Object.assign(token, {
          accessToken: extendedUser.accessToken,
          refreshToken: extendedUser.refreshToken,
          role: extendedUser.role,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        Object.assign(session.user, { role: token.role });
        Object.assign(session, {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};
