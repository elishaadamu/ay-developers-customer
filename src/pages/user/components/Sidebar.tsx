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
} from "lucide-react";
import LogoIcon from "@/assets/aydevelopers.png";
import { LogoutButton } from "@/components/LogoutButton";

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
    title: "Analytics",
    href: "/user/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/user/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 flex-shrink-0">
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
      <div className="flex-1 mt-5 min-h-0">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 h-full">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 flex-shrink-0 border-t bg-background space-y-3">
        {/* Logout Button */}
        <LogoutButton variant="outline" className="w-full" />

        {/* Support Section */}
        <div className="rounded-lg bg-muted p-3">
          <h3 className="text-sm font-medium">Need Help?</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Contact our support team
          </p>
          <Button size="sm" className="w-full mt-2">
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
          "hidden border-r bg-muted/40 md:block fixed left-0 top-0 h-screen w-[220px] lg:w-[280px]",
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
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
