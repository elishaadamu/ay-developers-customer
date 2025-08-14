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
import { AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { message } from "antd";

// Types for API requests and responses
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [payload, setPayload] = useState<RegisterRequest | null>(null);
  const [shouldRegister, setShouldRegister] = useState(false);
  const navigate = useNavigate();

  // Create payload from form data
  useEffect(() => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.password
    ) {
      setPayload({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    }
  }, [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.password,
  ]);

  // API call
  useEffect(() => {
    const registerUser = async () => {
      if (!shouldRegister || !payload) return;

      setIsLoading(true);
      console.log("SignUp Payload:", payload);

      try {
        const response = await axios.post(
          `${config.apiBaseUrl}${config.endpoints.register}`,
          payload,
          { withCredentials: true }
        );

        console.log("Registration response:", response.data);

        if (response.data.success) {
          if (response.data.data) {
            setEncryptedStorage("userData", response.data.data);
            initializeActivityTracking();
          }

          message.success("User created successfully");
          setAlert({
            type: "success",
            text: "User created successfully",
          });

          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          message.error(response.data.message || "Registration failed");
          setAlert({
            type: "error",
            text: response.data.message || "Registration failed",
          });
        }
      } catch (error: any) {
        console.error("Registration error:", error);
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        message.error(errorMessage);
        setAlert({ type: "error", text: errorMessage });
      } finally {
        setIsLoading(false);
        setShouldRegister(false);
      }
    };

    registerUser();
  }, [shouldRegister, payload, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (alert) setAlert(null); // clear alert when typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const phoneRegex = /[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setAlert({ type: "error", text: "Please enter a valid phone number!" });
      message.error("Please enter a valid phone number!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "error", text: "Passwords don't match!" });
      message.error("Passwords don't match!");
      return;
    }

    if (!payload) {
      setAlert({
        type: "error",
        text: "Form data is not ready. Please try again.",
      });
      message.error("Form data is not ready. Please try again.");
      return;
    }

    setShouldRegister(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && (
            <div
              className={`mb-4 p-3 rounded-md border flex items-center gap-2 ${
                alert.type === "error"
                  ? "bg-destructive/15 border-destructive/20"
                  : "bg-emerald-500/15 border-emerald-500/20"
              }`}
            >
              {alert.type === "error" ? (
                <AlertCircle
                  className={`h-4 w-4 ${
                    alert.type === "error"
                      ? "text-destructive"
                      : "text-green-700"
                  }`}
                />
              ) : (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              )}
              <span
                className={`text-sm ${
                  alert.type === "error"
                    ? "text-destructive"
                    : "text-emerald-500"
                }`}
              >
                {alert.text}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground "
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              loadingText="Creating account..."
            >
              Create Account
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
