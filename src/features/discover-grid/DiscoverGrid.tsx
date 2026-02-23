"use client";

import { useMemo } from "react";
import Link from "next/link";
import { fetchDiscoverMovies, fetchDiscoverTv, useMovieGenres, type TrendingItem } from "@/services/media";
import { useFilterStore } from "@/stores/filterStore";
import { VirtualGrid } from "@/shared/components/VirtualGrid";
import { SectionCard } from "@/shared/components/SectionCard";

interface DiscoverGridProps {
    initialItems: TrendingItem[];
}

export const DiscoverGrid = ({ initialItems }: DiscoverGridProps) => {
    const { selectedMediaTypes, selectedGenres, rating_gte, rating_lte } = useFilterStore();
    const { genres } = useMovieGenres();

    const getGenreName = useMemo(() => {
        return (genreIds?: number[]) => {
            if (!genreIds || !genres.length) return undefined;
            return genres.find((g) => genreIds.includes(g.id))?.name;
        };
    }, [genres]);

    const commonOpts = useMemo(
        () => ({
            with_genres: Array.from(selectedGenres).map(g => g.id),
            "vote_average.gte": rating_gte,
            "vote_average.lte": rating_lte,
        }),
        [selectedGenres, rating_gte, rating_lte]
    );

    const mediaTypes = useMemo(
        () => {
            const types = Array.from(selectedMediaTypes).map(mt => mt.value) as Array<"movie" | "tv">;
            return types.length > 0 ? types : ["movie" as const];
        },
        [selectedMediaTypes]
    );

    const fetchData = useMemo(
        () => async (page: number) => {
            const results = await Promise.all(
                mediaTypes.map((mt) => {
                    const opts = { page, ...commonOpts };
                    return mt === 'movie'
                        ? fetchDiscoverMovies(opts)
                        : fetchDiscoverTv(opts);
                })
            );
            return results.flat() as TrendingItem[];
        },
        [mediaTypes, commonOpts]
    );

    return (
        <VirtualGrid
            initialItems={initialItems}
            fetchData={fetchData}
            dependencies={[mediaTypes, commonOpts]}
            renderItem={(item) => (
                <Link href={`/${item.media_type}/${item.id}`}>
                    <SectionCard
                        title={item.title || item.name || ""}
                        overview={item.overview || ""}
                        backdropPath={item.backdrop_path}
                        rating={item.vote_average}
                        genre={getGenreName(item.genre_ids)}
                    />
                </Link>
            )}
            getItemKey={(item) => item.id}
        />
    );
};
