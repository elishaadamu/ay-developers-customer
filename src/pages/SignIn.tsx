import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { config } from "@/utils/api";
import { setEncryptedStorage } from "@/utils/encryption";
import { initializeActivityTracking } from "@/utils/auth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { message } from "antd";

// Types for API requests
interface LoginRequest {
  email: string;
  password: string;
}

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [payload, setPayload] = useState<LoginRequest | null>(null);
  const [shouldLogin, setShouldLogin] = useState(false);
  const navigate = useNavigate();

  // useEffect to create payload when form is valid
  useEffect(() => {
    if (email && password) {
      const newPayload = {
        email,
        password,
      };
      setPayload(newPayload);
    }
  }, [email, password]);

  // Handle successful login and redirect
  const handleSuccessfulLogin = () => {
    // Check if there's a stored redirect URL
    const redirectUrl = sessionStorage.getItem("redirectUrl");
    if (redirectUrl) {
      sessionStorage.removeItem("redirectUrl"); // Clear the stored URL
      navigate(redirectUrl);
    } else {
      navigate("/user/dashboard"); // Default redirect
    }
  };

  // useEffect to handle API call when shouldLogin is true
  useEffect(() => {
    const loginUser = async () => {
      if (!shouldLogin || !payload) return;

      setIsLoading(true);
      console.log("SignIn Payload:", payload);

      try {
        const response = await axios.post(
          `${config.apiBaseUrl}${config.endpoints.login}`,
          payload,
          {
            withCredentials: true,
          }
        );

        console.log("Login response:", response.data);
        console.log("Login response type:", typeof response.data);
        console.log("Login response keys:", Object.keys(response.data || {}));

        if (response.data) {
          // Store user data in encrypted form if login is successful
          if (response.data) {
            console.log("About to store user data:", response.data);
            setEncryptedStorage("userData", response.data);
            console.log("User data stored successfully");
            // Initialize activity tracking after successful login
            initializeActivityTracking();
          }

          message.success("Welcome back! Login successful!");

          // Small delay before redirect to show the success message
          setTimeout(() => {
            handleSuccessfulLogin();
          }, 1500);
        } else {
          message.error(response.data.message || "Login failed");
          setError(response.data.message || "Login failed");
        }
      } catch (error: any) {
        console.error("Login error:", error);

        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        message.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setShouldLogin(false);
      }
    };

    loginUser();
  }, [shouldLogin, payload, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!payload) {
      const errorMsg = "Please enter both email and password.";
      setError(errorMsg);
      message.error(errorMsg);
      return;
    }

    // Trigger the API call
    setShouldLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <LoadingButton
              type="submit"
              className="w-full"
              loading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground ">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
