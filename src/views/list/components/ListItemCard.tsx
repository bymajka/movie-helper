"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Rating, FallbackCardImage } from "@/shared/components";
import { TMDB_BASE_IMG_URL_W500 } from "@/services/media";
import { ROUTES } from "@/shared/router";
import { extractYear } from "@/shared/utils";
import type { ListItem } from "@/services/account";

interface ListItemCardProps {
  item: ListItem;
  onRemove?: (itemId: number) => void;
  isRemoving?: boolean;
}

export function ListItemCard({
  item,
  onRemove,
  isRemoving,
}: ListItemCardProps) {
  const year = item.release_date ? extractYear(item.release_date) : null;

  return (
    <div className="group cursor-pointer relative">
      <Link href={ROUTES.MOVIE(item.id)}>
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card">
          {item.poster_path ? (
            <Image
              src={`${TMDB_BASE_IMG_URL_W500}${item.poster_path}`}
              alt={item.title}
              fill
              loading="lazy"
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FallbackCardImage />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <Rating rating={item.vote_average} />
              {year && <span className="text-white/80 text-xs">{year}</span>}
            </div>
            <h3 className="text-primary text-sm font-medium line-clamp-2">
              {item.title}
            </h3>
          </div>
        </div>
      </Link>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item.id);
          }}
          disabled={isRemoving}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-transparent cursor-pointer text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 disabled:opacity-50"
          aria-label="Remove from list"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
