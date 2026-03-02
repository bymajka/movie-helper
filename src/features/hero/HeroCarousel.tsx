"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/components/carousel";
import { useEffect, useMemo, useState } from "react";
import { useTrending, useAllGenres } from "@/services/media";
import { CarouselCard } from "./CarouselCard";
import { Skeleton } from "@/shared/components/skeleton";

export const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selected, setSelected] = useState(0);

  const { items, loading: trendingLoading, error: trendingError } = useTrending(
    {
      mediaType: "all",
      timeWindow: "week",
    },
    4,
  );

  const { maps, loading: genresLoading, error: genresError } = useAllGenres("en-US");

  const loading = trendingLoading || genresLoading;
  const error = trendingError || genresError;

  const slides = useMemo(
    () =>
      items
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .map((item) => {
          const genreMap = item.media_type === "movie" ? maps.movie : maps.tv;
          return (
            <CarouselItem key={`${item.media_type}-${item.id}`} className="relative">
              <CarouselCard item={item} genreMap={genreMap} />
            </CarouselItem>
          );
        }),
    [items, maps],
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const iv = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(iv);
  }, [api]);

  if (loading)
    return (
      <div>
        <Skeleton className="w-full md:mt-6 md:h-[560px] rounded-2xl bg-card" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative rounded-2xl overflow-hidden md:mt-6">
      <Carousel
        setApi={setApi}
        className="w-full md:h-[560px]"
        opts={{ loop: true, align: "start" }}
      >
        <CarouselContent className="md:h-[560px]">{slides}</CarouselContent>
      </Carousel>

      {/* custom "pill" dots */}
      <div className="absolute bottom-12 right-12 flex gap-2">
        {api?.scrollSnapList().map((_, idx) => {
          const isActive = idx === selected;
          return (
            <button
              key={idx}
              onClick={() => {
                api.scrollTo(idx);
              }}
              className={`
                transition-all rounded-full cursor-pointer
                ${isActive ? "bg-white w-[50px] h-1" : "bg-white/30 w-[43px] h-1 opacity-[0.8]"}
              `}
            />
          );
        })}
      </div>
    </div>
  );
};
