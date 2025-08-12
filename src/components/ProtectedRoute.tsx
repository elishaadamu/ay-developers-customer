import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Store the attempted URL to redirect back after login
    const currentPath = window.location.pathname;
    if (!currentPath.includes("/signin") && !currentPath.includes("/signup")) {
      sessionStorage.setItem("redirectUrl", currentPath);
    }
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
