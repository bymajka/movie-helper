"use client";

import { useTrending, useMovieGenres } from "@/services/media";
import { ContentSection } from "@/shared/components/ContentSection";
import { SectionCard } from "@/shared/components/SectionCard";
import { Skeleton } from "@/shared/components/skeleton";
import { useResponsiveColumns } from "@/shared/components/VirtualGrid";
import Link from "next/link";
import { useMemo, useRef } from "react";

const MIN_CARD_WIDTH = 300;
const GAP = 16;
const DEFAULT_COLUMNS = 3;

export const TrendingSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columns = useResponsiveColumns(containerRef, {
    minColumnWidth: MIN_CARD_WIDTH,
    gap: GAP,
  });

  const limit = columns ?? DEFAULT_COLUMNS;
  const {
    items,
    loading: trendingLoading,
    error: trendingError,
  } = useTrending(
    {
      mediaType: "all",
      timeWindow: "week",
    },
    limit,
  );

  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useMovieGenres();

  const loading = trendingLoading || genresLoading || columns === null;
  const error = trendingError || genresError;

  const getGenreName = useMemo(() => {
    return (genreIds?: number[]) => {
      if (!genreIds || !genres.length) return undefined;
      return genres.find((g) => genreIds.includes(g.id))?.name;
    };
  }, [genres]);

  if (loading)
    return (
      <div ref={containerRef}>
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="md:h-8 md:w-[150px] rounded-2xl bg-card" />
          <Skeleton className="md:h-10 md:w-[85px] rounded-full bg-card" />
        </div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${limit}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: limit }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full aspect-[5/4] rounded-2xl bg-card"
            />
          ))}
        </div>
      </div>
    );
  if (error) return <div ref={containerRef}>Error: {error}</div>;

  return (
    <div ref={containerRef}>
      <ContentSection title="Trending now">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => (
            <Link
              href={`/${item.media_type}/${item.id}`}
              key={`${item.id}-${item.title || item.name}`}
            >
              <SectionCard
                title={item.title || item.name || ""}
                overview={item.overview || ""}
                backdropPath={item.backdrop_path}
                rating={item.vote_average}
                genre={getGenreName(item.genre_ids)}
              />
            </Link>
          ))}
        </div>
      </ContentSection>
    </div>
  );
};
