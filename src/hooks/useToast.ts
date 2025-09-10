// lib/useToast.ts
import toast from "react-hot-toast";

/**
 * A custom hook or utility to display toast notifications.
 * Wraps react-hot-toast for consistent usage.
 */
const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showInfo = (message: string) => {
    toast(message); // Default toast for info
  };

  // You can add more specific toast types if needed, e.g., warning, loading
  const showLoading = (message: string) => {
    return toast.loading(message); // Returns a toast ID to dismiss later
  };

  const dismissToast = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    dismissToast,
  };
};

export default useToast;
