import { redirect, notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { SearchView } from "@/views";
import { fetchSearchMulti, type SearchResult } from "@/services/search";
import type { TrendingItem } from "@/services/media";

interface SearchPageProps {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}

function mapSearchResultToTrendingItem(result: SearchResult): TrendingItem {
  return {
    id: result.id,
    media_type: result.media_type,
    title: result.title,
    name: result.name,
    backdrop_path: result.backdrop_path ?? null,
    poster_path: result.poster_path ?? null,
    genre_ids: result.genre_ids ?? [],
    overview: result.overview ?? null,
    vote_average: result.vote_average ?? null,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const rawQuery = Array.isArray(params.query)
    ? params.query[0]
    : params.query;
  const q = rawQuery?.trim();

  if (!q) {
    redirect("/discover?rating_gte=1&rating_lte=10");
  }

  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number.parseInt(rawPage ?? "", 10);
  const page =
    Number.isNaN(parsedPage) || parsedPage <= 0 || !Number.isInteger(parsedPage)
      ? 1
      : parsedPage;

  let data;
  try {
    data = await fetchSearchMulti({ query: q, page });
  } catch (err) {
    console.error("Search fetch failed:", err);
    if (isAxiosError(err) && err.response?.status === 404) {
      return notFound();
    }
    throw err;
  }

  const results = data.results.map(mapSearchResultToTrendingItem);

  return <SearchView query={q} initialItems={results} />;
}
