import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: send cookies with requests
});

// REMOVE request interceptor that adds Authorization header from localStorage
// Because backend expects tokens only in cookies
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint WITHOUT sending refresh token in body
        // The refresh token is sent automatically via httpOnly cookie
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data } = await api.post("/auth/refresh");

        // No need to save tokens in localStorage because backend sets cookies

        // Retry original request (cookies are sent automatically)
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Optionally redirect to login page here
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
