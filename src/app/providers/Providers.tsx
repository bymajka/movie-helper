'use client';

import { ThemeProvider } from "./ThemeProvider";
import { GuestSessionProvider } from "./GuestSessionProvider";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "@/shared/components";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <GuestSessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </GuestSessionProvider>
  );
};
