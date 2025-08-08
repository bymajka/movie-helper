import "../globals.css";
import { TopNavBar } from "@/components/Header/TopNavBar";
import { FilterPanel } from "@/components/Sidebar/FilterPanel";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen flex antialiased md:py-6 md:px-10`}>
        <FilterPanel className="h-min"/>
        <div className="flex-1 flex flex-col md:ml-6 w-full">
          <TopNavBar />
          <main className="flex-1 overflow-y-auto flex flex-col gap-8">
            {children}
          </main>
        </div>
    </div>
  );
}
