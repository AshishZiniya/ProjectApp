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
        isRegister: { label: "Is Register", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          // Check if this is a registration request
          const isRegister = credentials.isRegister === 'true';
          const apiUrl = isRegister
            ? `${API_BASE_URL}/auth/register`
            : `${API_BASE_URL}/auth/login`;

          console.log(`Attempting ${isRegister ? 'registration' : 'login'} to:`, apiUrl);

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              ...(credentials.isRegister === 'true' && {
                name: credentials.name,
                role: credentials.role || 'USER',
              }),
            }),
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
              console.error('API error response:', errorData);
            } catch (parseError) {
              console.error('Failed to parse error response:', parseError);
            }
            console.error('Authentication failed:', errorMessage);
            return null;
          }

          const data = await response.json();
          console.log('Login successful for user:', data.user?.email);

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
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
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
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};