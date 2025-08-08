import {
  getEncryptedStorage,
  removeEncryptedStorage,
  setEncryptedStorage,
} from "./encryption";

// Activity tracking constants
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const ACTIVITY_KEY = "lastActivity";

let inactivityTimer: NodeJS.Timeout | null = null;
let activityListeners: (() => void)[] = [];

/**
 * Check if user is authenticated (based on user data presence)
 * @returns boolean indicating if user is logged in
 */
export const isAuthenticated = (): boolean => {
  try {
    const userData = getEncryptedStorage("userData");
    return !!userData;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

/**
 * Get the current user's data
 * @returns The user data or null
 */
export const getUserData = (): any | null => {
  try {
    return getEncryptedStorage("userData");
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Logout user by clearing all authentication data
 */
export const logout = (): void => {
  try {
    removeEncryptedStorage("userData");
    removeEncryptedStorage(ACTIVITY_KEY);
    clearInactivityTimer();
    // Notify all activity listeners about logout
    activityListeners.forEach((callback) => callback());
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

/**
 * Updates the last activity timestamp
 */
const updateLastActivity = (): void => {
  const timestamp = Date.now();
  setEncryptedStorage(ACTIVITY_KEY, timestamp);
};

/**
 * Gets the last activity timestamp
 * @returns Last activity timestamp or null
 */
const getLastActivity = (): number | null => {
  try {
    return getEncryptedStorage(ACTIVITY_KEY);
  } catch (error) {
    return null;
  }
};

/**
 * Clears the inactivity timer
 */
const clearInactivityTimer = (): void => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
};

/**
 * Sets up the inactivity timer
 */
const setupInactivityTimer = (): void => {
  clearInactivityTimer();

  inactivityTimer = setTimeout(() => {
    console.log("User inactive for 1 hour, logging out...");
    logout();
  }, INACTIVITY_TIMEOUT);
};

/**
 * Handles user activity - updates timestamp and resets timer
 */
const handleUserActivity = (): void => {
  if (isAuthenticated()) {
    updateLastActivity();
    setupInactivityTimer();
  }
};

/**
 * Checks if the user session has expired due to inactivity
 * @returns boolean indicating if session is expired
 */
export const isSessionExpired = (): boolean => {
  const lastActivity = getLastActivity();
  if (!lastActivity) return false;

  const timeSinceLastActivity = Date.now() - lastActivity;
  return timeSinceLastActivity > INACTIVITY_TIMEOUT;
};

/**
 * Initializes activity tracking for authenticated users
 * Should be called when the app starts or user logs in
 */
export const initializeActivityTracking = (): void => {
  if (!isAuthenticated()) return;

  // Check if session has expired
  if (isSessionExpired()) {
    logout();
    return;
  }

  // Update activity timestamp
  updateLastActivity();
  setupInactivityTimer();

  // Activity events to track
  const activityEvents = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];

  // Add event listeners for user activity
  activityEvents.forEach((event) => {
    document.addEventListener(event, handleUserActivity, true);
  });
};

/**
 * Stops activity tracking and clears timers
 * Should be called when user logs out or app unmounts
 */
export const stopActivityTracking = (): void => {
  clearInactivityTimer();

  const activityEvents = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];

  // Remove event listeners
  activityEvents.forEach((event) => {
    document.removeEventListener(event, handleUserActivity, true);
  });
};

/**
 * Adds a callback to be executed when user is logged out due to inactivity
 * @param callback Function to call on logout
 */
export const onActivityLogout = (callback: () => void): void => {
  activityListeners.push(callback);
};

/**
 * Removes a callback from the activity logout listeners
 * @param callback Function to remove
 */
export const removeActivityLogout = (callback: () => void): void => {
  const index = activityListeners.indexOf(callback);
  if (index > -1) {
    activityListeners.splice(index, 1);
  }
};

/**
 * Get user's name from stored data
 * @returns User's name or 'User' as fallback
 */
export const getUserName = (): string => {
  try {
    const userData = getUserData();
    return userData?.name || userData?.username || "User";
  } catch (error) {
    console.error("Error getting user name:", error);
    return "User";
  }
};

/**
 * Get user's email from stored data
 * @returns User's email or null
 */
export const getUserEmail = (): string | null => {
  try {
    const userData = getUserData();
    return userData?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};
