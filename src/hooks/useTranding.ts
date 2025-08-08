'use client';

import { useState, useEffect } from "react";
import { fetchTrending, TrendingItem, TrendingOptions } from "@/lib/tmdb";

export const useTrending = (
    opts? : TrendingOptions,
    limit? : number
) => {
    const [items, setItems] = useState<TrendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchTrending(opts)
            .then(data => setItems(data.slice(0, limit)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [opts?.mediaType, opts?.timeWindow, opts?.language]);

    return { items, loading, error };
}