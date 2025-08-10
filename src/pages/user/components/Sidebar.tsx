import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  ShoppingBag,
  Ticket,
  User,
  Menu,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import LogoIcon from "@/assets/aydevelopers.png";
import { useNavigate } from "react-router-dom";
import { logout, stopActivityTracking } from "@/utils/auth";
import { message } from "antd";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    href: "/user/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/user/orders",
    icon: ShoppingBag,
  },
  {
    title: "Tickets",
    href: "/user/tickets",
    icon: Ticket,
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
  },
  // {
  //   title: "Settings",
  //   href: "/user/settings",
  //   icon: Settings,
  // },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

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

  // Handle support click
  const handleSupportClick = () => {
    navigate("/user/support");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b p-10 lg:h-[60px] lg:px-6 flex-shrink-0">
        <Link
          to="/user/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <img
            src={LogoIcon}
            alt="AY Creative"
            className="h-full w-[80%] dark:invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 mt-5 min-h-0 overflow-y-auto">
        <nav className="grid items-start gap-3 text-[15px] px-2  font-medium lg:px-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                  isActive && "bg-muted text-primary font-medium"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full justify-center gap-2 dark:text-white text-slate-900"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 flex-shrink-0 border-t bg-background space-y-3">
        {/* Support Section */}
        <div className="rounded-lg bg-muted p-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4 dark:text-white" />
            <span className="text-muted-foreground dark:text-white">
              {" "}
              Need Help?
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Contact our support team
          </p>
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={handleSupportClick}
          >
            Get Support
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden border-r bg-background md:block fixed left-0 top-0 h-screen w-[220px] lg:w-[280px] z-40",
          className
        )}
      >
        <div className="flex h-full max-h-screen flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden fixed top-3 left-3 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
