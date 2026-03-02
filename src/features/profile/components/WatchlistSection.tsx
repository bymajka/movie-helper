"use client";

import { useState } from "react";
import { useWatchlistMovies, useWatchlistTv } from "@/services/account";
import { MediaGrid } from "./MediaGrid";
import { MediaTypeSwitch, type MediaType } from "./MediaTypeSwitch";

interface WatchlistSectionProps {
  accountId: number | null;
  sessionId: string | null;
  expanded?: boolean;
  onViewAll?: () => void;
}

export function WatchlistSection({
  accountId,
  sessionId,
  expanded,
  onViewAll,
}: WatchlistSectionProps) {
  const [mediaType, setMediaType] = useState<MediaType>("movies");

  const { data: moviesData, loading: moviesLoading } = useWatchlistMovies(
    accountId,
    sessionId,
  );
  const { data: tvData, loading: tvLoading } = useWatchlistTv(
    accountId,
    sessionId,
  );

  const isMovies = mediaType === "movies";
  const items = isMovies ? moviesData?.results : tvData?.results;
  const loading = isMovies ? moviesLoading : tvLoading;
  const emptyMessage = isMovies
    ? "No movies in watchlist yet."
    : "No series in watchlist yet.";

  return (
    <MediaGrid
      title="My Watchlist"
      items={items}
      loading={loading}
      emptyMessage={emptyMessage}
      expanded={expanded}
      onViewAll={onViewAll}
      headerExtra={<MediaTypeSwitch value={mediaType} onChange={setMediaType} />}
    />
  );
}
