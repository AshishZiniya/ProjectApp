# Project Management App

A modern, full-stack project management application built with Next.js 15, TypeScript, and Tailwind CSS. This application provides comprehensive task and project management capabilities with real-time collaboration features.

## 🚀 Features

- **Task Management**: Create, assign, and track tasks with priority levels and due dates
- **Project Organization**: Organize tasks into projects with detailed descriptions
- **User Management**: Role-based access control (User, Admin, Super Admin)
- **Real-time Collaboration**: Live updates and notifications
- **Authentication**: Secure login/register with JWT tokens
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Performance Optimized**: Fast loading with optimized bundle sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Class Variance Authority
- **Icons**: Font Awesome
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Performance**: Vercel Speed Insights

## 📋 Prerequisites

- Node.js 18+ and Yarn
- Backend API server (NestJS) running on the configured API base URL

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-management-app
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
   ```

4. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin functionality
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── users/             # User management
│   └── comments/          # Comment system
├── components/            # Reusable React components
│   ├── ui/               # UI components (Button, Modal, etc.)
│   ├── common/           # Common components
│   └── ErrorBoundary.tsx # Global error boundary
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── constants/            # Application constants
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🎨 Customization

### Styling

The project uses Tailwind CSS for styling. You can customize the design by:

- Modifying `tailwind.config.js`
- Updating CSS classes in components
- Adding new design tokens in `src/styles/globals.css`

### Components

UI components are located in `src/components/ui/`. The Button component uses Class Variance Authority for flexible styling variants.

### API Configuration

Update the API base URL in `src/constants/index.ts` or via environment variables.

## 🔒 Authentication

The app supports JWT-based authentication with:

- Login/Register functionality
- Token refresh mechanism
- Protected routes
- Role-based permissions

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🚀 Performance Features

- **Image Optimization**: Automatic WebP/AVIF conversion
- **Bundle Splitting**: Optimized chunk splitting
- **Tree Shaking**: Unused code elimination
- **Lazy Loading**: Components and routes
- **Caching**: Strategic caching headers
- **Compression**: Gzip/Brotli compression

## 🛡️ Security

- Content Security Policy headers
- XSS protection
- CSRF protection
- Secure cookie handling
- Input validation and sanitization

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

# NextAuth JWT Authentication Setup

This document explains how to set up and use NextAuth for JWT authentication and authorization in the Task Manager App.

## Installation

First, install the required dependencies:

```bash
yarn add next-auth @auth/prisma-adapter
```

## Configuration

### 1. Environment Variables

Copy the `.env.example` file to `.env.local` and configure the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: Generate a secure `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

### 2. NextAuth Configuration

The NextAuth configuration is located in `src/lib/auth.ts` and includes:

- **Credentials Provider**: Handles email/password authentication
- **JWT Strategy**: Uses JWT tokens for session management
- **Custom Callbacks**: Extends JWT and session objects with custom properties
- **Role-based Authorization**: Integrates with existing role system

### 3. API Routes

NextAuth API routes are configured in `src/app/api/auth/[...nextauth]/route.ts`.

## Usage

### Session Provider

The `SessionProvider` is automatically wrapped around the entire application in `ClientLayout.tsx`. This enables NextAuth functionality throughout the app.

### Authentication Hook

The `useAuth` hook has been updated to use NextAuth:

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, loading, login, logout, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Auth Guard

The `AuthGuard` component now uses NextAuth sessions:

```typescript
import AuthGuard from "@/components/AuthGuard";

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>This content is protected</div>
    </AuthGuard>
  );
}

function PublicPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div>This content is public</div>
    </AuthGuard>
  );
}
```

### Authorization Utilities

The existing authorization utilities in `src/utils/auth.ts` remain compatible:

```typescript
import { hasPermission, hasRoleLevel, canAccessResource } from "@/utils/auth";

function checkPermissions(userRole: UserRole) {
  const canViewUsers = hasPermission(userRole, "VIEW_USERS");
  const canManageUsers = hasPermission(userRole, "MANAGE_USERS");
  const isAdmin = hasRoleLevel(userRole, "ADMIN");

  return { canViewUsers, canManageUsers, isAdmin };
}
```

## Features

### JWT Token Management

- **Automatic Token Refresh**: NextAuth handles token refresh automatically
- **Secure Storage**: JWT tokens are stored securely by NextAuth
- **Session Management**: Built-in session management with configurable timeouts

### Role-Based Access Control

- **Permission System**: Integrates with existing permission system
- **Role Hierarchy**: Supports role hierarchy (USER < ADMIN < SUPERADMIN)
- **Resource Access**: Can check ownership and permissions for resources

### Security Features

- **CSRF Protection**: Built-in CSRF protection
- **Secure Cookies**: HttpOnly cookies for sensitive data
- **Token Validation**: Automatic token validation and refresh

## API Integration

The authentication system integrates with your existing NestJS backend:

- **Login**: Calls `/auth/login` endpoint
- **Register**: Calls `/auth/register` endpoint
- **Token Refresh**: Handled automatically by NextAuth
- **User Data**: Fetches user data from `/auth/me` endpoint

## Migration from Custom Auth

If you're migrating from the custom authentication system:

1. **Backup your existing auth implementation**
2. **Install NextAuth dependencies**
3. **Configure environment variables**
4. **The existing components will work with minimal changes**

### Key Changes Made

1. **useAuth Hook**: Now uses `useSession` from NextAuth
2. **AuthGuard**: Uses NextAuth session instead of custom auth state
3. **SessionProvider**: Wraps the app to provide session context
4. **Type Extensions**: Extended NextAuth types for custom properties

## Troubleshooting

### Common Issues

1. **"NEXTAUTH_SECRET not set"**: Make sure to set the `NEXTAUTH_SECRET` environment variable
2. **"Module not found"**: Ensure NextAuth is properly installed
3. **"Session is null"**: Check if SessionProvider is properly configured
4. **"API calls failing"**: Verify `NEXT_PUBLIC_API_URL` is set correctly

### Debug Mode

Enable NextAuth debug mode by adding to your environment:

```env
NEXTAUTH_DEBUG=true
```

## Security Considerations

1. **Use HTTPS in production**
2. **Set secure cookies in production**
3. **Rotate JWT secrets regularly**
4. **Implement rate limiting on auth endpoints**
5. **Use strong passwords and proper validation**

## Next Steps

1. **Test the implementation** with your existing login/register forms
2. **Update any custom auth middleware** to work with NextAuth
3. **Add additional OAuth providers** if needed (Google, GitHub, etc.)
4. **Implement logout functionality** in your UI components
5. **Add session timeout handling** if required

## Support

For NextAuth-specific issues, refer to the [NextAuth.js documentation](https://next-auth.js.org/).
