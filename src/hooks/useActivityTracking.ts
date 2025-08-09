import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  initializeActivityTracking,
  stopActivityTracking,
  onActivityLogout,
  removeActivityLogout,
  isAuthenticated,
  isSessionExpired,
} from "@/utils/auth";

/**
 * Custom hook for managing user activity tracking and automatic logout
 * @returns Object with utility functions for activity management
 */
export const useActivityTracking = () => {
  const navigate = useNavigate();

  // Handle logout due to inactivity
  const handleInactivityLogout = useCallback(() => {
    navigate("/signin");
  }, [navigate]);

  // Initialize activity tracking on mount
  useEffect(() => {
    if (isAuthenticated()) {
      // Check if session is already expired
      if (isSessionExpired()) {
        handleInactivityLogout();
        return;
      }

      // Initialize activity tracking
      initializeActivityTracking();

      // Add logout listener
      onActivityLogout(handleInactivityLogout);

      // Cleanup on unmount
      return () => {
        stopActivityTracking();
        removeActivityLogout(handleInactivityLogout);
      };
    }
  }, [handleInactivityLogout]);

  return {
    /**
     * Manually start activity tracking (useful after login)
     */
    startTracking: () => {
      initializeActivityTracking();
      onActivityLogout(handleInactivityLogout);
    },

    /**
     * Manually stop activity tracking (useful before logout)
     */
    stopTracking: () => {
      stopActivityTracking();
      removeActivityLogout(handleInactivityLogout);
    },
  };
};
