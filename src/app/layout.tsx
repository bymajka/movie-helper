import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GuestSessionProvider } from "@/components/providers/GuestSessionProvider";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Helper",
  description: "Movie Helper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <GuestSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
              >
                {children}
            </ThemeProvider>
          </GuestSessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
