"use client";

import { useMemo } from "react";
import { fetchSearchMulti, TrendingItem } from "@/lib/tmdb";
import { VirtualGrid } from "../shared/VirtualGrid";

interface SearchVirtualGridProps {
    initialItems: TrendingItem[];
    query: string;
}

export const SearchVirtualGrid = ({ initialItems, query }: SearchVirtualGridProps) => {
    const fetchData = useMemo(
        () => async (page: number) => {
            const result = await fetchSearchMulti({ 
                query, 
                page 
            });
            return result.results;
        },
        [query]
    );

    return (
        <VirtualGrid
            initialItems={initialItems}
            fetchData={fetchData}
            dependencies={[query]}
        />
    );
};
