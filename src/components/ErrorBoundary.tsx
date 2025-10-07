"use client";

import React from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Alert from "./ui/Alert";
import { logger } from "@/utils/logger";
import { getUserFriendlyMessage } from "@/utils/errors";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: React.ErrorInfo | undefined;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error?: Error | undefined;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
    <Card className="w-full max-w-lg text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
        </p>
        {error && (
          <Alert
            type="error"
            message={getUserFriendlyMessage(error)}
            className="mb-4 text-left"
          />
        )}
      </div>
      <div className="flex gap-3 justify-center">
        <Button onClick={resetError} variant="primary">
          Try Again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="secondary"
        >
          Refresh Page
        </Button>
      </div>
    </Card>
  </div>
);

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error using our enhanced logging system
    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
