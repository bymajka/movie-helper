import { ContentSection } from "@/components/ContentSection/ContentSection";
import { fetchSearchMulti, TrendingItem } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { SearchVirtualGrid } from "@/components/Search/SearchVirtualGrid";

interface SearchPageProps {
    searchParams: {query?: string; page?: string;}
}

export const SearchPage = async ({searchParams}: SearchPageProps) => {
    const q = searchParams.query?.trim();
    if(!q) {
        return <div>No found</div>
    }

    let data: { results: TrendingItem[] }
    try {
        data = await fetchSearchMulti({query: q, page: Number(searchParams.page) || 1})
    } catch {
        notFound();
    }

    const results = data.results

    if(results.length === 0) {
        return <div className="text-primary text-2xl font-semibold flex items-center justify-center h-full">
            No results found 
        </div>
    }

    return (
        <ContentSection title={`Search results for “${q}”`} className="mt-6" withButton={false}>
            <SearchVirtualGrid initialItems={results} query={q} />
        </ContentSection>
    )
}

export default SearchPage;