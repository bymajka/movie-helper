import { redirect, notFound } from "next/navigation";
import { SearchView } from "@/views";
import { fetchSearchMulti, type SearchResult } from "@/services/search";
import type { TrendingItem } from "@/services/media";

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
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
  const q = params.query?.trim();

  if (!q) {
    redirect("/discover?rating_gte=1&rating_lte=10");
  }

  let data;
  try {
    data = await fetchSearchMulti({ query: q, page: Number(params.page) || 1 });
  } catch (err) {
    console.error("Search fetch failed:", err);
    return notFound();
  }

  const results = data.results.map(mapSearchResultToTrendingItem);

  return <SearchView query={q} initialItems={results} />;
}
