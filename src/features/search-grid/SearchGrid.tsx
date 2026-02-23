"use client";

import { useMemo } from "react";
import Link from "next/link";
import { fetchSearchMulti } from "@/services/search";
import { useMovieGenres, type TrendingItem } from "@/services/media";
import { VirtualGrid } from "@/shared/components/VirtualGrid";
import { SectionCard } from "@/shared/components/SectionCard";

interface SearchGridProps {
    initialItems: TrendingItem[];
    query: string;
}

export const SearchGrid = ({ initialItems, query }: SearchGridProps) => {
    const { genres } = useMovieGenres();

    const getGenreName = useMemo(() => {
        return (genreIds?: number[]) => {
            if (!genreIds || !genres.length) return undefined;
            return genres.find((g) => genreIds.includes(g.id))?.name;
        };
    }, [genres]);

    const fetchData = useMemo(
        () => async (page: number) => {
            const result = await fetchSearchMulti({
                query,
                page
            });
            return result.results as TrendingItem[];
        },
        [query]
    );

    return (
        <VirtualGrid
            initialItems={initialItems}
            fetchData={fetchData}
            dependencies={[query]}
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
