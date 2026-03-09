"use client";

import { useState } from "react";
import { useFavoriteMovies, useFavoriteTv } from "@/services/account";
import { MediaGrid } from "../MediaGrid";
import { MediaTypeSwitch, type MediaType } from "../MediaTypeSwitch";

interface FavoritesSectionProps {
  accountId: number | null;
  sessionId: string | null;
  expanded?: boolean;
  onViewAll?: () => void;
}

export function FavoritesSection({
  accountId,
  sessionId,
  expanded,
  onViewAll,
}: FavoritesSectionProps) {
  const [mediaType, setMediaType] = useState<MediaType>("movies");

  const { data: moviesData, loading: moviesLoading } = useFavoriteMovies(
    accountId,
    sessionId,
  );
  const { data: tvData, loading: tvLoading } = useFavoriteTv(
    accountId,
    sessionId,
  );

  const isMovies = mediaType === "movies";
  const items = isMovies ? moviesData?.results : tvData?.results;
  const loading = isMovies ? moviesLoading : tvLoading;
  const emptyMessage = isMovies
    ? "No favorite movies yet."
    : "No favorite series yet.";

  return (
    <MediaGrid
      title="My Favorites"
      items={items}
      loading={loading}
      emptyMessage={emptyMessage}
      expanded={expanded}
      onViewAll={onViewAll}
      headerExtra={
        <MediaTypeSwitch value={mediaType} onChange={setMediaType} />
      }
    />
  );
}
