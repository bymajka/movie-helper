"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/shared/components/button";
import { Home, Bell, LogIn, LogOut } from "lucide-react";
import { Search } from "@/features/search/Search";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/avatar";
import { Skeleton } from "@/shared/components/skeleton";
import Link from "next/link";
import { useUserAuthStore } from "@/stores/userAuthStore";
import { TMDB_BASE_IMG_URL_W500 } from "@/shared/lib/tmdb-client";

export const TopNavBar = () => {
  const [mounted, setMounted] = useState(false);
  const {
    username,
    name,
    avatarPath,
    isAuthenticated,
    login,
    logout,
    isLoading,
  } = useUserAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = name || username || "User";
  const avatarUrl = avatarPath
    ? `${TMDB_BASE_IMG_URL_W500}${avatarPath}`
    : null;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-14 w-full items-center gap-4">
      <Link href="/" passHref className="h-full">
        <Button
          variant="secondary"
          className="rounded-full bg-card h-full aspect-square cursor-pointer"
        >
          <Home size={24} className="text-primary" />
        </Button>
      </Link>
      <div className="flex-1 h-full">
        <Suspense fallback={<Skeleton className="w-full h-full rounded-full bg-card" />}>
          <Search
            placeholder="Search"
            className="w-full h-full border-none focus-visible:ring-0 placeholder:text-primary"
          />
        </Suspense>
      </div>

      <Button
        variant="secondary"
        className="rounded-full aspect-square h-full bg-card"
      >
        <Bell size={24} className="text-primary" />
      </Button>

      {!mounted ? (
        <Skeleton className="h-full w-24 rounded-full bg-card" />
      ) : isAuthenticated() ? (
        <>
          <Link href="/profile" passHref className="h-full">
            <Button
              variant="secondary"
              className="rounded-full h-full w-auto px-1 pr-4 flex items-center gap-2.5 bg-card cursor-pointer"
            >
              <Avatar className="w-12 h-12">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{displayName}</span>
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="rounded-full aspect-square h-full bg-card cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut size={24} className="text-primary" />
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          className="rounded-full h-full w-auto px-4 flex items-center gap-2 bg-card cursor-pointer"
          onClick={() => login()}
          disabled={isLoading}
        >
          <LogIn size={20} className="text-primary" />
          <span className="text-sm">{isLoading ? "Loading..." : "Login"}</span>
        </Button>
      )}
    </header>
  );
};
