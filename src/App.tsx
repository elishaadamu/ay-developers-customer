import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Notfound } from "./pages/Notfound.tsx";
import { useActivityTracking } from "./hooks/useActivityTracking";
import "./App.css"; // Import global styles

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
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
