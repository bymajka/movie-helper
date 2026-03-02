"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  Card,
  Badge,
  Button,
  Skeleton,
  CarouselApi,
  Rating,
  Breadcrumb,
} from "@/shared/components";
import { TrailerPlaceholder } from "./TrailerPlaceholder";
import { CastCarousel } from "@/views/movie/CastCarousel";
import { extractYear, formatRuntime } from "@/shared/utils";
import {
  useMovieDetails,
  type Credits,
  TMDB_BASE_IMG_URL,
} from "@/services/media";
import { useMovieAccountStates } from "@/services/account";
import { useUserAuthStore } from "@/stores/userAuthStore";

interface MovieViewProps {
  id: number;
}

export const MovieView = ({ id }: MovieViewProps) => {
  const { details, loading, error } = useMovieDetails(id);
  const { sessionId } = useUserAuthStore();
  const { data: accountStates } = useMovieAccountStates(id, sessionId);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi | null>(null);

  const getWriters = (credits?: Credits) => {
    if (!credits?.crew) return null;
    const writers = credits.crew.filter((member) => member.job === "Writer");
    return writers.map((writer) => writer.name);
  };

  const writers = useMemo(
    () => getWriters(details?.credits),
    [details?.credits],
  );

  if (loading) return <MovieViewLoading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="flex flex-col gap-5 min-w-0">
      <Breadcrumb
        className="md:mt-5 font-medium text-base"
        items={[
          { label: "Home", href: "/" },
          { label: details?.title || "", href: `/movie/${id}` },
        ]}
      />
      <Card className="p-6 rounded-3xl gap-5">
        <div>
          <h1 className="text-[32px] font-semibold">{details?.title}</h1>
          <div className="flex items-center gap-[3px]">
            <span className="text-muted-foreground font-medium">
              {extractYear(details?.release_date || "")} •{" "}
              {formatRuntime(details?.runtime || 0)} •
            </span>
            <Rating rating={details?.vote_average} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_2.4fr]">
          {/* Poster */}
          <div className="relative w-full aspect-[2/3] rounded-[20px] overflow-hidden">
            <Image
              src={`${TMDB_BASE_IMG_URL}${details?.poster_path}`}
              alt={details?.title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 36vw"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Video */}
          {isTrailerOpen ? (
            <div className="relative aspect-video rounded-[20px] overflow-hidden">
              {details?.videos?.results?.[0]?.key ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${details.videos.results[0].key}?playlist=${details.videos.results[0].key}&loop=1`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground">
                  No trailer available
                </div>
              )}
            </div>
          ) : (
            <TrailerPlaceholder
              backdropPath={details?.backdrop_path}
              movieId={id}
              initialFavorite={accountStates?.favorite ?? false}
              onPlay={() => setIsTrailerOpen(true)}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-[9px]">
            {details?.genres?.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="text-primary bg-white/10 py-2.5 px-3 rounded-[30px] text-xs"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
          <p className="text-primary text-sm font-light">{details?.overview}</p>
        </div>
        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-1">
            <span className="text-primary text-sm font-semibold">
              Director:
            </span>
            <span className="text-primary text-sm font-light">
              {
                details?.credits?.crew?.find(
                  (member) => member.job === "Director",
                )?.name
              }
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-primary text-sm font-semibold">
              {writers?.length && writers?.length > 1 ? "Writers:" : "Writer:"}
            </span>
            <span className="text-primary text-sm font-light">
              {writers?.length ? writers?.join(", ") : "Unknown"}
            </span>
          </div>
        </div>
      </Card>
      <section
        aria-label="Cast"
        className="flex flex-col gap-4 min-w-0 overflow-hidden flex-shrink-0"
      >
        <div className="flex flex-row justify-between">
          <h2 className="text-primary text-2xl font-semibold">Cast</h2>
          <div className="flex flex-row gap-2">
            <Button
              disabled={!api?.canScrollPrev}
              variant="secondary"
              className="cursor-pointer rounded-full bg-card aspect-square"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              disabled={!api?.canScrollNext}
              variant="secondary"
              className="cursor-pointer rounded-full bg-card aspect-square"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CastCarousel items={details?.credits?.cast || []} setApi={setApi} />
      </section>
    </section>
  );
};

const MovieViewLoading = () => {
  return (
    <section className="flex flex-col gap-5 min-w-0">
      <div className="md:mt-5">
        <Skeleton className="bg-card h-4 w-40" />
      </div>

      <Card className="p-6 rounded-3xl gap-5">
        <Skeleton className="bg-background h-8 w-72" />

        <div className="flex items-center gap-2">
          <Skeleton className="bg-background h-4 w-56" />
          <Skeleton className="bg-background h-4 w-14 rounded-full" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_2.4fr]">
          <div className="relative w-full aspect-[2/3] rounded-[20px] overflow-hidden">
            <Skeleton className="bg-background absolute inset-0" />
          </div>
          <div className="relative aspect-video rounded-[20px] overflow-hidden">
            <Skeleton className="bg-background absolute inset-0" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="bg-background h-6 w-20 rounded-full" />
            <Skeleton className="bg-background h-6 w-24 rounded-full" />
            <Skeleton className="bg-background h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="bg-background h-4 w-full" />
            <Skeleton className="bg-background h-4 w-5/6" />
            <Skeleton className="bg-background h-4 w-2/3" />
          </div>
        </div>

        <div className="flex flex-row gap-10">
          <div className="space-y-1">
            <Skeleton className="bg-card h-4 w-16" />
            <Skeleton className="bg-card h-4 w-28" />
          </div>
          <div className="space-y-1">
            <Skeleton className="bg-card h-4 w-16" />
            <Skeleton className="bg-card h-4 w-40" />
          </div>
        </div>
      </Card>

      <section
        aria-label="Cast"
        className="flex flex-col gap-4 min-w-0 overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="bg-card h-6 w-28" />
          <div className="flex gap-2">
            <Skeleton className="bg-card h-10 w-10 rounded-full" />
            <Skeleton className="bg-card h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-card"
            >
              <div className="relative h-2/3">
                <Skeleton className="bg-card absolute inset-0" />
              </div>
              <div className="h-1/3 p-3 space-y-2">
                <Skeleton className="bg-card h-4 w-3/4" />
                <Skeleton className="bg-card h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
