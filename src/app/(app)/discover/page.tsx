import { notFound } from "next/navigation";
import { DiscoverView } from "@/views";
import { fetchDiscoverMovies, fetchDiscoverTv, type TrendingItem } from "@/services/media";

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
        with_genres: searchParams.genres?.split(',').map(Number).filter(Boolean),
        'vote_average.gte': Number(searchParams.rating_gte) || 0,
        'vote_average.lte': Number(searchParams.rating_lte) || 10,
    }

    let allResults: TrendingItem[] = [];

    try {
        const results = await Promise.all(
            mediaType.map(async (mt) => {
                return mt === 'movie'
                    ? fetchDiscoverMovies(commonOpts)
                    : fetchDiscoverTv(commonOpts);
            })
        );
        allResults = results.flat() as TrendingItem[];
    } catch {
        return notFound();
    }

    return <DiscoverView initialItems={allResults} />;
}
