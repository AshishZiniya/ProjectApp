/**
 * Centralized logging utility
 * Provides consistent logging across the application with environment-aware behavior
 */

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING !== 'false';

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && this.isEnabled) {
      console.log(`[DEBUG] ${message}`, context ? context : '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isEnabled) {
      console.info(`[INFO] ${message}`, context ? context : '');
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (this.isEnabled) {
      console.warn(`[WARN] ${message}`, context ? context : '');
    }
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isEnabled) {
      console.error(`[ERROR] ${message}`, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
        ...context,
      });
    }
  }

  /**
   * Log API requests (only in development)
   */
  apiRequest(method: string, url: string, context?: LogContext): void {
    if (this.isDevelopment && this.isEnabled) {
      console.log(`[API REQUEST] ${method} ${url}`, context ? context : '');
    }
  }

  /**
   * Log API responses (only in development)
   */
  apiResponse(
    method: string,
    url: string,
    status: number,
    context?: LogContext
  ): void {
    if (this.isDevelopment && this.isEnabled) {
      const logFn = status >= 400 ? console.error : console.log;
      logFn(
        `[API RESPONSE] ${method} ${url} - ${status}`,
        context ? context : ''
      );
    }
  }

  /**
   * Log performance metrics
   */
  performance(label: string, duration: number): void {
    if (this.isDevelopment && this.isEnabled) {
      console.log(`[PERFORMANCE] ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Create a performance timer
   */
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.performance(label, duration);
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
