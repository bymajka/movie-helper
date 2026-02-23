import { notFound } from "next/navigation";
import { SearchView } from "@/views";
import { fetchSearchMulti, type SearchResponse } from "@/services/search";
import type { TrendingItem } from "@/services/media";

interface SearchPageProps {
    searchParams: { query?: string; page?: string; }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const q = searchParams.query?.trim();
    if (!q) {
        return <div>No search query provided</div>;
    }

    let data: SearchResponse;
    try {
        data = await fetchSearchMulti({ query: q, page: Number(searchParams.page) || 1 });
    } catch {
        return notFound();
    }

    const results = data.results as TrendingItem[];

    return <SearchView query={q} initialItems={results} />;
}
