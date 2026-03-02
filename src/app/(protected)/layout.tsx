"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuthStore } from "@/stores/userAuthStore";
import { AppShell } from "@/shared/components";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { sessionId, isLoading, hasHydrated } = useUserAuthStore();

  const isAuthenticated = !!sessionId;

  useEffect(() => {
    if (hasHydrated && !isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [hasHydrated, isLoading, isAuthenticated, router]);

  if (!hasHydrated || isLoading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Loading...</h1>
            <p className="mt-2 text-muted-foreground">Please wait</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Redirecting...</h1>
            <p className="mt-2 text-muted-foreground">
              You need to be logged in to view this page
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
