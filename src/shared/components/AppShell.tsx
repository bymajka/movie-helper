"use client";

import { TopNavBar } from "@/shared/components";
import { FilterPanel } from "@/features/filters";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex antialiased md:py-6 md:px-10">
      <FilterPanel className="h-min" />
      <div className="flex-1 min-w-0 flex flex-col md:ml-6">
        <TopNavBar />
        <main className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
