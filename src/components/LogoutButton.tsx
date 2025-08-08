import { Button } from "@/components/ui/button";
import { logout, stopActivityTracking } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

interface LogoutButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

/**
 * Logout button component with proper activity tracking cleanup
 */
export const LogoutButton = ({
  className,
  variant = "outline",
}: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Stop activity tracking
      stopActivityTracking();

      // Perform logout
      logout();

      // Show success message
      message.success("Logged out successfully");

      // Redirect to signin page
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Error during logout");
    }
  };

  return (
    <Button onClick={handleLogout} variant={variant} className={className}>
      Logout
    </Button>
  );
};
