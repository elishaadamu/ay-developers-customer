// API Configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  endpoints: {
    login: "/auth/login",
    register: "/auth/register",
    updateProfile: "/auth/updateProfile",
    ticket: "/tickets",
    getTickets: "/tickets/user",
    GetProducts: "/products/",
    getPayments: "/payment/user/",
  },
};

// Export default config
export default config;
