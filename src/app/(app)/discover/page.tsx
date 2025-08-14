import { fetchDiscover, TrendingItem } from "@/lib/tmdb"
import { notFound } from "next/navigation"
import { FiltersBar } from "@/components/FilterSection/FiltersBar"
import { DiscoverVirtualGrid } from "@/components/Discover/DiscoverVirtualGrid"
import { ContentSection } from "@/components/ContentSection/ContentSection"

interface DiscoverPageProps {
    searchParams: {
        genres?: string
        rating_gte?: string
        rating_lte?: string
        mediaType?: string;
        page?: string
      }
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
    const mediaType = searchParams.mediaType ? searchParams.mediaType.split(',').filter(Boolean) : ['movie'];
    const commonOpts = {
      with_genres:      searchParams.genres?.split(',').map(Number).filter(Boolean),
      'vote_average.gte': Number(searchParams.rating_gte) || 0,
      'vote_average.lte': Number(searchParams.rating_lte) || 10,
    }

    let allResults: TrendingItem[] = [];

    try {
      const results = await Promise.all(
        mediaType.map(async (mt) => {
          return fetchDiscover({
            mediaType: mt as 'movie' | 'tv',
            ...commonOpts,
          });
        })
      );
      allResults = results.flat();
    } catch {
      return notFound();
    }

    return (
        <ContentSection  className="flex flex-col gap-6 flex-1" withButton={false}>
          <FiltersBar />
          {allResults.length === 0 ? (
              <div className="flex-1 text-primary text-2xl font-semibold flex items-center justify-center h-full">
                  No results found 
              </div>
          ) : (
              <DiscoverVirtualGrid initialItems={allResults} />
          )}
        </ContentSection>
    )
}