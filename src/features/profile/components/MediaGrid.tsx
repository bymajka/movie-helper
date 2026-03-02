"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ContentSection, PosterCard, Skeleton } from "@/shared/components";
import { getGridItemVisibilityClass } from "@/shared/utils";
import type { AccountMovieItem, AccountTvItem } from "@/services/account";

const MAX_ITEMS = 12;
const GRID_CLASS =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

type MediaItem = AccountMovieItem | AccountTvItem;

function isMovieItem(item: MediaItem): item is AccountMovieItem {
  return "title" in item;
}

function getMediaDetails(item: MediaItem) {
  if (isMovieItem(item)) {
    return {
      title: item.title,
      href: `/movie/${item.id}`,
      releaseDate: item.release_date,
    };
  }
  return {
    title: item.name,
    href: `/tv/${item.id}`,
    releaseDate: item.first_air_date,
  };
}

interface MediaGridProps {
  title: string;
  items: MediaItem[] | undefined;
  loading: boolean;
  emptyMessage: string;
  expanded?: boolean;
  onViewAll?: () => void;
  headerExtra?: ReactNode;
}

export function MediaGrid({
  title,
  items,
  loading,
  emptyMessage,
  expanded = false,
  onViewAll,
  headerExtra,
}: MediaGridProps) {
  if (loading) {
    return (
      <ContentSection title={title} withButton={!expanded} headerExtra={headerExtra}>
        <div className={GRID_CLASS}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[2/3] rounded-2xl bg-card" />
            </div>
          ))}
        </div>
      </ContentSection>
    );
  }

  if (!items?.length) {
    return (
      <ContentSection title={title} withButton={false} headerExtra={headerExtra}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </ContentSection>
    );
  }

  const displayedItems = expanded ? items : items.slice(0, MAX_ITEMS);

  return (
    <ContentSection
      title={title}
      withButton={!expanded}
      onViewAll={onViewAll}
      headerExtra={headerExtra}
    >
      <div className={GRID_CLASS}>
        {displayedItems.map((item, index) => {
          const { title, href, releaseDate } = getMediaDetails(item);
          return (
            <Link
              key={item.id}
              href={href}
              className={expanded ? "" : getGridItemVisibilityClass(index)}
            >
              <PosterCard
                title={title}
                posterPath={item.poster_path}
                rating={item.vote_average}
                releaseDate={releaseDate}
              />
            </Link>
          );
        })}
      </div>
    </ContentSection>
  );
}
