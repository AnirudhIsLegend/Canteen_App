import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const currentRole = localStorage.getItem("role");

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      // Redirect to appropriate login page based on current role
      // Only redirect if we're not already on a login page
      if (!window.location.pathname.includes("/login")) {
        if (currentRole === "admin") {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
