import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { useNavigate } from "react-router-dom";
import { logout, stopActivityTracking } from "@/utils/auth";
import { getEncryptedStorage } from "@/utils/encryption";
import { message } from "antd";
import { useState, useEffect } from "react";

export function UserNavbar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  // Load user data on component mount
  useEffect(() => {
    try {
      const loadedUserData = getEncryptedStorage("userData");
      if (loadedUserData) {
        setUserData(loadedUserData);
      }
    } catch (error) {
      console.error("Error loading user data in navbar:", error);
    }
  }, []);

  // Handle logout
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

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate("/user/profile");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    } else if (userData?.name) {
      return userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  // Get user name for display
  const getUserName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData?.name) {
      return userData.name;
    }
    return "User";
  };

  return (
    <header className="flex h-14 items-center p-10 gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* Search */}
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders, tickets..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4 text-black dark:text-white" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-muted-foreground">
                  Order #12345 has been placed
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Ticket updated</p>
                <p className="text-xs text-muted-foreground">
                  Support ticket #456 has a new reply
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Product launched</p>
                <p className="text-xs text-muted-foreground">
                  New AI tool is now available
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <span className="text-black dark:text-white border-1">
          <ModeToggle />
        </span>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full ">
              <Avatar className="h-8 w-8 ">
                <AvatarImage
                  src={
                    userData?.avatar ||
                    userData?.profile_picture ||
                    "https://github.com/shadcn.png"
                  }
                  alt={getUserName()}
                />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getUserName()}</p>
                <p className="text-xs text-muted-foreground">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={handleSettingsClick}
              className="cursor-pointer"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
