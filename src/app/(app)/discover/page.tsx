import { fetchDiscover, TrendingItem } from "@/lib/tmdb"
import { SectionCard } from "@/components/ContentSection/SectionCard"
import { notFound } from "next/navigation"

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
      page: Number(searchParams.page) || 1,
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
        <section className="md:mt-6 flex flex-col gap-6">

          {allResults.length === 0 ? (
            <p className="text-primary">No results found</p>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allResults.map((item) => (
              <SectionCard key={item.id} item={item} />
            ))}
          </div>
          )}
        </section>
    )
}