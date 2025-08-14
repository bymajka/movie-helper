"use client";

import { useMemo } from "react";
import { fetchDiscover, TrendingItem } from "@/lib/tmdb";
import { useFilterStore } from "@/stores/filterStore";
import { VirtualGrid } from "../shared/VirtualGrid";

interface DiscoverVirtualGridProps {
    initialItems: TrendingItem[];
}

export const DiscoverVirtualGrid = ({ initialItems }: DiscoverVirtualGridProps) => {
    const { selectedMediaTypes, selectedGenres, rating_gte, rating_lte } = useFilterStore();

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
                mediaTypes.map((mt) => fetchDiscover({ 
                    mediaType: mt, 
                    page,
                    ...commonOpts 
                }))
            );
            return results.flat();
        },
        [mediaTypes, commonOpts]
    );

    return (
        <VirtualGrid
            initialItems={initialItems}
            fetchData={fetchData}
            dependencies={[mediaTypes, commonOpts]}
        />
    );
};

