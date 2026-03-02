import { notFound } from "next/navigation";
import { SearchView } from "@/views";
import { fetchSearchMulti, type SearchResponse } from "@/services/search";
import type { TrendingItem } from "@/services/media";

interface SearchPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.query?.trim();

  if (!q) {
    return <div>No search query provided</div>;
  }

  let data: SearchResponse;
  try {
    data = await fetchSearchMulti({ query: q, page: Number(params.page) || 1 });
  } catch {
    return notFound();
  }

  const results = data.results as TrendingItem[];

  return <SearchView query={q} initialItems={results} />;
}
