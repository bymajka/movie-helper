"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuthStore } from "@/stores/userAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { sessionId, isLoading, hasHydrated } = useUserAuthStore();

  useEffect(() => {
    if (hasHydrated && !isLoading && !sessionId) {
      router.replace("/");
    }
  }, [sessionId, isLoading, hasHydrated, router]);

  if (!hasHydrated || isLoading) {
    return null;
  }

  if (!sessionId) {
    return null;
  }

  return <>{children}</>;
}
