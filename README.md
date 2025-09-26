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

- Node.js 18+ and npm/yarn
- Backend API server (NestJS) running on the configured API base URL

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-management-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
