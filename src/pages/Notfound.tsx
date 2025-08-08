import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export const Notfound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <div className="relative -mt-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>

        {/* Illustration/Icon */}
        <div className="mb-8">
          <div className="mx-auto w-64 h-64 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-24 h-24 text-muted-foreground" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Here are some useful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-primary hover:underline">
              Home
            </Link>
            <Link to="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
