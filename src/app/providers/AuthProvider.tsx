'use client';

import { useEffect } from "react";
import { useUserAuthStore } from "@/stores/userAuthStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { sessionId, fetchAccount } = useUserAuthStore();

  useEffect(() => {
    if (sessionId) {
      fetchAccount();
    }
  }, [sessionId, fetchAccount]);

  return <>{children}</>;
};
