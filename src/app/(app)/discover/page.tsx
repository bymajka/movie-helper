import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { DiscoverView } from "@/views";
import {
  fetchDiscoverMovies,
  fetchDiscoverTv,
  type TrendingItem,
} from "@/services/media";

interface DiscoverPageProps {
  searchParams: Promise<{
    genres?: string | string[];
    rating_gte?: string | string[];
    rating_lte?: string | string[];
    mediaType?: string | string[];
    page?: string | string[];
  }>;
}

const VALID_MEDIA_TYPES = ["movie", "tv"] as const;

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const params = await searchParams;

  // Normalize array params to strings
  const rawMediaType = Array.isArray(params.mediaType)
    ? params.mediaType.join(",")
    : params.mediaType;
  const rawGenres = Array.isArray(params.genres)
    ? params.genres.join(",")
    : params.genres;
  const rawRatingGte = Array.isArray(params.rating_gte)
    ? params.rating_gte[0]
    : params.rating_gte;
  const rawRatingLte = Array.isArray(params.rating_lte)
    ? params.rating_lte[0]
    : params.rating_lte;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;

  const parsedPage = Number.parseInt(rawPage ?? "", 10);
  const page = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;

  const mediaTypes = rawMediaType
    ? rawMediaType
        .split(",")
        .filter((mt): mt is (typeof VALID_MEDIA_TYPES)[number] =>
          VALID_MEDIA_TYPES.includes(mt as (typeof VALID_MEDIA_TYPES)[number]),
        )
    : ["movie"];

  const validMediaTypes = mediaTypes.length > 0 ? mediaTypes : ["movie"];

  const commonOpts = {
    page,
    with_genres: rawGenres?.split(",").map(Number).filter(Boolean),
    "vote_average.gte": Number(rawRatingGte) || 0,
    "vote_average.lte": Number(rawRatingLte) || 10,
  };

  let allResults: TrendingItem[] = [];

  try {
    const results = await Promise.all(
      validMediaTypes.map(async (mt) => {
        return mt === "movie"
          ? fetchDiscoverMovies(commonOpts)
          : fetchDiscoverTv(commonOpts);
      }),
    );
    allResults = results.flat() as TrendingItem[];
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return notFound();
    }
    throw err;
  }

  return <DiscoverView initialItems={allResults} />;
}
