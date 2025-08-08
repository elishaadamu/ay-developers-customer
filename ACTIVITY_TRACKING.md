# Activity Tracking & Auto-Logout Documentation

## Overview

The application now includes automatic user logout after 1 hour of inactivity. This feature tracks user interactions and maintains an encrypted timestamp of the last activity.

## Features

- **Automatic logout after 1 hour of inactivity**
- **Activity tracking** (mouse movements, clicks, keyboard input, scrolling, touch events)
- **Session expiration checking** on app initialization
- **Encrypted activity timestamps** stored in localStorage
- **React hook for easy integration**
- **Logout notifications** with user-friendly messages

## Files Created/Modified

### Core Files:

- `src/utils/auth.ts` - Enhanced with activity tracking functions
- `src/utils/encryption.ts` - Stores activity timestamps encrypted
- `src/hooks/useActivityTracking.ts` - React hook for activity management
- `src/components/LogoutButton.tsx` - Reusable logout component
- `src/App.tsx` - App-wide activity tracking initialization
- `src/pages/SignIn.tsx` - Starts tracking after login
- `src/pages/SignUp.tsx` - Starts tracking after registration

## How It Works

### 1. Activity Detection

The system monitors these user interactions:

- Mouse movements and clicks
- Keyboard input
- Scrolling
- Touch events (mobile)

### 2. Timer Management

- Sets a 1-hour timer on user login/registration
- Resets the timer on any detected activity
- Automatically logs out when timer expires

### 3. Session Persistence

- Stores encrypted activity timestamps in localStorage
- Checks for expired sessions on app initialization
- Cleans up expired sessions automatically

## Usage Examples

### Basic Usage (Automatic)

The activity tracking is automatically initialized in `App.tsx`, so no additional setup is required.

### Manual Control

```typescript
import {
  initializeActivityTracking,
  stopActivityTracking,
  isSessionExpired,
  logout,
} from "@/utils/auth";

// Start tracking (done automatically after login)
initializeActivityTracking();

// Stop tracking (done automatically on logout)
stopActivityTracking();

// Check if session is expired
if (isSessionExpired()) {
  logout();
}
```

### Using the React Hook

```typescript
import { useActivityTracking } from "@/hooks/useActivityTracking";

function MyComponent() {
  const { startTracking, stopTracking } = useActivityTracking();

  // Hook automatically handles initialization and cleanup
  // Manual control available if needed:
  // startTracking(); // Start tracking manually
  // stopTracking();  // Stop tracking manually
}
```

### Adding a Logout Button

```typescript
import { LogoutButton } from "@/components/LogoutButton";

function MyComponent() {
  return (
    <div>
      <LogoutButton variant="outline" className="ml-4" />
    </div>
  );
}
```

## Configuration

### Timeout Duration

To change the inactivity timeout (currently 1 hour):

```typescript
// In src/utils/auth.ts
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // Change this value
// Examples:
// 30 minutes: 30 * 60 * 1000
// 2 hours: 2 * 60 * 60 * 1000
// 15 minutes: 15 * 60 * 1000
```

### Activity Events

To modify which events trigger activity detection:

```typescript
// In src/utils/auth.ts - initializeActivityTracking function
const activityEvents = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
  // Add or remove events as needed
];
```

## Security Features

### Encrypted Storage

- Activity timestamps are encrypted using AES encryption
- Uses the same encryption key as user data
- Automatically cleans up corrupted timestamps

### Session Validation

- Validates session on app initialization
- Checks for expired sessions before starting tracking
- Gracefully handles missing or corrupted activity data

## Error Handling

The system includes comprehensive error handling:

- Gracefully handles encryption/decryption errors
- Automatically cleans up corrupted activity data
- Logs errors for debugging while maintaining user experience
- Fails safely (doesn't break app if tracking fails)

## Testing

To test the activity tracking:

1. **Short timeout for testing:**

   ```typescript
   const INACTIVITY_TIMEOUT = 10 * 1000; // 10 seconds for testing
   ```

2. **Manual session expiration:**

   ```typescript
   import { logout } from "@/utils/auth";
   logout(); // Manually trigger logout
   ```

3. **Check session status:**
   ```typescript
   import { isAuthenticated, isSessionExpired } from "@/utils/auth";
   console.log("Authenticated:", isAuthenticated());
   console.log("Session Expired:", isSessionExpired());
   ```

## Integration Notes

- The activity tracking is automatically initialized in `App.tsx`
- No additional setup required for new pages/components
- Activity tracking starts automatically after successful login/registration
- Tracking stops automatically on logout
- Works with the existing encrypted storage system
- Compatible with React Router navigation

## Troubleshooting

### Common Issues:

1. **Timer not resetting:**

   - Check console for errors
   - Verify event listeners are attached
   - Ensure user is authenticated

2. **Immediate logout:**

   - Check if session was already expired
   - Verify timestamp encryption/decryption

3. **No logout notification:**
   - Check if activity listeners are properly set up
   - Verify message component is available

### Debug Mode:

```typescript
// Add console logs in handleUserActivity function
const handleUserActivity = (): void => {
  console.log("Activity detected at:", new Date());
  if (isAuthenticated()) {
    updateLastActivity();
    setupInactivityTimer();
  }
};
```
