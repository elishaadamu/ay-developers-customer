import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://*.paystack.co https://checkout.paystack.com https://*.checkout.paystack.com",
        "connect-src 'self' https://api.paystack.co https://*.paystack.co https://checkout.paystack.com https://*.checkout.paystack.com",
        "frame-src 'self' https://checkout.paystack.com https://*.paystack.co https://standard.paystack.co",
        "img-src 'self' data: https: blob:",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
        "worker-src 'self' blob:",
        "child-src 'self' blob: https://checkout.paystack.com https://*.paystack.co https://standard.paystack.co",
        "form-action 'self' https://api.paystack.co https://*.paystack.co",
        "script-src-elem 'self' 'unsafe-inline' https://js.paystack.co https://*.paystack.co https://checkout.paystack.com https://*.checkout.paystack.com",
      ].join("; "),
    },
  },
});
