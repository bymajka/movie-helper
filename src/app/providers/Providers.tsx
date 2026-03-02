'use client';

import { ThemeProvider } from "./ThemeProvider";
import { GuestSessionProvider } from "./GuestSessionProvider";
import { AuthProvider } from "./AuthProvider";

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
        </ThemeProvider>
      </AuthProvider>
    </GuestSessionProvider>
  );
};
