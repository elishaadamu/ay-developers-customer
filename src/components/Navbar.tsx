import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import LogoIcon from "@/assets/aydevelopers.png";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#home",
    label: "Home",
  },
  {
    href: "#about",
    label: "About",
  },
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#services",
    label: "Services",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link to="/" className="ml-2 font-bold text-xl flex items-center">
              <img
                src={LogoIcon}
                alt="AY Developers Logo"
                className="h-full w-[180px] md:w-[150px] mr-2 dark:invert"
              />
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5 text-slate-900 dark:text-white"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl text-slate-900 dark:text-white">
                    AY Developers
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4 ">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`${buttonVariants({
                        variant: "outline",
                      })} text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                      {label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-2 mt-4 ">
                    <Link
                      to="/signin"
                      onClick={() => setIsOpen(false)}
                      className={`${buttonVariants({
                        variant: "outline",
                      })} text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "default" })}
                    >
                      Sign Up
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary ${buttonVariants(
                  {
                    variant: "ghost",
                  }
                )}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Link
              to="/signin"
              className={`${buttonVariants({
                variant: "outline",
              })} text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={buttonVariants({ variant: "default" })}
            >
              Sign Up
            </Link>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
