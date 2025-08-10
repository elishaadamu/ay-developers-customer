import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { App as AntApp } from "antd";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Notfound } from "./pages/Notfound.tsx";
import { useActivityTracking } from "./hooks/useActivityTracking";
import "./App.css"; // Import global styles
import { UserLayout } from "./pages/user/UserLayout";
import { Dashboard } from "./pages/user/Dashboard";
import { Profile } from "./pages/user/Profile";
import { Products } from "./pages/user/Products";
import { Orders } from "./pages/user/Orders";
import { Tickets } from "./pages/user/Tickets";
import { Support } from "./pages/user/Support";

import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./components/theme-provider";

// Component that wraps the routes and provides activity tracking
function AppRoutes() {
  // Initialize activity tracking for the entire app
  useActivityTracking();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Notfound />} />

      {/* User Dashboard Routes */}
      <Route
        path="/user/home"
        element={<Navigate to="/user/dashboard" replace />}
      />
      <Route
        path="/user/dashboard"
        element={
          <UserLayout>
            <Dashboard />
          </UserLayout>
        }
      />
      <Route
        path="/user/profile"
        element={
          <UserLayout>
            <Profile />
          </UserLayout>
        }
      />
      <Route
        path="/user/products"
        element={
          <UserLayout>
            <Products />
          </UserLayout>
        }
      />
      <Route
        path="/user/orders"
        element={
          <UserLayout>
            <Orders />
          </UserLayout>
        }
      />
      <Route
        path="/user/tickets"
        element={
          <UserLayout>
            <Tickets />
          </UserLayout>
        }
      />
      <Route
        path="/user/support"
        element={
          <UserLayout>
            <Support />
          </UserLayout>
        }
      />
      <Route
        path="/user/settings"
        element={
          <UserLayout>
            <Tickets />
          </UserLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AntApp>
        <CartProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CartProvider>
      </AntApp>
    </ThemeProvider>
  );
}

export default App;
