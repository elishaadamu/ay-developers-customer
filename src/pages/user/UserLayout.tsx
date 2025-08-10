import { Sidebar } from "./components/Sidebar";
import { UserNavbar } from "./components/Navbar";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col md:ml-[220px] lg:ml-[280px]">
        <UserNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pt-16 md:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
