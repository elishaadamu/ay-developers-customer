import LogoIcon from "@/assets/aydevelopers.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
        <div className="col-span-1 md:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center"
          >
            <Link to="/" className="ml-2 font-bold text-xl flex items-center">
              <img
                src={LogoIcon}
                alt="AY Developers Logo"
                className="h-full w-[200px] mr-2 dark:invert"
              />
            </Link>
          </a>
          <p className="text-muted-foreground mt-2">
            Pioneering possibilities through innovative technology solutions.
          </p>
          <div className="mt-4">
            <a
              href="mailto:support@aydevelopers.com.ng"
              className="text-primary hover:underline"
            >
              support@aydevelopers.com.ng
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Quick Links
          </h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="/"
              className="text-slate-700 dark:text-slate-300 opacity-60 hover:opacity-100 hover:text-primary dark:hover:text-primary"
            >
              Home
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="/signin"
              className="text-slate-700 dark:text-slate-300 opacity-60 hover:opacity-100 hover:text-primary dark:hover:text-primary"
            >
              Sign In
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="/signup"
              className="text-slate-700 dark:text-slate-300 opacity-60 hover:opacity-100 hover:text-primary dark:hover:text-primary"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3 className="text-slate-900 dark:text-white">
          &copy; {new Date().getFullYear()} AY CREATIVE TECHNOLOGY. All rights
          reserved.{" "}
          <a
            rel="noreferrer noopener"
            href="mailto:support@aydevelopers.com.ng"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact Support
          </a>
        </h3>
      </section>
    </footer>
  );
};
