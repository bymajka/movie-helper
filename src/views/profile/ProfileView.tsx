"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useUserAuthStore } from "@/stores/userAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
} from "@/shared/components";
import { TMDB_BASE_IMG_URL_W500 } from "@/services/media";
import {
  FavoritesSection,
  WatchlistSection,
  ListsSection,
} from "@/features/profile";

type ProfileSection = "favorites" | "watchlist" | "lists";

const SECTION_TITLES: Record<ProfileSection, string> = {
  favorites: "My Favorites",
  watchlist: "My Watchlist",
  lists: "My Lists",
};

export function ProfileView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandedSection = searchParams.get("section") as ProfileSection | null;

  const { username, avatarPath, name, accountId, sessionId } =
    useUserAuthStore();

  const displayName = name || username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const avatarUrl = avatarPath
    ? `${TMDB_BASE_IMG_URL_W500}${avatarPath}`
    : null;

  const handleViewAll = (section: ProfileSection) => {
    router.push(`/profile?section=${section}`);
  };

  if (expandedSection) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Profile", href: "/profile" },
            { label: SECTION_TITLES[expandedSection], href: "#" },
          ]}
          className="md:mt-5 font-medium text-base"
        />

        {expandedSection === "favorites" && (
          <FavoritesSection
            accountId={accountId}
            sessionId={sessionId}
            expanded
          />
        )}

        {expandedSection === "watchlist" && (
          <WatchlistSection
            accountId={accountId}
            sessionId={sessionId}
            expanded
          />
        )}

        {expandedSection === "lists" && (
          <ListsSection
            accountId={accountId}
            sessionId={sessionId}
            expanded
          />
        )}
      </>
    );
  }

  return (
    <>
      <section className="bg-card md:mt-5 rounded-3xl p-8 flex flex-row gap-8 items-center">
        <Avatar className="w-28 h-28">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1.5">
          <span className="text-3xl font-bold">{username}</span>
        </div>
      </section>

      <FavoritesSection
        accountId={accountId}
        sessionId={sessionId}
        onViewAll={() => handleViewAll("favorites")}
      />
      <WatchlistSection
        accountId={accountId}
        sessionId={sessionId}
        onViewAll={() => handleViewAll("watchlist")}
      />
      <ListsSection
        accountId={accountId}
        sessionId={sessionId}
        onViewAll={() => handleViewAll("lists")}
      />
    </>
  );
}
