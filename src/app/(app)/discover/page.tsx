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
    genres?: string;
    rating_gte?: string;
    rating_lte?: string;
    mediaType?: string;
    page?: string;
  }>;
}

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const params = await searchParams;
  const mediaType = params.mediaType
    ? params.mediaType.split(",").filter(Boolean)
    : ["movie"];
  const commonOpts = {
    with_genres: params.genres?.split(",").map(Number).filter(Boolean),
    "vote_average.gte": Number(params.rating_gte) || 0,
    "vote_average.lte": Number(params.rating_lte) || 10,
  };

  let allResults: TrendingItem[] = [];

  try {
    const results = await Promise.all(
      mediaType.map(async (mt) => {
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
