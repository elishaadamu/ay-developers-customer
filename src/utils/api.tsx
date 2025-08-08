// API Configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  endpoints: {
    login: "/auth/login",
    register: "/auth/register",
  },
};

// Export default config
export default config;
